import { Router } from 'express'
import { createOrderMP, successPayMP, webHookMP } from '../../controllers/paymentsControllers/mercadoPagoController.js';

export const MercadoPagoRouter = Router();

MercadoPagoRouter.post('/create-order', createOrderMP)

MercadoPagoRouter.get('/success', successPayMP)

MercadoPagoRouter.get('/failure')

MercadoPagoRouter.get('/pending')

MercadoPagoRouter.post('/webhook', webHookMP)