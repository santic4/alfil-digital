

import { findTransactionByPaymentId } from "../../services/transactions/transactionServicesMP.js";

export const generateURL = async (req, res, next) => {
    try{
        const paymentID = req.headers['payment-id'];
     
        const transaction = await findTransactionByPaymentId(paymentID);

        if (transaction?.status === 'pending') {
            return res.status(400).json({ error: 'Error en el pago.' });
        }

        const fileUrls = await transaction?.carrito;

        if (!Array.isArray(fileUrls)) {
          return res.status(400).json({ error: 'Formato de datos inválido' });
        }
   
        res.json({ prods: fileUrls });
    }catch(err){
        next(err)
    }
}




