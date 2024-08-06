import { Router} from 'express'
import { cancelOrder, captureOrder, converterCurreny, createOrder } from '../../controllers/paymentsControllers/PayPalController.js';

export const PayPalRouter = Router()

PayPalRouter.post('/create-order', createOrder)
PayPalRouter.post('/capture-order', captureOrder)
PayPalRouter.get('/cancel-order', cancelOrder)
PayPalRouter.post('/converter-currency', converterCurreny)