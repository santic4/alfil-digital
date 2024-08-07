
import { downloadServices } from "../../services/download/downloadServices.js";
import { findTransactionByPaymentId } from "../../services/transactions/transactionServicesMP.js";
import { desencriptarFB, encriptarFB } from "../../utils/cryptografia.js";
import { pipeline } from 'stream';
import { promisify } from 'util';

export const generateURL = async (req, res, next) => {
    try{
        const paymentID = req.headers['payment-id'];
     
        const transaction = await findTransactionByPaymentId(paymentID);
        console.log(transaction,' transaction en generat eURL')

        if (transaction?.status === 'pending') {
            return res.status(400).json({ error: 'Error en el pago.' });
        }

        const fileUrls = await transaction?.carrito;

        if (!Array.isArray(fileUrls)) {
          return res.status(400).json({ error: 'Formato de datos inválido' });
        }
        

        const urlsEncriptadas = fileUrls.map((url) => {
          const token = encriptarFB({
            url,
            exp: Date.now() + 259200000 // Expira en 1 hora
          });
          return `http://localhost:8080/api/checkout/downloadFB/${token}`;
        });
      
        res.json({ urls: urlsEncriptadas });
    }catch(err){
        next(err)
    }
}

const pipelineAsync = promisify(pipeline);

export const DownloadFileFB = async (req, res, next) => {
    try {
        const token = req.params.token;
        console.log(token,'token ahora')
        const data = desencriptarFB(token);
        console.log(data,'data')

        if (Date.now() > data.exp) {
          return res.status(403).send('El enlace ha expirado.');
        }
    

        const fileUrl = data.url || data.file;
        console.log(fileUrl,'fileUrl')
    
        const response = await fetch(fileUrl);
        console.log(response.body,'resopsnse que rencesddd')
        if (!response.ok) {
          throw new Error('Error al descargar el archivo');
        }
    
        // Configurar los encabezados de respuesta para la descarga
        res.setHeader('Content-Disposition', `attachment; filename="${fileUrl.split('/').pop()}"`);
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    
        await pipelineAsync(response.body, res);

    }catch(err){
        next(err)
    }
}

export const adjuntProducts = async (req, res, next) => {
    const paymentID = req.headers['payment-id'];

    try {
        await downloadServices.adjuntFiles(paymentID)

        return res.status(200).json({ status: 'Email enviado.' });
    } catch (error) {
        next(error)
    }
};



