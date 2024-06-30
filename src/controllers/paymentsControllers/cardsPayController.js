import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { saveTransactionWithToken, updateTransactionStatus } from '../../services/transactionServices.js';
import { generateToken } from '../../utils/cryptografia.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000, idempotencyKey: 'abc' }
})

export const proccessPaymentCard = async (req, res) => {
    try {
        const { token, issuer_id, payment_method_id, transaction_amount, installments} = req.body;
        const application = new Payment(client);
        console.log('cosas 1', req.body)

            const email = 'nahuel_1996_06@hotmail.com'
            const type = 'DNI'
            const number = '39485990'
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
   

        const payment = await application.create({ body: payment_data });

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
    console.log(req.body,' body en webhook cards')
    try {
        if (type === 'payment') {

            const captureResult = await application.get({
                id: data.id,
                requestOptions: {
                    idempotencyKey: 'abc'
                }
            });

            if (captureResult.status !== 'approved' ) {
                return res.status(400).json({ error: 'El pago no fue aprobado.' });
            }

            if (captureResult.status === 'approved' ) {
                const updTrans = await updateTransactionStatus(captureResult.external_reference, captureResult.status, captureResult.id);
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