import { findTransactionGetAll } from "../services/transactions/transactionServicesMP.js"

export const transactions = async (req, res, next) => {
    try{
        const updProduct = await findTransactionGetAll();
    
        res.json(updProduct)
  
    }catch(err){
        next(err)
    }
  }
  