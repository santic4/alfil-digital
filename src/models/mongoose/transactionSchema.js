import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    externalReference: { type: String, required: true, sparse: true },
    emailSend: { type: String, required: true },
    status: { type: String, default: 'pending' },
    payment_id: { type: String, sparse: true},
    carrito: {
      type: [String], 
      default: [] 
    }
  });

const Transaction = model('Transaction', transactionSchema);

export default Transaction;