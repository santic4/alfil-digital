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
        const { token, issuer_id, payment_method_id, transaction_amount, installments, payer } = req.body;
        const { cartId } = req.query;
        const externalReference = payer.email;
        const application = new Payment(client);
        console.log('cosas 1', req.body)
 
        const payment_data = {
            transaction_amount: Number(transaction_amount),
            token,
            description: 'dsdfgsdfsfg',
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
    const { id, status } = req.body
    console.log(req.body,' body en webhook cards')
    try {
        if (status === 'approved') {

            const captureResult = await application.get({
                id: id,
                requestOptions: {
                    idempotencyKey: 'abc'
                }
            });

            if (captureResult.status !== 'approved' ) {
                return res.status(400).json({ error: 'El pago no fue aprobado.' });
            }

            if (captureResult.status === 'approved' ) {
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