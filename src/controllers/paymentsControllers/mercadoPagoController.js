import mercadopago, { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { logger } from '../../utils/logger.js';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { generateToken } from '../../utils/cryptografia.js';
import { findTransactionByExternalReference, saveTransactionWithToken, updateTransactionStatus } from '../../services/transactionServices.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 5000, idempotencyKey: 'abc' }
})

export const createOrderMP = async (req, res) => {
    const carrito = req.body
    const { cartId } = req.query;
    const externalReference = generateToken();

    console.log(cartId,'CARTID')
    try {
        const preference = new Preference(client);
        if (!carrito || !externalReference) {
            throw new Error('Falta información requerida (carrito o externalReference)');
        }

        // Crear la preferencia de pago
        const response = await preference.create({
            body: {
                payment_methods: {
                    excluded_payment_methods: [],
                    excluded_payment_types: [{ id: "ticket" }],
                    installments: 1
                },
                items: carrito,
                back_urls: {
                    success: 'https://alfil-digital.onrender.com/success', // URL de éxito
                    failure: 'https://alfil-digital.onrender.com/', // URL de fallo
                    pending: 'https://alfil-digital.onrender.com/pending'
                } 
                ,
                notification_url: 'https://alfil-digital.onrender.com/api/mercado-pago/webhook',
                external_reference: externalReference,
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

        
        console.log(status,' captureResult.status ',payment_id ,'payment_id',external_reference ,'external_reference' )

        if (transaction && status === 'approved' && payment_id) {
            const updTrans = await updateTransactionStatus(external_reference, status, payment_id);
            console.log('guardadocorrecto', updTrans)
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

            if (captureResult.status !== 'approved' ) {
                return res.status(400).json({ error: 'El pago no fue aprobado.' });
            }


            console.log('Captura exitosa:', captureResult);

            res.status(200).send('OK');
        } else {
            throw new Error('Tipo de pago no reconocido o no es un pago');
        }
    } catch (error) {
        logger.error(error, 'Error al procesar el pago');
        res.status(500).send('Error al procesar el pago');
    }
};
