import { Router } from 'express'
import { generateToken } from '../../utils/cryptografia.js';
import { saveTransactionWithToken } from '../../services/transactionServices.js';
import { proccessPaymentCard, webHookCardsMP } from '../../controllers/paymentsControllers/cardsPayController.js';

export const CardsPay = Router();


CardsPay.post('/create_preference-cards', async (req, res) => {
    const externalReference = generateToken();
    const { cartId } = req.query;

    try {

        if(cartId && externalReference){
            await saveTransactionWithToken(cartId, externalReference);
        }

  
        res.status(200).json();
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        res.status(500).send('Error al crear la preferencia');
    }
});

CardsPay.post('/process_payment', 
    proccessPaymentCard
);

CardsPay.post('/payment_webhook', 
    webHookCardsMP
);

