import Transaction from "../models/mongoose/transactionSchema.js";

export const saveTransactionWithToken = async (transactionId, token) => {
    try {
        const newTransaction = new Transaction({
            transactionId,
            token,
            status: 'paid'
        });
        await newTransaction.save();
        console.log('Transacción guardada correctamente:', newTransaction);
    } catch (error) {
        console.error('Error al guardar la transacción:', error);
        throw error;
    }
};

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