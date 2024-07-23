import axios from "axios";
import {
  PAYPAL_API,
  PAYPALCLIENTID,
  PAYPALCLIENTSECRET,
} from "../../config/config.js";
import { generateToken } from "../../utils/cryptografia.js";
import { findTransactionByPaymentId, updateTransactionStatus } from "../../services/transactions/transactionServicesMP.js";
import { paymentsServicesPP } from "../../services/payments/paymentServicesPP.js";

export const createOrder = async (req, res) => {
  const currency_selected = req.body.currency
  const amountUSD = req.body.amountUSD
  const emailSend = req.body.emailSend
  const carrito = req.body.carrito
  const externalReference = generateToken();

  try {
    const approvalUrl = await paymentsServicesPP.createOrderPP(currency_selected, amountUSD, emailSend, carrito, externalReference);

    return res.json({ redirectUrl: approvalUrl });
  } catch (error) {

    return res.status(500).json("Error al crear la orden.");
  }
};

export const captureOrder = async (req, res) => {
  const { token } = req.query;

  try {
    const foundedTransaction = await paymentsServicesPP.captureOrderPP(token);

    return res.json({ 
      status: 'Pago capturado exitosamente',
      cart: foundedTransaction?.carrito || []
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = (req, res) => res.redirect("https://alfil-digital.onrender.com/cancel-payment");

export const converterCurreny = async (req, res) => {
    try {
        const response = await fetch("https://dolarapi.com/v1/dolares/blue")
        
        const data = await response.json();

        const usdRate = data.venta;
    
        const costARS = req.body.amountARS;
        const convertedAmountUSD = (parseFloat(costARS) / usdRate).toFixed(2);
    
        res.json({ amountUSD: convertedAmountUSD });
    
      } catch (error) {
        console.error('Error al obtener la cotización del dólar:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
      }
};
