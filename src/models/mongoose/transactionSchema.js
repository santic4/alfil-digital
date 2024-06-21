import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    preferenceId: { type: String, required: true, unique: true },
    cart: { type: Array, required: true },
    status: { type: String, required: true }
  });

const Transaction = model('Transaction', transactionSchema);

export default Transaction;