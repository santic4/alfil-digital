import { fileURLToPath } from "url";
import { desencriptar, encriptar } from "../../utils/cryptografia.js";
import path from 'path';
import { findTransactionByPaymentId } from "../transactions/transactionServicesMP.js";
import { cartServicesMP } from "../email/emailProducts.js";
import { DataInvalid } from "../../models/errors/dataInvalid.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directory = path.join(__dirname, '../../../statics/fileadj/');

class DownloadServices {

    async getFile(paymentID, fileName){
        if (!paymentID ) {
            throw new DataInvalid()
        }
        console.log('paymentID, fileName',paymentID, fileName)
        
        const transaction = await findTransactionByPaymentId(paymentID);
        console.log('transaction',transaction)
        if (!transaction || (transaction.status !== 'accredited' && transaction.status !== 'COMPLETED')) { 
            throw new DataInvalid()
        }
        
        const fileUrl = path.join(directory, fileName);
        console.log('fileUrl',fileUrl)
        return fileUrl
    }

    async getDownloadFile(token){
        console.log('tokengetDownloadFile',token)
        if(!token){
            throw new Error('Invalid token.')
        }

        const decoded = await desencriptar(token);
        console.log('decoded',decoded)
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
        try {
            console.log(paymentID,'paymetnid dentro del services adjunt')
            if(!paymentID){
                throw new DataInvalid()
            }

            const transaction = await findTransactionByPaymentId(paymentID);

            console.log(transaction,'transaction dentro del services adjunt')

            if(!transaction){
                throw new DataInvalid()
            }

            const emailSend = transaction.emailSend;

            const email = await cartServicesMP.sendEmailProducts(paymentID, transaction?.carrito, emailSend);

            console.log('todo bien en el adjunt')
            return email
        } catch (error) {
            console.error('Error al adjuntar productos:', error);
            throw new Error('Error al adjuntar productos.');
        }
    }
    
}

export const downloadServices = new DownloadServices()
