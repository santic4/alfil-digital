import axios from "axios";
import {
  PAYPAL_API,
  HOST,
  PAYPALCLIENTID,
  PAYPALCLIENTSECRET,
} from "../../config/config.js";
import { generateToken } from "../../utils/cryptografia.js";
import { findTransactionByPaymentId, saveTransactionWithToken, updateTransactionStatus } from "../../services/transactionServicesMP.js";

export const createOrder = async (req, res) => {
  try {
    const currency_selected = req.body.currency
    const amountUSD = req.body.amountUSD
    const emailSend = req.body.emailSend
    const carrito = req.body.carrito

    const nombresArchivos = carrito.reduce((acc, item) => {
      return acc.concat(item.productID.fileadj);
    }, []);

    const externalReference = generateToken();

    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: externalReference,
          amount: {
            currency_code: currency_selected,
            value: amountUSD,
          },
        },
      ],
      application_context: {
        brand_name: "ALFIL DIGITAL",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `https://alfil-digital.onrender.com`,
        cancel_url: `https://alfil-digital.onrender.com/cancel-payment`,
      },
    };

    // format the body
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    // Generate an access token
    const {
      data: { access_token },
    } = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: PAYPALCLIENTID,
          password: PAYPALCLIENTSECRET,
        },
      }
    );

    // make a request
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log(response.data,'response en create')

    const approvalUrl = response.data.links.find(link => link.rel === 'approve').href;
    const payment_id = response.data.id;

    if(!approvalUrl || !payment_id){
      throw new Error('No se puede realizar el pago.')
    }
    
    await saveTransactionWithToken(emailSend, externalReference, payment_id, nombresArchivos);

    return res.json({ redirectUrl: approvalUrl });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Something goes wrong");
  }
};

export const captureOrder = async (req, res) => {
  const { token } = req.query;

  try {
    // Generate an access token
    console.log(token,' token en capture ')
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const {
      data: { access_token },
    } = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: PAYPALCLIENTID,
          password: PAYPALCLIENTSECRET,
        },
      }
    );

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log(response.data,' response en capture lindo')

    if (response.data.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'El pago no fue aprobado.' });
    }

    const referenceId = response.data.purchase_units[0].reference_id;
    const paymentId = response.data.id;

    await updateTransactionStatus(referenceId, response.data.status, paymentId);

    const foundedTransaction = await findTransactionByPaymentId(paymentId)

    console.log(foundedTransaction?.carrito,'foundedTransaction')

    return res.json({ 
      status: 'Pago capturado exitosamente',
      cart: foundedTransaction?.carrito || []
    });
  } catch (error) {
    console.log(error.message);
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
