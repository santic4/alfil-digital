import TransactionDTO from "../../dto/transactionDTO.js";
import Transaction from "../../models/mongoose/transactionSchema.js";

class TransactionsDao {
    
    async getTransaction(payment_id){
      try{
        const transaction = await Transaction.findOne({payment_id}).lean();

        console.log(transaction,'transaction DAO MONGOOSE')

        return transaction
      }catch(error){
        throw new Error(`Error al obtener el transacción por ID: ${error.message}`);
      }
    }

    async postTransaction(emailSend, externalReference, payment_id, carrito){
        try{
        const existingTransaction = await Transaction.findOne({ externalReference });
            
        
        if (!existingTransaction) {
          const transaction = new Transaction({
            emailSend: emailSend,
            externalReference,
            payment_id,
            carrito
          });
          await transaction.save();
   
        } else {
          console.log('Transacción ya existe');
        }
        }catch(error){
          throw new Error(`Error al crear una transacción: ${error.message}`);
        }
    }

    async updateTransaction(externalReference, status, payment_id){
        try{
          
          const existingTransaction = await Transaction.findOne({ payment_id });

          if (existingTransaction?.status === 'pending') {
            await Transaction.findOneAndUpdate(
              { externalReference },
              { status, payment_id }
            );  
          }

        }catch(error){
          throw new Error(`Error al actualizar la transacción: ${error.message}`);
        }
    }

    async updateTransactionMercadoPago(externalReference, status, payment_id){
      try{
        
        console.log('update transaction dao', externalReference,'-', status,'-', payment_id)
          const existingTransaction = await Transaction.findOne({ externalReference });

          if (existingTransaction?.status === 'pending') {
            await Transaction.findOneAndUpdate(
              { externalReference },
              { status, payment_id }
            );  
          }

      }catch(error){
        throw new Error(`Error al actualizar la transacción: ${error.message}`);
      }
  }

    async getAllTransactions(){
        try{
            const transaction = await Transaction.find({}).lean();

            const transactionDTO = transaction.map(trans => new TransactionDTO(trans));
            
            return transactionDTO
        }catch(error){
          throw new Error(`Error al obtener el transactiones: ${error.message}`);
        }
      }

}

export const transactionsDao = new TransactionsDao()