import { paymentsRepositoryPP } from "../../repository/payments/paymentsRepositoryPP.js";
import { findTransactionByPaymentId, saveTransactionWithToken, updateTransactionStatus } from "../transactions/transactionServicesMP.js";

class PaymentsServicesPP{
    async createOrderPP(currency_selected, amountUSD, emailSend, carrito, externalReference){
        
        const nombresArchivos = carrito.reduce((acc, item) => {
            return acc.concat(item.productID.fileadj);
        }, []);

        const response = await paymentsRepositoryPP.createOrderPP(currency_selected, amountUSD, externalReference);

        const approvalUrl = response.data.links.find(link => link.rel === 'approve').href;
        const payment_id = response.data.id;
      
        if(!approvalUrl || !payment_id){
          throw new Error('No se puede realizar el pago.')
        }

        await saveTransactionWithToken(emailSend, externalReference, payment_id, nombresArchivos);

        return approvalUrl
    }

    async captureOrderPP(token){
        
        const response = await paymentsRepositoryPP.createOrderPP(token);

        const referenceId = response.data.purchase_units[0].reference_id;
        const paymentId = response.data.id;
    
        await updateTransactionStatus(referenceId, response.data.status, paymentId);

        const foundedTransaction = await findTransactionByPaymentId(paymentId)
    
        return foundedTransaction
    }


}

export const paymentsServicesPP = new PaymentsServicesPP()