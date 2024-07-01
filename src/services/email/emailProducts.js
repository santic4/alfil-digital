import { fetchTransactionByPaymentId } from "../transactionsCardServices.js";
import { emailService } from "./emailServices.js";


class CartServicesMP {

    async sendEmailProducts(paymentId, fileUrls, email ){

        
        if (!paymentId) {
            return new Error('Data Invalid')
        }

        const transaction = await fetchTransactionByPaymentId(paymentId);

        if (!transaction) {
            return new Error('Data Invalid.')
        }

        if (transaction) {          
            const filesList = fileUrls.join(', ');
            const message = `Gracias por tu compra. Puedes descargar tus archivos desde los siguientes enlaces: ${filesList}`;

            await emailService.send(email, 'Archivos comprados', message);
        }

        return
    }

}

export const cartServicesMP = new CartServicesMP()