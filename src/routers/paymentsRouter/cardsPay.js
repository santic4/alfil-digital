import { Router } from 'express'

import { proccessPaymentCard } from '../../controllers/paymentsControllers/cardsPayController.js';
import { webHookMP } from '../../controllers/paymentsControllers/mercadoPagoController.js';

export const CardsPay = Router();

CardsPay.post('/process_payment', 
    proccessPaymentCard
);


CardsPay.post('/webhook', webHookMP)