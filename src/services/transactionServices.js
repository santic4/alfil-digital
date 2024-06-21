import Transaction from "../models/mongoose/transactionSchema.js";

export const updateTransactionStatus = async (transactionId, status) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { transactionId },
            { status },
            { new: true }
        );
        console.log('Estado de la transacción actualizado correctamente:', transaction);
        return transaction;
    } catch (error) {
        console.error('Error al actualizar el estado de la transacción:', error);
        throw error;
    }
};