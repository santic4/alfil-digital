import mercadopago, { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { logger } from '../../utils/logger.js';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { generateToken } from '../../utils/cryptografia.js';
import { findTransactionByExternalReference, updateTransactionStatus } from '../../services/transactionServices.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 5000, idempotencyKey: 'abc' }
})
const externalReference = generateToken();

export const createOrderMP = async (req, res) => {
    const carrito = req.body

    try {
        const preference = new Preference(client);

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
                    failure: 'https://alfil-digital.onrender.com/checkout', // URL de fallo
                    pending: 'https://alfil-digital.onrender.com/checkout'
                } 
                ,
                notification_url: 'https://alfil-digital.onrender.com/api/mercado-pago/webhook',
                external_reference: externalReference,
            }
        });

        const { id } = response;

        const cartID = carrito._id
        console.log(response, 'preferenec create')

        await fetch(`/api/transactions/save-preference`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartID, externalReference }),
        });

        res.sendStatus(200); 
    } catch (error) {
        logger.error('Error al crear la preferencia:', error);
        res.sendStatus(200);
    }
}
export const successOrder = async (req, res) => {
    try {
        res.redirect('https://alfil-digital.onrender.com/success')
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
            const externalReference = payment['data.external_reference'];
            const transaction = await findTransactionByExternalReference(externalReference);
            const captureResult = await application.capture({
                id: payment['data.id'],
                requestOptions: {
                    idempotencyKey: 'abc'
                }
            });

            if (captureResult.status !== 'approved' ) {
                return res.status(400).json({ error: 'El pago no fue aprobado.' });
            }

            console.log(captureResult.status,' captureResult.status ')
            if (transaction && captureResult.status === 'approved') {
                await updateTransactionStatus(externalReference, captureResult.status);
   
                res.status(200).send('OK');
            } else {
                throw new Error('Transacción no encontrada o no coincide con el external_reference');
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
