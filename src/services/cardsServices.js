import TransactionCartMP from "../models/mongoose/cardsTransaction.js";

export const saveTransactionWithToken = async (cartID, paymentID, status) => {
    try {
      const transaction = new TransactionCartMP({
        cart: cartID,
        payment_id: paymentID,
        status: status
      });
      await transaction.save();
      console.log('Transacción guardada con éxito');
    } catch (error) {
      console.error('Error al guardar la transacción:', error);
      throw new Error('Error al guardar la transacción');
    }
  };
  
  export const updateTransactionStatus = async (paymentID, status) => {
    try {
      await TransactionCartMP.findOneAndUpdate(
        { payment_id: paymentID },
        { status }
      );
  
      console.log('Estado de la transacción actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el estado de la transacción:', error);
      throw new Error('Error al actualizar el estado de la transacción');
    }
  };