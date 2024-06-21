import { Router } from 'express'
import { createOrderMP,  successOrder,  webHookMP } from '../../controllers/paymentsControllers/mercadoPagoController.js';

export const MercadoPagoRouter = Router();

MercadoPagoRouter.post('/create-order', createOrderMP)

MercadoPagoRouter.get('/success', successOrder);

MercadoPagoRouter.get('/failure', (req, res) => {
    res.redirect('/checkout'); 
});

MercadoPagoRouter.get('/pending', (req, res) => {
    res.redirect('/checkout'); 
});


MercadoPagoRouter.post('/webhook', webHookMP)

/*
    ID PREFERENCE = 151622720-811d0afa-4026-4308-9961-d778f18cef03

*/