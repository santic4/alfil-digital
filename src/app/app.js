import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { loggerInRequest } from '../middlewares/logger.js';
import { apiRouter } from '../routers/apiRouter.js';
import { metodosPersonalizados } from '../middlewares/respuestasMejoradas.js';
import { passportInitialize } from '../middlewares/authentication.js';
import { cookies } from '../middlewares/cookie.js';
import { sesiones } from '../middlewares/sesiones.js';
import cors from 'cors'
import { JWT_PRIVATE_KEY } from '../config/config.js';

export const app = express();
//console.log(path.join('public', 'build', 'index.html'));
//app.use(express.static(path.join('public', 'build')));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Middleware de CSP
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "script-src 'self' https://http2.mlstatic.com 'nonce-0LQyZ7wqLUQxwjfNUyBCIQ==' 'strict-dynamic' 'unsafe-eval' 'report-sample' https: 'unsafe-inline'"
    );
    next();

});

app.use(passportInitialize);

app.use(metodosPersonalizados);

// Cookies
app.use(cookies);
app.use(sesiones);

// LOGGER
app.use(loggerInRequest);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/api', apiRouter);

// Configura el middleware de archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/statics/photos', express.static(path.join(__dirname, '../../statics/photos')));
