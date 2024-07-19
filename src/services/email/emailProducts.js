import { JWT_PRIVATE_KEY } from "../../config/config.js";
import { encriptar } from "../../utils/cryptografia.js";
import { findTransactionByPaymentId } from "../transactionServicesMP.js";
import { emailService } from "./emailServices.js";
import jwt from "jsonwebtoken";

class CartServicesMP {

    async sendEmailProducts(paymentID, fileUrls) {
        console.log('Transaction en mail', fileUrls, paymentID);
      
        try {
          if (!paymentID || !Array.isArray(fileUrls)) {
            throw new Error('Formato de datos inválido');
          }
      
          const transaction = await findTransactionByPaymentId(paymentID);
      
          if (!transaction) {
            throw new Error('Datos inválidos');
          }
      
          const emailSend = transaction.emailSend;

          // Encriptar cada URL con token de caducidad
          const fileUrlsEncoded = await Promise.all(fileUrls.map(async (file) => {
            const token = await encriptar(file);
            return `https://alfil-digital.onrender.com/api/checkout/download/${token}`; // Aquí deberías formatear según tus requisitos
          }));
      
          console.log(fileUrlsEncoded, 'file urls encoded');
      
          // Generar el mensaje de correo electrónico con las URLs encriptadas
          const message = `
            Gracias por tu compra.
            Puedes descargar tus archivos desde los siguientes enlaces:
            ${fileUrlsEncoded.join('\n')}
          `;
      
          await emailService.send(emailSend, 'Archivos comprados', message);
        } catch (error) {
          console.error('Error al enviar el correo:', error.message);
        }
      }

    async decodedToken(token){
        try {
            console.log(token,' token antes ')
            const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
            console.log(decoded, 'decoded'); 
            
            return decoded;
        } catch (error) {
            console.error('Error al verificar el token:', error.message);
            throw new Error('Token inválido');
        }
    }

}

export const cartServicesMP = new CartServicesMP();