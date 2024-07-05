import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    externalReference: { type: String, required: true, sparse: true },
    cart: { type: String, required: true },
    status: { type: String, default: 'pending' },
    payment_id: { type: String, unique: true , sparse: true}
  });

const Transaction = model('Transaction', transactionSchema);

export default Transaction;