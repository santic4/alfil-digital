import { Router } from 'express'
import mercadopago from 'mercadopago';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { ACCESS_TOKEN_MP } from '../../config/config.js';

export const CardsPay = Router();

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000, idempotencyKey: 'abc' }
})

CardsPay.post('/process_payment', async (req, res) => {
    try {
        const { token, issuer_id, payment_method_id, transaction_amount, installments, payer } = req.body;

        const payment_data = {
            transaction_amount: Number(transaction_amount),
            token,
            description: 'Descripción del producto',
            installments: Number(installments),
            payment_method_id,
            issuer_id,
            payer: {
                email: payer.email,
                identification: {
                    type: payer.identification.type,
                    number: payer.identification.number
                }
            }
        };
        const application = new Payment(client);
        const payment = await application.create({ body: payment_data });
        console.log(payment,'payment en cardsPay')
        res.status(201).json(payment);
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).send('Error al procesar el pago');
    }
});