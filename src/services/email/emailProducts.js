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
            <section style="width: 100%; height: auto; justify-content: center; align-items: center; font-family: 'Montserrat', sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 5px; text-align: center;">
                
                <div style="width: 100%; text-align: center; align-items: center;">
                  <h2 style="color: #2C3360; width: 100%; text-align: center;">Gracias por tu compra</h2>
                </div>

                <div style="width: 100%; text-align: center; align-items: center;">
                  <p style="width: 100%; text-align: center;">Hola,</p>
                </div>

                <div style="width: 100%; text-align: center; align-items: center;">
                  <p style="width: 100%; text-align: center;">Puedes descargar tus archivos desde los siguientes enlaces:</p>
                </div>

                <div style="width: 100%; text-align: center; align-items: center;">
                  <ul style="list-style-type: none; padding: 0;">
                      ${fileUrlsEncoded.map(url => `
                          <li style="margin-bottom: 10px;">
                              <a href="${url}" style="text-decoration: none; padding: 10px 15px; background-color: white; color: #2C3360; border: 1px solid #2C3360; border-radius: 5px; display: inline-block;">
                                  Descargar archivo
                              </a>
                          </li>`).join('')}
                  </ul>
                </div>

                <div style="width: 100%; text-align: center; align-items: center;">
                  <p>Gracias por confiar en nosotros.</p>
                </div>

            </section>
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