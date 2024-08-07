
import { generateToken } from "../../utils/cryptografia.js";
import { paymentsServicesPP } from "../../services/payments/paymentServicesPP.js";

export const createOrder = async (req, res) => {
  try {
    const { currency, amountUSD, emailSend, carrito } = req.body;
    
    if (!currency || !amountUSD || !emailSend || !carrito) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos' });
    }

    const externalReference = generateToken();
    console.log(carrito,' carrito createOrder')

    const approvalUrl = await paymentsServicesPP.createOrderPP(currency, amountUSD, emailSend, carrito, externalReference);

    console.log(approvalUrl,'approvalUrl')

    return res.json({ redirectUrl: approvalUrl });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    return res.status(500).json({ message: "Error al crear la orden.", error: error.message });
  }
};

export const captureOrder = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token es requerido' });
  }

  try {
    console.log('entramo',token)
    const foundedTransaction = await paymentsServicesPP.captureOrderPP(token);

    console.log(foundedTransaction,' foundend transactoin')
    if (!foundedTransaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    return res.json({ 
      status: 'Pago capturado exitosamente',
      cart: foundedTransaction.carrito || []
    });
  } catch (error) {
    console.error('Error al capturar la orden:', error);
    return res.status(500).json({ message: 'Error al capturar la orden', error: error.message });
  }
};

export const cancelOrder = (req, res) => res.redirect("https://alfil-digital.onrender.com/cancel-payment");

export const converterCurreny = async (req, res) => {
  try {
    const response = await fetch("https://dolarapi.com/v1/dolares/blue");

    if (!response.ok) {
      throw new Error('No se pudo obtener la cotización del dólar.');
    }

    const data = await response.json();
    const usdRate = data.venta;
    console.log(usdRate, ' usd Rate ');

    const costARS = req.body.amountARS;
    const convertedAmountUSD = (parseFloat(costARS) / usdRate).toFixed(2);
    console.log(convertedAmountUSD, ' convertedAmountUSD ');

    res.json({ amountUSD: convertedAmountUSD });
  } catch (error) {
    console.error('Error al obtener la cotización del dólar:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};
