import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { saveTransactionCart } from '../../services/transactionsCardServices.js';


const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000 }
})

export const proccessPaymentCard = async (req, res) => {
    try {
        const { token, issuer_id, payment_method_id, transaction_amount, installments } = req.body;
        const body = req.body
        const application = new Payment(client);
        const { cartId } = req.query;
        const idempotencyKey = req.headers['x-idempotency-key'];

        console.log('cosas 1', req.body)
        
        const email = body.payer.email;
        const type = body.payer.identification.type;
        const number = body.payer.identification.number;

        const payment_data = {
            transaction_amount: Number(transaction_amount),
            token,
            description: 'Asistencia informatica',
            installments: Number(installments),
            payment_method_id,
            issuer_id,
            payer: {
                email: email,
                identification: {
                    type: type,
                    number: number
                }
            },
            three_d_secure_mode: 'optional'
        };
   

        const payment = await application.create({
            body: payment_data,
            requestOptions: {
                idempotencyKey: idempotencyKey // Usar idempotencyKey en la solicitud a Mercado Pago
            }
        });

        if(payment.status_detail === 'accredited'){
            await saveTransactionCart(cartId, payment.id, payment.status_detail) 
            // aca habria que hacer todo lo que te pido chat gpt 
        }

        console.log(payment,'payment en cardsPay')

        res.status(201).json(payment);
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).send('Error al procesar el pago');
    }
}
