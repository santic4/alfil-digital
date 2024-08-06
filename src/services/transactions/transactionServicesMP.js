import { transactionsDao } from "../../DAO/MongooseDAO.js/transactionsDao.js";
import { DataInvalid } from "../../models/errors/dataInvalid.js";

export const saveTransactionWithToken = async (emailSend, externalReference, payment_id, carrito) => {
  try {
    if (!emailSend || !externalReference || !payment_id || !carrito) {
      throw new DataInvalid();
    }

    const transaction = await transactionsDao.postTransaction(emailSend, externalReference, payment_id, carrito)

    return transaction;
  } catch (error) {
    console.error('Error al guardar la transacción:', error);
  }
};

export const findTransactionByPaymentId = async (payment_id) => {
  try {
    if(!payment_id){
      throw new DataInvalid()
    }
    const transaction = await transactionsDao.getTransaction(payment_id)

    console.log(transaction,' transactio en el find services ')
    return transaction;
  } catch (error) {

    throw new Error('Error al buscar la transacción');
  }
};

export const updateTransactionStatus = async (externalReference, status, payment_id) => {
  try {
    if(!payment_id || !externalReference  || !status){
      throw new DataInvalid()
    }
    await transactionsDao.updateTransaction(externalReference, status, payment_id);

  } catch (error) {

    throw new Error('Error al actualizar el estado de la transacción');
  }
};

export const updateTransactionStatusMercadoPago = async (externalReference, status, payment_id) => {
  try {
    if(!payment_id || !externalReference  || !status){
      throw new DataInvalid()
    }
    await transactionsDao.updateTransactionMercadoPago(externalReference, status, payment_id);

  } catch (error) {

    throw new Error('Error al actualizar el estado de la transacción');
  }
};

export const findTransactionGetAll = async () => {
  try {
    const transactionDTO = await transactionsDao.getAllTransactions();

    return transactionDTO;
  } catch (error) {

    throw new Error('Error al buscar la transacción');
  }
};
