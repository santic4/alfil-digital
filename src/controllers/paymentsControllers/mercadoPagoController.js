import mercadopago, { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { logger } from '../../utils/logger.js';

const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-2137485881142292-051411-133fce11bfa1dc86b25fc21e60321eb5-151622720',
    options: { timeout: 5000, idempotencyKey: 'abc' }
})

export const createOrderMP = async (req, res) => {
    const carrito = req.body
    console.log(carrito,'carrito')
    try {
        const preference = new Preference(client);

        // Crear la preferencia de pago
        const response = await preference.create({
            body: {
                payment_methods: {
                    excluded_payment_methods: [],
                    excluded_payment_types: [{ id: "ticket" }],
                    installments: 1
                },
                items: carrito,
                back_urls: {
                    success: '/api/mercado-pago/success',
                    failure: '/api/mercado-pago/failure',
                    pending: '/api/mercado-pago/pending'
                } 
                ,
                notification_url: 'https://alfil-digital.onrender.com/api/mercado-pago/webhook',
                statement_descriptor: "ALFILDIGITAL",
            }
        });

        // Si llegamos aquí, la preferencia se creó correctamente
        const { init_point, sandbox_init_point } = response;

        // Determinar si estamos en modo sandbox
        const isSandbox = false; // Cambia a false si estás en producción

        console.log(response, 'preferenec create')

        // Construir la URL de redirección
        const urlRedirect = isSandbox ? sandbox_init_point : init_point;

        // Redirigir al usuario al proceso de pago en MercadoPago
        res.redirect(urlRedirect);
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        res.send(500).json({ error: 'Error al crear la preferencia' });
    }
}

export const webHookMP = async (req, res) => {
    console.log('entro al webhook')
    try {
        const application = new Payment(client);

        let getPay
        console.log(req.query,' laqueiry')


        const payment = req.query

        console.log(payment,'payment')

        if(payment.type === 'payment'){
            getPay = await application.capture({
                    id: payment['data.id'],
                    requestOptions: {
                    idempotencyKey: 'abc'
                    }
                }).then(captureResult => {
                    logger.info('Captura exitosa:', captureResult);
                    console.log('Captura exitosa:', captureResult);
                    
                  }).catch(console.log);
            
        }

        console.log(getPay,' getPay')
        logger.info(getPay,' getPay')

        console.log(getPay,'Termino bien la compra')
        logger.info(getPay,'Termino bien la compra')

    } catch (error) {
        console.log(error)
        throw new Error('Error al confirmar la compra')
    }
    res.sendStatus(400)
}

