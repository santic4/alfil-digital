import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { saveTransactionWithToken, updateTransactionStatus } from '../transactions/transactionServicesMP.js';
import { DataInvalid } from '../../models/errors/dataInvalid.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000, idempotencyKey: 'abc' }
})

class PaymentsServicesMP{
    async createOrder(items, carrito, emailSend, externalReference){

        try {
            console.log(items,'items', carrito,'carrito',emailSend,'emailSend', externalReference,'externalReference')
            const preference = new Preference(client);

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

            const response = await preference.create({
                body: {
                    items: carrito,
                    back_urls: {
                        success: 'https://alfil-digital.onrender.com',
                        failure: 'https://alfil-digital.onrender.com',
                        pending: 'https://alfil-digital.onrender.com'
                    } 
                    ,
                    notification_url: 'https://alfil-digital.onrender.com/api/cards/webhook',
                    external_reference: externalReference,
                    auto_return: 'approved'
                }
            });

            console.log(response.id,' response id mercado pago create ')

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

        if (payment.type === 'payment') {

            const captureResult = await application.capture({
                id: payment['data.id'],
                requestOptions: {
                    idempotencyKey: 'abc'
                }
            });

            if (captureResult.status !== 'approved' ) {
                throw new Error('Pago rechazado.')
            }

            if (captureResult.status_detail === 'accredited' ) {
                await updateTransactionStatus(captureResult.external_reference, captureResult.status_detail, captureResult.id);
            }

        } else {
            throw new Error('Tipo de pago no reconocido o no es un pago');
        }

    }
}

export const paymentsServicesMP = new PaymentsServicesMP()