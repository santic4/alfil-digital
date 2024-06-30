import Transaction from "../models/mongoose/transactionSchema.js";

export const saveTransactionWithToken = async (cartID, emailPayer) => {
  try {
    const existingTransaction = await Transaction.findOne({ emailPayer });

    if (!existingTransaction) {
      const transaction = new Transaction({
        cart: cartID,
        emailPayer
      });
      await transaction.save();
      console.log('Transacción guardada con éxito');
    } else {
      console.log('Transacción ya existe');
    }
  } catch (error) {
    console.error('Error al guardar la transacción:', error);
    throw new Error('Error al guardar la transacción');
  }
};

export const findTransactionByExternalReference = async (emailPayer) => {
  try {
    const transaction = await Transaction.findOne({ emailPayer });
    return transaction;
  } catch (error) {
    console.error('Error al buscar la transacción por external_reference:', error);
    throw new Error('Error al buscar la transacción');
  }
};

export const updateTransactionStatus = async (emailPayer, status, payment_id) => {
  try {
    await Transaction.findOneAndUpdate(
      { emailPayer },
      { status, payment_id }
    );

    console.log('Estado de la transacción actualizado con éxito');
  } catch (error) {
    console.error('Error al actualizar el estado de la transacción:', error);
    throw new Error('Error al actualizar el estado de la transacción');
  }
};
