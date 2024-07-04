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
            
            const message = `Gracias por tu compra. Puedes descargar tu archivo desde el siguiente enlace: ${fileUrls}`;

            await emailService.send(email, 'Archivos comprados', message);
        }

        return
    }

}

export const cartServicesMP = new CartServicesMP()