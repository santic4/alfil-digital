import { Router } from 'express'
import { createOrderMP,  successOrder,  webHookMP } from '../../controllers/paymentsControllers/mercadoPagoController.js';
import { logger } from '../../utils/logger.js';


export const MercadoPagoRouter = Router();

MercadoPagoRouter.post('/create-order', createOrderMP)

MercadoPagoRouter.get('/success', 
    successOrder
);

MercadoPagoRouter.get('/failure',  (req, res) => {
    logger.info(req.url)
    console.log('el fallo 420'); 
});

MercadoPagoRouter.get('/pending', (req, res) => {
    res.redirect('/checkout'); 
});


MercadoPagoRouter.post('/webhook', webHookMP)

