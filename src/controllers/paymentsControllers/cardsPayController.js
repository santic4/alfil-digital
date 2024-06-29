import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { saveTransactionWithToken, updateTransactionStatus } from '../../services/transactionServices.js';
import { generateToken } from '../../utils/cryptografia.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000, idempotencyKey: 'abc' }
})

export const createOrderMPCards = async (req, res) => {
    const carrito = req.body
    const externalReference = generateToken();

    try {
        const preference = new Preference(client);
        if (!carrito || !externalReference) {
            throw new Error('Falta información requerida (carrito o externalReference)');
        }

        // Crear la preferencia de pago
        const response = await preference.create({
            body: {
                items: carrito,
                back_urls: {
                    success: 'https://alfil-digital.onrender.com/success', // URL de éxito
                    failure: 'https://alfil-digital.onrender.com/failure', // URL de fallo
                    pending: 'https://alfil-digital.onrender.com/pending'
                } 
                ,
                notification_url: 'https://alfil-digital.onrender.com/api/cards/payment_webhook',
                external_reference: externalReference,
                auto_return: 'approved'
            }
        });

        console.log(response, 'preferenec create')

        res.status(200).json(response);
    } catch (error) {
        res.sendStatus(200);
    }
}

export const proccessPaymentCard = async (req, res) => {
    try {
        const { token, issuer_id, payment_method_id, transaction_amount, installments, payer } = req.body;
        const { cartId } = req.query;
        const externalReference = payer.email;
        const application = new Payment(client);
        console.log('cosas 1', req.body,' payer', payer)
 
        const payment_data = {
            transaction_amount: Number(transaction_amount),
            token,
            description: 'Asistencia informatica',
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
   

        const payment = await application.create({ body: payment_data });

        if(cartId && externalReference){
            await saveTransactionWithToken(cartId, externalReference);
        }else{
            console.log('falta data',cartId, externalReference)
        }

        console.log(payment,'payment en cardsPay')

        res.status(201).json(payment);
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).send('Error al procesar el pago');
    }
}

export const webHookCardsMP = async (req, res) => {
    const application = new Payment(client);
    const { id, type, data } = req.body
    const payment = req.query;
    console.log(req.body,' body en webhook cards')
    try {
        if (payment.type === 'payment') {

            const captureResult = await application.get({
                id: payment['data.id'],
                requestOptions: {
                    idempotencyKey: 'abc'
                }
            });

            console.log(captureResult,'catureeeee')

            if (captureResult.money_release_status !== 'approved' ) {
                return res.status(400).json({ error: 'El pago no fue aprobado.' });
            }

            if (captureResult.money_release_status === 'approved' ) {
                const updTrans = await updateTransactionStatus(captureResult.payer?.email, captureResult.status, captureResult.id);
                console.log('Captura exitosa approved dentro:', updTrans);
            }

            console.log('Notificación de pago recibida:', captureResult);

        }
        res.status(200).json();
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).send('Error al procesar el pago');
    }
}