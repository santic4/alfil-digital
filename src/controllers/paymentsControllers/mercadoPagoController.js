import mercadopago, { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { logger } from '../../utils/logger.js';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { generateToken } from '../../utils/cryptografia.js';
import { updateTransactionStatus } from '../../services/transactionServices.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 5000, idempotencyKey: 'abc' }
})

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
                notification_url: 'https://alfil-digital.onrender.com/api/mercado-pago/webhook'
            }
        });

        const { id } = response;

        console.log(response, 'preferenec create')

       res.json({ preferenceId: id });
    } catch (error) {
        logger.error('Error al crear la preferencia:', error);
        res.send(500).json({ error: 'Error al crear la preferencia' });
    }
}
export const successOrder = async (req, res) => {
    try {
        const { status, preference_id } = req.query;

        if (!status || !preference_id) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos' });
        }

        const updatedTransaction = await updateTransactionStatus(preference_id, status);

        if (updatedTransaction) {
            res.status(200).json({ message: 'Estado de la transacción actualizado correctamente', transaction: updatedTransaction });
        } else {
            res.status(404).json({ error: 'Transacción no encontrada' });
        }
    } catch (error) {
        logger.error('Error al actualizar el estado de la transacción:', error);
        res.status(500).json({ error: 'Error al actualizar el estado de la transacción' });
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

            logger.info('Captura exitosa:', captureResult);

            res.status(200).send('OK');
        } else {
            throw new Error('Tipo de pago no reconocido o no es un pago');
        }
    } catch (error) {
        logger.error(error, 'Error al procesar el pago');
        res.status(500).send('Error al procesar el pago');
    }
};
