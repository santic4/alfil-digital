import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { logger } from '../../utils/logger.js';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { generateToken } from '../../utils/cryptografia.js';
import { findTransactionByExternalReference, saveTransactionWithToken, updateTransactionStatus } from '../../services/transactionServices.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000, idempotencyKey: 'abc' }
})

export const createOrderMP = async (req, res) => {
    const carrito = req.body
    const { cartId } = req.query;
    const externalReference = generateToken();

    try {
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

        // Validar que cada item en el carrito tenga los campos necesarios
        carrito.forEach(item => {
            if (!item.id || !item.title || !item.quantity || !item.unit_price) {
                throw new Error('Uno o más artículos del carrito no tienen todos los campos necesarios.');
            }
        });


        const payerForPreference = {
            name: 'NA4L',
            surname: 'CA44 C44LIA',
            email: 'nahue44446_06@hotmail.com',
            phone: {
                area_code: '2342',
                number: '466444'
            },
            identification: {
                type: 'DNI',
                number: '394444440'
            }

        };

        const response = await preference.create({
            body: {
                items: carrito,
                payer: payerForPreference,
                back_urls: {
                    success: 'https://alfil-digital.onrender.com/',
                    failure: 'https://alfil-digital.onrender.com/',
                    pending: 'https://alfil-digital.onrender.com/'
                } 
                ,
                notification_url: 'https://alfil-digital.onrender.com/api/mercado-pago/webhook',
                external_reference: externalReference,
                auto_return: 'approved'
            }
        });

        console.log(response, 'preferenec create')

        if(cartId && externalReference){
            await saveTransactionWithToken(cartId, externalReference);
        }else{
            console.log('falta data',cartId, externalReference)
        }

        res.status(200).json(response);
    } catch (error) {
        logger.error('Error al crear la preferencia:', error);
        res.sendStatus(200);
    }
}

export const successOrder = async (req, res) => {
    try {
        const{ status, payment_id, external_reference} = req.query;

        const transaction = await findTransactionByExternalReference(external_reference);

        
        console.log(status,' success.status ',payment_id ,'success.payment_id',external_reference ,'success.external_reference' )

        if (transaction && status === 'approved' && payment_id) {
          
            res.redirect(`https://alfil-digital.onrender.com?payment_id=${payment_id}`);
        } else {
            throw new Error('Transacción no encontrada o no coincide con el external_reference');
        }

    } catch (error) {
        res.status(500).json({ error: 'Error al redireccionar al success.' });
    }
};

export const webHookMP = async (req, res) => {
    try {
        const application = new Payment(client);
        const payment = req.query;

        console.log('Payment received:', payment);

        if (payment.type === 'payment') {

            const captureResult = await application.capture({
                id: payment['data.id'],
                requestOptions: {
                    idempotencyKey: 'abc'
                }
            });
            console.log('Captura exitosa:', captureResult);

            if (captureResult.status !== 'approved' ) {
                return res.status(400).json({ error: 'El pago no fue aprobado.' });
            }

            if (captureResult.status === 'approved' ) {
                const updTrans = await updateTransactionStatus(captureResult.external_reference, captureResult.status, captureResult.id);
                console.log('Captura exitosa approved dentro:', updTrans);
                console.log('Archivos enviados');
            }

            res.status(200);
        } else {
            throw new Error('Tipo de pago no reconocido o no es un pago');
        }
    } catch (error) {
        logger.error(error, 'Error al procesar el pago');
        res.status(500).send('Error al procesar el pago');
    }
};
