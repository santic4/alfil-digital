import axios from "axios";
import { PAYPAL_API, PAYPALCLIENTID, PAYPALCLIENTSECRET } from "../../config/config.js";

const params = new URLSearchParams();
params.append("grant_type", "client_credentials");

class PaymentsRepositoryPP {

    async createOrderPP(currency_selected, amountUSD, externalReference){
   
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
      
        return response
    }

    async captureOrderPP(token){
   

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
        
        if (response.data.status !== 'COMPLETED') {
          throw new Error('No se realizó correctamente el pago.')
        }

        return response
    }

}

export const paymentsRepositoryPP = new PaymentsRepositoryPP()
