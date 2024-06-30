import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { ACCESS_TOKEN_MP } from '../../config/config.js';
import { saveTransactionWithToken, updateTransactionStatus } from '../../services/cardsServices.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000, idempotencyKey: 'abc' }
})

export const createOrderMPCards = async (req, res) => {
    const carrito = req.body;
    const { cartId } = req.query;
  
    try {
      const preference = new Preference(client);
      if (!carrito || !cartId) {
        throw new Error('Falta información requerida (carrito o cartId)');
      }
  
      const response = await preference.create({
        body: {
            items: carrito,
            back_urls: {
                success: 'https://alfil-digital.onrender.com/success', // URL de éxito
                failure: 'https://alfil-digital.onrender.com/failure', // URL de fallo
                pending: 'https://alfil-digital.onrender.com/pending'
            } 
            ,
            notification_url: 'https://alfil-digital.onrender.com/api/cards/webhook',
            auto_return: 'approved'
        }
    });
      const paymentId = response.id;
      console.log(paymentId,' paymentId en create order ')
      await saveTransactionWithToken(cartId, paymentId, 'pending');
  
      console.log('paso el save')
      res.status(200).json({ id: paymentId });
    } catch (error) {
      console.error('Error al crear la preferencia:', error);
      res.status(500).send('Error al crear la preferencia');
    }
  };

  export const proccessPaymentCard = async (req, res) => {
    try {
      const { token, issuer_id, payment_method_id, transaction_amount, installments, payer } = req.body;
      const { cartId } = req.query;
  
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
        },
        three_d_secure_mode: 'optional'
      };
  
      const payment = await new Payment(client).create({ body: payment_data });
  
      console.log(payment,' payment en process ')
      if (payment.status === 'approved') {
        await updateTransactionStatus(payment.id, 'approved');
      }
  
      res.status(201).json(payment);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      res.status(500).send('Error al procesar el pago');
    }
  };

  export const webHookCardsMP = async (req, res) => {
    const { type, data } = req.body;
  
    try {
      if (type === 'payment') {
        const captureResult = await new Payment(client).get({ id: data.id });
  
        console.log(captureResult,'result en hook')
        if (captureResult.status === 'approved') {
          await updateTransactionStatus(captureResult.id, 'approved');
        }
  
        console.log('Notificación de pago recibida:', captureResult);
      }
      res.status(200).json();
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      res.status(500).send('Error al procesar el pago');
    }
  };