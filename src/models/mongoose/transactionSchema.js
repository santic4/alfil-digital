import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    externalReference: { type: String, required: true, unique: true },
    cart: { type: String, required: true },
    status: { type: String, required: true }
  });

const Transaction = model('Transaction', transactionSchema);

export default Transaction;