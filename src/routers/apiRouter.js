import { Router } from 'express'
import { errorHandlerLogger } from '../utils/errorsLogger.js'
import { errorHandler } from '../middlewares/errorHandler.js'
import { metodosPersonalizados } from '../middlewares/respuestasMejoradas.js'
import { usersRouter } from './usersRouter.js'
import { sessionRouter } from './sessionRouter.js'
import { carritoRouter } from './carritoRouter.js'
import { productsRouter } from './productsRouter.js'
import { PayPalRouter } from './paymentsRouter/payPalRouter.js'
import { MercadoPagoRouter } from './paymentsRouter/mercadoPagoRouter.js'
import { categoryRouter } from './categoryRouter.js'
import Transaction from '../models/mongoose/transactionSchema.js'

export const apiRouter = Router()

apiRouter.use(metodosPersonalizados)

// END POINTS
apiRouter.use('/users', usersRouter)
apiRouter.use('/session', sessionRouter)
apiRouter.use('/products', productsRouter)
apiRouter.use('/carts', carritoRouter)
apiRouter.use('/paypal', PayPalRouter)
apiRouter.use('/mercado-pago', MercadoPagoRouter)
apiRouter.use('/categories', categoryRouter)

apiRouter.post('/transactions/save-preference', async (req, res) => {
    try {
      const { preferenceId, cart } = req.body;
  
      const newTransaction = new Transaction({
        preferenceId,
        cart,
        status: 'pending' // Estado inicial
      });
  
      await newTransaction.save();
  
      res.status(200).send('Transacción guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar la transacción:', error);
      res.status(500).send('Error al guardar la transacción.');
    }
  });
// MIDDLEWARES

apiRouter.use(errorHandlerLogger)
apiRouter.use(errorHandler)