import { fileURLToPath } from "url";
import path from 'path';
import { findTransactionByPaymentId } from "../transactions/transactionServicesMP.js";
import { cartServicesMP } from "../email/emailProducts.js";
import { DataInvalid } from "../../models/errors/dataInvalid.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directory = path.join(__dirname, '../../../statics/fileadj/');

class DownloadServices {

    async adjuntFiles(paymentID){
        try {
            if(!paymentID){
                throw new DataInvalid()
            }

            const transaction = await findTransactionByPaymentId(paymentID);

            if(!transaction){
                throw new DataInvalid()
            }

            const emailSend = transaction.emailSend;

            const email = await cartServicesMP.sendEmailProducts(paymentID, transaction?.carrito, emailSend);

            return email
        } catch (error) {
            console.error('Error al adjuntar productos:', error);
            throw new Error('Error al adjuntar productos.');
        }
    }
    
}

export const downloadServices = new DownloadServices()
