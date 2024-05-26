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

// MIDDLEWARES

apiRouter.use(errorHandlerLogger)
apiRouter.use(errorHandler)