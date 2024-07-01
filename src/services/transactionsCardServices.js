import TransactionCartMP from "../models/mongoose/cardsTransaction.js";

export const saveTransactionCart = async (cartID, payment_id, status) => {
  try {
    const existingTransaction = await TransactionCartMP.findOne({ payment_id });

    if (!existingTransaction) {
      const transaction = new TransactionCartMP({
        cart: cartID,
        payment_id,
        status
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


export const fetchTransactionByPaymentId = async (payment_id) => {
    try {
      const transaction = await TransactionCartMP.findOne({ payment_id, status: 'accredited' });

      return transaction;
    } catch (error) {
      console.error('Error al buscar la transacción:', error);
      throw new Error('Error al buscar la transacción');
    }
  };
