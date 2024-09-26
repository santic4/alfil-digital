import admin from 'firebase-admin';
import { clientEmail, privateKey, projectId } from './config.js';

// Verificar si las variables de entorno están definidas

const storageBucket = 'alfil-digital.appspot.com';

if (!projectId || !clientEmail || !privateKey || !storageBucket) {
  throw new Error(`Missing Firebase configuration environmenttttt ${privateKey}vaaaaariables.`);
}

const serviceAccount = {
  projectId,
  clientEmail,
  privateKey,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket,
});

const bucket = admin.storage().bucket();

export { bucket };