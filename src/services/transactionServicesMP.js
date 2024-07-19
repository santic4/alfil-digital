
import Transaction from "../models/mongoose/transactionSchema.js";
import TransactionDTO from "../dto/transactionDTO.js";

export const saveTransactionWithToken = async (emailSend, externalReference, payment_id, carrito) => {
  try {
    const existingTransaction = await Transaction.findOne({ externalReference });

    if (!existingTransaction) {
      const transaction = new Transaction({
        emailSend: emailSend,
        externalReference,
        payment_id,
        carrito
      });
      await transaction.save();
      console.log('Transacción guardada con éxito');
    } else {
      console.log('Transacción ya existe');
    }
  } catch (error) {
    console.error('Error al guardar la transacción:', error);
  }
};

export const findTransactionByPaymentId = async (payment_id) => {
  try {
    const transaction = await Transaction.findOne({payment_id}).lean();

    return transaction;
  } catch (error) {
    console.error('Error al buscar la transacción por external_reference:', error);
    throw new Error('Error al buscar la transacción');
  }
};

export const updateTransactionStatus = async (externalReference, status, payment_id) => {
  try {
    const existingTransaction = await Transaction.findOne({ payment_id });

    if (existingTransaction?.status === 'pending') {
      await Transaction.findOneAndUpdate(
        { externalReference },
        { status, payment_id }
      );  
    }

    console.log('Estado de la transacción actualizado con éxito');
  } catch (error) {
    console.error('Error al actualizar el estado de la transacción:', error);
    throw new Error('Error al actualizar el estado de la transacción');
  }
};

export const findTransactionGetAll = async () => {
  try {
    const transaction = await Transaction.find({}).lean();
    const transactionDTO = transaction.map(trans => new TransactionDTO(trans));

    return transactionDTO;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error al buscar la transacción');
  }
};
