import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    cart: { type: String, required: true },
    payment_id: { type: String, required: true, unique: true },
    status: { type: String, default: 'pending' }
  });

const TransactionCartMP = model('TransactionCardsMP', transactionSchema);

export default TransactionCartMP;