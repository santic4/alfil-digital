import { Router} from 'express'
import { cancelOrder, captureOrder, converterCurreny, createOrder } from '../../controllers/paymentsControllers/PayPalController.js';

export const PayPalRouter = Router()

//const environment = new paypal.core.SandboxEnvironment(PAYPALCLIENTID, PAYPALCLIENTSECRET);
//const client = new paypal.core.PayPalHttpClient(environment);
//
//PayPalRouter.post('/pagar', async (req, res) => {
//    const request = new paypal.orders.OrdersCreateRequest();
//    request.prefer("return=representation");
//    request.requestBody({
//      intent: 'CAPTURE',
//      purchase_units: [{
//        amount: {
//          currency_code: 'USD',
//          value: '100.00'
//        }
//      }]
//  });
//
//  try {
//    const response = await client.execute(request);
//    res.json(response.result.links.find(link => link.rel === 'approve').href);
//  } catch (error) {
//    console.error('Error al iniciar el pago:', error);
//    res.status(500).send('Error al iniciar el pago');
//  }
//});


PayPalRouter.post('/create-order', createOrder)
PayPalRouter.post('/capture-order', captureOrder)
PayPalRouter.get('/cancel-order', cancelOrder)
PayPalRouter.post('/converter-currency', converterCurreny)