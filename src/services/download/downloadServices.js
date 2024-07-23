import { fileURLToPath } from "url";
import { desencriptar, encriptar } from "../../utils/cryptografia.js";
import path from 'path';
import { findTransactionByPaymentId } from "../transactions/transactionServicesMP.js";
import { cartServicesMP } from "../email/emailProducts.js";
import { DataInvalid } from "../../models/errors/dataInvalid.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directory = path.join(__dirname, '../../statics/fileadj/');

class DownloadServices {

    async getFile(paymentID, fileName){
        if (!paymentID ) {
            throw new DataInvalid()
        }
        
        const transaction = await findTransactionByPaymentId(paymentID);
        
        if (!transaction || (transaction.status !== 'accredited' && transaction.status !== 'COMPLETED')) { 
            throw new DataInvalid()
        }
        
        const fileUrl =  path.join(directory, fileName);

        return fileUrl
    }

    async getDownloadFile(token){

        if(!token){
            throw new Error('Invalid token.')
        }

        const decoded = await desencriptar(token);
        const url = decoded.url;

        const fileUrl =  path.join(directory, url);

        return fileUrl
    }

    async getToken(url){

        if(!url){
            throw new DataInvalid()
        }
        
        const hashedToken = await encriptar(url);

        const fileUrl =  path.join(directory, hashedToken);

        return fileUrl
    }

    async adjuntFiles(paymentID){

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
    }
    
}

export const downloadServices = new DownloadServices()
