import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { saveTransactionCart } from '../../services/transactionsCardServices.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000, idempotencyKey: 'abc' }
})

export const proccessPaymentCard = async (req, res) => {
    try {
        const { token, issuer_id, payment_method_id, installments, transaction_amount, description, payer } = req.body;
        const application = new Payment(client);
        const { cartId } = req.query;

        console.log('cosas 1', req.body)

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
            }
        };
   

        const payment = await application.create(payment_data);
        console.log(payment,'payment en cardsPay')
        if(payment.status_detail === 'accredited'){
            await saveTransactionCart(cartId, payment.id, payment.status_detail) 
            // aca habria que hacer todo lo que te pido chat gpt 
        }

  

        res.json({ status: payment.body.status, status_detail: payment.body.status_detail, id: payment.body.id });
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).send('Error al procesar el pago');
    }
}
