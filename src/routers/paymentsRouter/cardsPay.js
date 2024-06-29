import { Router } from 'express'
import { createOrderMPCards, proccessPaymentCard, webHookCardsMP } from '../../controllers/paymentsControllers/cardsPayController.js';

export const CardsPay = Router();

CardsPay.post('/create_preference_cards_mp', createOrderMPCards)

CardsPay.post('/process_payment', 
    proccessPaymentCard
);

CardsPay.post('/payment_webhook', 
    webHookCardsMP
);

