import mercadopago, { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-4646418936536455-051102-9c9a15b2c4e55bc8b7ca461272059450-1808896698',
    options: { timeout: 5000, idempotencyKey: 'abc' }
})

export const createOrderMP = async (req, res) => {
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
                items: [
                    {
                        id: 'id1as',
                        title: 'My product',
                        quantity: 1,
                        unit_price: 2000
                    }
                ],
                back_urls: {
                    success: 'http://localhost:8080/api/mercado-pago/success',
                    failure: 'http://localhost:8080/api/mercado-pago/failure',
                    pending: 'http://localhost:8080/api/mercado-pago/pending'
                } 
                ,
                notification_url: 'https://19db-152-170-166-25.ngrok-free.app/api/mercado-pago/webhook'
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
        res.send(response);
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        res.send(500).json({ error: 'Error al crear la preferencia' });
    }
}
export const successPayMP = async (req, res) => { }

export const webHookMP = async (req, res) => {
    try {
        const application = new Payment(client);

        let getPay
        console.log(req.query,' laqueiry')


        const payment = req.query

        console.log(payment['data.id'],'payment data id')

        if(payment.type === 'payment'){
            getPay = await application.capture({
                    id: payment['data.id'],
                    transaction_amount: 2000,
                    requestOptions: {
                    idempotencyKey: 'abc'
                    }
                }).then(console.log).catch(console.log);
            
        }

        console.log(getPay,' getPay')
        console.log('Termino bien la compra')
    } catch (error) {
        console.log(error)
        throw new Error('Error al confirmar la compra')
    }
    res.sendStatus(400)
}

