import { Router } from 'express'
import { createOrderMPCards, proccessPaymentCard, webHookCardsMP } from '../../controllers/paymentsControllers/cardsPayController.js';

export const CardsPay = Router();

CardsPay.post('/create-order', createOrderMPCards);
CardsPay.post('/process_payment', proccessPaymentCard);
CardsPay.post('/webhook', webHookCardsMP);