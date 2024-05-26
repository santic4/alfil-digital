import axios from "axios";
import {
  PAYPAL_API,
  HOST,
  PAYPALCLIENTID,
  PAYPALCLIENTSECRET,
} from "../../config/config.js";

export const createOrder = async (req, res) => {
  try {
    const currency_selected = req.body.currency
    const amountUSD = req.body.amountUSD
    console.log(amountUSD,'amountUSD')

    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency_selected,
            value: amountUSD,
          },
        },
      ],
      application_context: {
        brand_name: "mycompany.com",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${HOST}/capture-order`,
        cancel_url: `${HOST}/cancel-payment`,
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

    console.log(access_token);

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

    return res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Something goes wrong");
  }
};

export const captureOrder = async (req, res) => {
  const { token } = req.query;

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    console.log(response.data);

    res.redirect("/payed.html");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const cancelOrder = (req, res) => res.redirect("http://localhost:3000/cancel-pay");

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
