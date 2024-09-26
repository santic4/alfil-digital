import { Router } from 'express'
import { passportAuth } from '../../middlewares/passport.js';
import { adminsOnly } from '../../middlewares/authorizationUserAdmin.js';
import { deleteTransaction, transactions } from '../../controllers/transactionGet.js';

export const TransactionGet = Router();

TransactionGet.get('/', 
    passportAuth,
    adminsOnly,
    transactions
);

TransactionGet.delete('/', 
    passportAuth,
    adminsOnly,
    deleteTransaction
);