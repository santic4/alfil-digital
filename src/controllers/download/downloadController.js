
import { downloadServices } from "../../services/download/downloadServices.js";

export const getFile = async (req, res, next) => {
    const { fileName } = req.params;
    const paymentID = req.headers['payment-id'];

    try {
        const file = await downloadServices.getFile(paymentID, fileName)

        res.download(file, (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err);
                res.status(500).json({ error: 'Error al descargar el archivo.' });
            }
        });

    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        next(error)
    }
};

export const DownloadFile = async (req, res, next) => {
    try{
        const token = req.params.token;

        const file = await downloadServices.getDownloadFile(token)

        res.download(file, (err) => {
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
        const hashedToken = await downloadServices.getToken(fileUrl)

        res.json(hashedToken)
    } catch (error) {
        next(error)
    }
};

export const adjuntProducts = async (req, res, next) => {
    const paymentID = req.headers['payment-id'];

    try {
        await downloadServices.adjuntFiles(paymentID)

        return res.status(200).json({ status: 'Email enviado.' });
    } catch (error) {
        next(error)
    }
};



