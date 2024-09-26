import { Router } from 'express';
import { cancelOrder, captureOrder, converterCurreny, createOrder } from '../../controllers/paymentsControllers/PayPalController.js';

export const PayPalRouter = Router();

// Rutas para crear y capturar la orden
PayPalRouter.post('/create-order', createOrder);
PayPalRouter.post('/capture-order/:token', captureOrder); // Cambio para obtener token en params
PayPalRouter.get('/cancel-order', cancelOrder);

// Ruta para convertir moneda
PayPalRouter.post('/converter-currency', converterCurreny);