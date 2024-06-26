import { Router } from 'express'
import mercadopago from 'mercadopago';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { generateToken } from '../../utils/cryptografia.js';
import { saveTransactionWithToken } from '../../services/transactionServices.js';

export const CardsPay = Router();

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000, idempotencyKey: 'abc' }
})

CardsPay.post('/create_preference-cards', async (req, res) => {
    const carrito = req.body;
    const externalReference = generateToken();
    const { cartId } = req.query;

    const preference = new Preference(client);
    try {
        const response = await preference.create({
            items: carrito,
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: [],
                installments: 1
            },
            back_urls: {
                success: 'https://tu-sitio.com/success',
                failure: 'https://tu-sitio.com/failure',
                pending: 'https://tu-sitio.com/pending'
            },
            notification_url: 'https://alfil-digital.onrender.com/api//webhook',
            external_reference: externalReference
        });

        if(cartId && externalReference){
            await saveTransactionWithToken(cartId, externalReference);
        }

        console.log(response,' resposne cards ')
  
        res.status(200).json(response);
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        res.status(500).send('Error al crear la preferencia');
    }
});

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