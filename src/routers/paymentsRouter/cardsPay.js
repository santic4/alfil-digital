import { Router } from 'express'

import { proccessPaymentCard } from '../../controllers/paymentsControllers/cardsPayController.js';

export const CardsPay = Router();

CardsPay.post('/process_payment', 
    proccessPaymentCard
);


