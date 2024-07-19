import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { logger } from '../../utils/logger.js';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { generateToken } from '../../utils/cryptografia.js';
import { findTransactionByPaymentId, saveTransactionWithToken, updateTransactionStatus } from '../../services/transactionServicesMP.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000, idempotencyKey: 'abc' }
})

export const createOrderMP = async (req, res) => {
    const { items, carrito } = req.body;
    const { emailSend } = req.query;
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
            console.log('falta data',emailSend, externalReference,)
        }

        res.status(200).json(response);
    } catch (error) {
        logger.error('Error al crear la preferencia:', error);
        res.sendStatus(200);
    }
}

export const successOrder = async (req, res) => {
    try {
        const{ payment_id} = req.query;

        if (payment_id) {
            res.redirect(`https://alfil-digital.onrender.com?payment_id=${payment_id}`);
        } else {
            throw new Error('Transacción no encontrada o no coincide con el payment_id');
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

            if (captureResult.status_detail === 'accredited' ) {
                await updateTransactionStatus(captureResult.external_reference, captureResult.status_detail, captureResult.id);
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

export const captureMP = async (req, res) => {
    const payment = req.query;
    console.log(payment,' payment en capture MP ')
    try {
        const foundedTransaction = await findTransactionByPaymentId(payment)

        if(foundedTransaction?.status === 'accredited'){
            return res.json({ 
                status: 'Pago capturado exitosamente',
                cart: foundedTransaction?.carrito || []
              });
        }

    } catch (error) {
        logger.error(error, 'Error al procesar el pago');
        res.status(500).send('Error al procesar el pago');
    }
};
