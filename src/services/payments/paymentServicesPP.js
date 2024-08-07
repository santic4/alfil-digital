import { paymentsRepositoryPP } from "../../repository/payments/paymentsRepositoryPP.js";
import { findTransactionByPaymentId, saveTransactionWithToken, updateTransactionStatus } from "../transactions/transactionServicesMP.js";

class PaymentsServicesPP {
    async createOrderPP(currency_selected, amountUSD, emailSend, carrito, externalReference) {
      try {
        
        // Validar los parámetros de entrada
        if (!currency_selected || !amountUSD || !emailSend || !carrito || !externalReference) {
          throw new Error('Token no existe');
        }
  
        // Obtener los nombres de los archivos del carrito
        const nombresArchivos = carrito.reduce((acc, item) => acc.concat(item.productID.fileadj), []);
  
        console.log(nombresArchivos,'nombres archivos')
        // Crear la orden
        const response = await paymentsRepositoryPP.createOrderPP(currency_selected, amountUSD, externalReference);
  
        // Obtener la URL de aprobación y el ID de pago
        const approvalUrl = response.data.links.find(link => link.rel === 'approve')?.href;
        const payment_id = response.data.id;
  
        // Verificar que se haya obtenido la URL de aprobación y el ID de pago
        if (approvalUrl && payment_id) {
          await saveTransactionWithToken(emailSend, externalReference, payment_id, nombresArchivos);
        } else {
          throw new Error('No se puede realizar el pago.');
        }
  
        return approvalUrl;
      } catch (error) {
        console.error('Error en createOrderPP:', error);
        throw new Error('No se puede realizar el pago.');
      }
    }
  
    async captureOrderPP(token) {
      try {
        // Validar el token
        if (!token) {
          throw new Error('Token no existe');
        }
        // Capturar la orden
        const response = await paymentsRepositoryPP.captureOrderPP(token);
  
        // Obtener el ID de referencia y el ID de pago
        const referenceId = response.data.purchase_units[0].reference_id;
        const paymentId = response.data.id;
        // Verificar que se haya obtenido el ID de referencia y el ID de pago
        if (referenceId && paymentId && response) {
          console.log('referenceId && paymentId && response',referenceId, paymentId, response)
          await updateTransactionStatus(referenceId, response.data.status, paymentId);
        } else {
          throw new Error('No se puede realizar el pago.');
        }
  
        // Buscar la transacción por el ID de pago
        const foundedTransaction = paymentId ? await findTransactionByPaymentId(paymentId) : null;

        return foundedTransaction;
      } catch (error) {
        console.error('Error en captureOrderPP:', error);
        throw new Error('No se puede realizar el pago.');
      }
    }
  }
  
  export const paymentsServicesPP = new PaymentsServicesPP();