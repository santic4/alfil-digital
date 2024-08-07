import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { findTransactionByPaymentId, saveTransactionWithToken, updateTransactionStatusMercadoPago } from '../transactions/transactionServicesMP.js';
import { DataInvalid } from '../../models/errors/dataInvalid.js';
import { ACCESS_TOKEN_MP } from '../../config/config.js';

const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-1227822103444956-080520-53275b0d9ad4e50c67e4ca1644f21086-674717908',
    options: { timeout: 10000, idempotencyKey: 'abc' }
})

class PaymentsServicesMP{

    async createOrder(items, carrito, emailSend, externalReference){

        try {

            if (!carrito || !externalReference) {
                throw new Error('Falta información requerida (carrito o externalReference)');
            }

            if (!carrito || carrito.length === 0) {
                throw new Error('El carrito está vacío o no fue proporcionado.');
            }

            if (!externalReference) {
                throw new Error('No se pudo generar una referencia externa.');
            }

            carrito.forEach(item => {
                if (!item.id || !item.title || !item.quantity || !item.unit_price) {
                    throw new Error('Uno o más artículos del carrito no tienen todos los campos necesarios.');
                }
            });
            const preference = new Preference(client);

            console.log('antes de response en create')
            const response = await preference.create({
                body: {
                    additional_info: 'ALFIL DIGITAL',
                    auto_return: 'approved',
                    back_urls: {
                        success: 'https://alfil-digital.onrender.com/',
                        failure: 'https://alfil-digital.onrender.com/',
                        pending: 'https://alfil-digital.onrender.com/'
                    },
                    expiration_date_from: new Date().toISOString(),
                    expiration_date_to: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), 
                    expires: false,
                    external_reference: externalReference,
                    items: carrito,
                    notification_url: 'https://alfil-digital.onrender.com/api/cards/webhook',
                    payer: {
                        name: 'Nahuel',
                        surname: 'Canu Corniglia',
                        email: 'nahuel_1996_06@hotmail.com',
                        phone: {
                            area_code: '2346',
                            number: '466693'
                        },
                        identification: {
                            type: 'DNI',
                            number: '39485990'
                        },
                        address: {
                            zip_code: '6640',
                            street_name: 'Rauch',
                            street_number: '942'
                        },
                        date_created: new Date().toISOString()
                    },
                    payment_methods: {
                        excluded_payment_methods: [],
                        excluded_payment_types: [],
                        installments: 10,
                        default_installments: 1
                    }
                }
            });

            console.log(response,'response en create')

            console.log(items,'itemssss')

            if(emailSend && externalReference){
                await saveTransactionWithToken(emailSend, externalReference, response.id, items );
            }else{
                throw new DataInvalid()
            }        

            return response
        } catch (error) {
        console.error('Error en createOrderMP:', error);
        throw new Error('No se puede realizar el pago.');
        }
    }

    async webHook(payment){
        const application = new Payment(client);
            try {

          
                if (payment.type === 'payment') {
            
                const captureResult = await application.capture({
                    id: payment['data.id'],
                    requestOptions: {
                        idempotencyKey: 'abc'
                    }
                });


                console.log(captureResult,'capture result en services ')
                if (captureResult.status !== 'approved' ) {
                    throw new Error('Pago rechazado.')
                }
            
                if (captureResult.status_detail === 'accredited' ) {
                    await updateTransactionStatusMercadoPago(captureResult.external_reference, captureResult.status_detail, captureResult.id);
                }

                        // Buscar la transacción por el ID de pago
                const foundedTransaction = payment['data.id'] ? await findTransactionByPaymentId(payment['data.id']) : null;
                console.log(foundedTransaction, 'foundedTransaction');

                return foundedTransaction;
            
              } else {
                  throw new Error('Tipo de pago no reconocido o no es un pago');
              }

            }catch (error) {
                console.error('Error en createOrderMP:', error);
                    throw new Error('No se puede realizar el pago.');
            }
    }
}

export const paymentsServicesMP = new PaymentsServicesMP()