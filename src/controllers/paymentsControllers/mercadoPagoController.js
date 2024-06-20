import mercadopago, { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { logger } from '../../utils/logger.js';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { generateToken } from '../../utils/cryptografia.js';
import { saveTransactionWithToken, updateTransactionStatus } from '../../services/transactionServices.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 5000, idempotencyKey: 'abc' }
})

export const createOrderMP = async (req, res) => {
    const carrito = req.body
    console.log(carrito,'carrito')
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
        // Si llegamos aquí, la preferencia se creó correctamente
        const { init_point, sandbox_init_point } = response;

        // Determinar si estamos en modo sandbox
        const isSandbox = false; // Cambia a false si estás en producción

        console.log(response, 'preferenec create')

       // Genera un token único
       const token = generateToken();
       const transactionId = id; // o cualquier identificador único de la transacción

       // Guarda la transacción y el token en la base de datos
       await saveTransactionWithToken(transactionId, token, 'pending');

       // Construir la URL de redirección
       const urlRedirect = isSandbox ? sandbox_init_point : init_point;
 
       // Redirigir al usuario al proceso de pago en MercadoPago
       res.json({ preferenceId: id, redirectUrl: urlRedirect });
    } catch (error) {
        logger.error('Error al crear la preferencia:', error);
        res.send(500).json({ error: 'Error al crear la preferencia' });
    }
}

export const webHookMP = async (req, res) => {
    try {
        const application = new Payment(client);
        const payment = req.query;

        console.log('Payment received:', payment);

        if (payment.type === 'payment') {
            // Captura el pago usando async/await
            const captureResult = await application.capture({
                id: payment['data.id'],
                requestOptions: {
                    idempotencyKey: 'abc'
                }
            });

            console.log('Captura exitosa:', captureResult);
            logger.info('Captura exitosa:', captureResult);
            await updateTransactionStatus(payment['data.id'], 'paid');

            res.status(200).send('OK');
        } else {
            // Maneja otros tipos de pago o errores aquí si es necesario
            throw new Error('Tipo de pago no reconocido o no es un pago');
        }
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        logger.error(error, 'Error al procesar el pago');
        res.status(500).send('Error al procesar el pago');
    }
};
