import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    transactionId: String,
    token: String,
    status: String,
    createdAt: { type: Date, default: Date.now, expires: '1h' } // El token expira en 1 hora
});

const Transaction = model('Transaction', transactionSchema);

export default Transaction;