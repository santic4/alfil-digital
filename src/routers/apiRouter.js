import { Router } from 'express'
import { errorHandlerLogger } from '../utils/errorsLogger.js'
import { errorHandler } from '../middlewares/errorHandler.js'
import { metodosPersonalizados } from '../middlewares/respuestasMejoradas.js'
import { usersRouter } from './users/usersRouter.js'
import { sessionRouter } from './users/sessionRouter.js'
import { carritoRouter } from './carrito/carritoRouter.js'
import { productsRouter } from './products/productsRouter.js'
import { PayPalRouter } from './paymentsRouter/payPalRouter.js'
import { MercadoPagoRouter } from './paymentsRouter/mercadoPagoRouter.js'
import { categoryRouter } from './products/categoryRouter.js'
import { CardsPay } from './paymentsRouter/cardsPay.js'
import { TransactionGet } from './download/transactionsGet.js'
import { checkoutRouter } from './download/downloadRouter.js'

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
apiRouter.use('/cards', CardsPay)
apiRouter.use('/transactions', TransactionGet)
apiRouter.use('/checkout', checkoutRouter)

// MIDDLEWARES

apiRouter.use(errorHandlerLogger)
apiRouter.use(errorHandler)
