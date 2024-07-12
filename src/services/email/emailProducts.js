import { findTransactionByPaymentId } from "../transactionServices.js";
import { emailService } from "./emailServices.js";


class CartServicesMP {

    async sendEmailProducts(paymentID, fileUrls, emailSend, token ){

        if (!paymentID) {
            return new Error('Data Invalid')
        }

        const transaction = await findTransactionByPaymentId(paymentID);

        if (!transaction) {
            return new Error('Data Invalid.')
        }

        if (transaction) {          
            const downloadLink = `https://alfil-digital.onrender.com/api/products/download/${fileUrls}?token=${token}`;
            const message = `Gracias por tu compra. Puedes descargar tu archivo desde el siguiente enlace: ${downloadLink}`;

            await emailService.send(emailSend, 'Archivos comprados', message);
        }

        return
    }

}

export const cartServicesMP = new CartServicesMP()