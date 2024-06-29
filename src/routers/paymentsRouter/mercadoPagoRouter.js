import { Router } from 'express'
import { createOrderMP,  successOrder,  webHookMP } from '../../controllers/paymentsControllers/mercadoPagoController.js';


export const MercadoPagoRouter = Router();

MercadoPagoRouter.post('/create-order', createOrderMP)

MercadoPagoRouter.get('/success', 
    successOrder
);

MercadoPagoRouter.get('/failure',  (req, res) => {
    res.redirect('https://alfil-digital.onrender.com/success');
});

MercadoPagoRouter.get('/pending', (req, res) => {
    res.redirect('https://alfil-digital.onrender.com/checkout'); 
});


MercadoPagoRouter.post('/webhook', webHookMP)

