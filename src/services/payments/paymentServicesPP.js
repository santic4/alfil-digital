import { paymentsRepositoryPP } from "../../repository/payments/paymentsRepositoryPP.js";
import { findTransactionByPaymentId, saveTransactionWithToken, updateTransactionStatus } from "../transactions/transactionServicesMP.js";

class PaymentsServicesPP{
    async createOrderPP(currency_selected, amountUSD, emailSend, carrito, externalReference){
        
        if(!currency_selected || !amountUSD || !emailSend || !carrito || !externalReference){
            throw new Error('Token no existe')
        }

        const nombresArchivos = carrito.reduce((acc, item) => {
            return acc.concat(item.productID.fileadj);
        }, []);

        const response = await paymentsRepositoryPP.createOrderPP(currency_selected, amountUSD, externalReference);

        const approvalUrl = response.data.links.find(link => link.rel === 'approve').href;
        const payment_id = response.data.id;
      
        if(approvalUrl && payment_id){
            await saveTransactionWithToken(emailSend, externalReference, payment_id, nombresArchivos);
        }else{
            throw new Error('No se puede realizar el pago.')
        }

        return approvalUrl
    }

    async captureOrderPP(token){

        if(!token){
            throw new Error('Token no existe')
        }
        
        const response = await paymentsRepositoryPP.createOrderPP(token);

        const referenceId = response.data.purchase_units[0].reference_id;
        const paymentId = response.data.id;

        if(referenceId && paymentId && response){
            await updateTransactionStatus(referenceId, response.data.status, paymentId);
        }else{
            throw new Error('No se puede realizar el pago.')
        }
    
        let foundedTransaction
        if(paymentId){
            foundedTransaction: await findTransactionByPaymentId(paymentId)
        }
        console.log(foundedTransaction,'foundedTransaction')
    
        return foundedTransaction
    }


}

export const paymentsServicesPP = new PaymentsServicesPP()