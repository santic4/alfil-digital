import { Router } from 'express'
import { createOrderMP,  webHookMP } from '../../controllers/paymentsControllers/mercadoPagoController.js';
import { logger } from '../../utils/logger.js';

export const MercadoPagoRouter = Router();

MercadoPagoRouter.post('/create-order', createOrderMP)

MercadoPagoRouter.get('/success', (req, res) => {
    logger.info('successsss')
    res.redirect('http://localhost:3000/success');
});

MercadoPagoRouter.get('/failure', (req, res) => {
    res.redirect('http://localhost:3000/checkout');
});

MercadoPagoRouter.get('/pending')

MercadoPagoRouter.post('/webhook', webHookMP)