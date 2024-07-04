import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { saveTransactionCart } from '../../services/transactionsCardServices.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000 }
})

export const proccessPaymentCard = async (req, res) => {
    try {
        const { token, issuer_id, payment_method_id, installments, transaction_amount, description, payer } = req.body;
        const application = new Payment(client);
        const { cartId } = req.query;

        const payment_data = {
            transaction_amount,
            token,
            description,
            installments,
            payment_method_id,
            issuer_id,
            payer: {
                email: payer.email,
                identification: {
                    type: payer.identification.type,
                    number: payer.identification.number,
                }
            },
            three_d_secure_mode: 'optional'
        };

        const payment = await application.create({ body: payment_data, requestOptions: { idempotencyKey: 'abc' } });

        console.log(payment,'payment en el back que necesito')
        
        if (payment.status_detail === 'accredited') {
            await saveTransactionCart(cartId, payment.id, payment.status_detail);
            res.json({ status: payment.status, status_detail: payment.status_detail, id: payment.id });
        } else {
            res.json({
                status: payment.status,
                status_detail: payment.status_detail,
                id: payment.id,
                three_ds_info: payment.three_ds_info
            });
        }

    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).send('Error al procesar el pago');
    }
};