import { Router } from 'express'
import { generateToken } from '../../utils/cryptografia.js';
import { saveTransactionWithToken } from '../../services/transactionServices.js';
import { proccessPaymentCard, webHookCardsMP } from '../../controllers/paymentsControllers/cardsPayController.js';

export const CardsPay = Router();

CardsPay.post('/process_payment', 
    proccessPaymentCard
);

CardsPay.post('/payment_webhook', 
    webHookCardsMP
);

