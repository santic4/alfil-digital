import Transaction from "../models/mongoose/transactionSchema.js";
import { findTransactionGetAll } from "../services/transactions/transactionServicesMP.js"

export const transactions = async (req, res, next) => {
  try{

    const updProduct = await findTransactionGetAll();

    res.json(updProduct)

  }catch(err){
      next(err)
  }
}

export const transactionsPost = async (req, res, next) => {
  try {
    // Crear una nueva instancia de la transacción con los datos del cuerpo de la solicitud
    const newTransaction = new Transaction({
      externalReference: req.body.externalReference,
      emailSend: req.body.emailSend,
      status: req.body.status || 'pending',
      payment_id: req.body.payment_id,
      carrito: req.body.carrito, // Esperamos un array de objetos con {url, name}
      total: req.body.total,
      clientData: {
        Nombre: req.body.clientData?.Nombre,
        Apellido: req.body.clientData?.Apellido,
        CodArea: req.body.clientData?.CodArea,
        Telefono: req.body.clientData?.Telefono,
        DNI: req.body.clientData?.DNI,
      },
      completed: req.body.completed || false,
    });

    // Guardar la nueva transacción en la base de datos
    const savedTransaction = await newTransaction.save();

    // Responder con la transacción guardada
    res.status(201).json(savedTransaction);
  } catch (err) {
    // Pasar el error al middleware de manejo de errores
    next(err);
  }
};

  export const deleteTransaction = async (req, res, next) => {
    const { id } = req.query; 
  
    if (!id) {
      return res.status(400).json({ message: 'ID de transacción es requerido' });
    }
  
    try {
      const deletedTransaction = await Transaction.findByIdAndDelete(id); 
  
      if (!deletedTransaction) {
        return res.status(404).json({ message: 'Transacción no encontrada' });
      }
  
      return res.status(200).json({ message: 'Transacción eliminada correctamente' });
    } catch (error) {
      console.error(error);
      next(error)
    }
  };
  