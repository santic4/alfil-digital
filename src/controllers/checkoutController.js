
import { cartServicesMP } from "../services/email/emailProducts.js";
import { findTransactionByPaymentId } from "../services/transactionServicesMP.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { desencriptar, encriptar } from '../utils/cryptografia.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getFile = async (req, res, next) => {
    const { fileName } = req.params;
    const paymentID = req.headers['payment-id'];

    try {
        if (!paymentID ) {
            return new Error('DATA INVALID')
        }

        const transaction = await findTransactionByPaymentId(paymentID);

        if (!transaction || (transaction.status !== 'accredited' && transaction.status !== 'COMPLETED')) { 
            return res.status(401).json({ error: 'Transacción no encontrada o no acreditada/completada.' });
        }

        const directory = path.join(__dirname, '../../statics/fileadj/');
   
        const fileUrl =  path.join(directory, fileName);


        if(fileUrl && (transaction.status === 'accredited' || transaction.status === 'COMPLETED')) { 

            console.log(fileUrl,transaction, 'cositas')
            res.download(fileUrl, (err) => {
                if (err) {
                    console.error('Error al descargar el archivo:', err);
                    res.status(500).json({ error: 'Error al descargar el archivo.' });
                }
            });
        }else{
            return res.status(404).json({ error: 'No existe el archivo.' });
        }

    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        next(error)
    }
};

export const DownloadFile = async (req, res, next) => {
    try{
        const token = req.params.token;

        if(!token){
            throw new Error('Data invalid token.')
        }

        const directory = path.join(__dirname, '../../statics/fileadj/');

        const decoded = await desencriptar(token);
        const url = decoded.url;

        const fileUrl =  path.join(directory, url);

        res.download(fileUrl, (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err);
                res.status(500).json({ error: 'Error al descargar el archivo.' });
            }
        });
    }catch(err){
        next(err)
    }
}

export const generateDownloadToken = async (req, res, next) => {
    const { fileUrl } = req.params;

    try {
        
        if(!fileUrl){
            throw new Error('Data invalid.')
        }
        console.log('antes de encriptar ',fileUrl)

        const hashedToken = await encriptar(fileUrl);

        console.log(hashedToken,'hashed')
        res.json(hashedToken)
    } catch (error) {
        next(error)
    }
};

export const adjuntProducts = async (req, res, next) => {
    const paymentID = req.headers['payment-id'];

    try {
        const transaction = await findTransactionByPaymentId(paymentID);

        const email = await cartServicesMP.sendEmailProducts(paymentID, transaction?.carrito);

        return res.status(200).json({ status: 'Email enviado.' });
    } catch (error) {
        next(error)
    }
};



