
import TransactionDTO from "../dto/transactionDTO.js";
import TransactionPP from "../models/mongoose/transactionsPP.js";

export const saveTransactionWithTokenPP = async (emailSend, payment_id, cart_id) => {
  try {
    const existingTransaction = await TransactionPP.findOne({ payment_id });

    if (!existingTransaction) {
      const transaction = new TransactionPP({
        emailSend,
        payment_id,
        cart_id
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

export const findTransactionByPaymentIdPP = async (payment_id) => {
  try {
    const transaction = await TransactionPP.findOne({payment_id}).lean();

    return transaction;
  } catch (error) {
    console.error('Error al buscar la transacción por external_reference:', error);
    throw new Error('Error al buscar la transacción');
  }
};

export const updateTransactionStatusPP = async ( payment_id, status ) => {
  try {
    await TransactionPP.findOneAndUpdate(
      { payment_id },
      { status }
    );

    console.log('Estado de la transacción actualizado con éxito');
  } catch (error) {
    console.error('Error al actualizar el estado de la transacción:', error);
    throw new Error('Error al actualizar el estado de la transacción');
  }
};

export const findTransactionGetAll = async () => {
  try {
    const transaction = await TransactionPP.find({}).lean();
    const transactionDTO = transaction.map(trans => new TransactionDTO(trans));

    return transactionDTO;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error al buscar la transacción');
  }
};
