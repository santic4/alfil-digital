import admin from 'firebase-admin';
import { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } from './config.js';

// Verificar si las variables de entorno están definidas
const projectId = FIREBASE_PROJECT_ID;
const clientEmail = FIREBASE_CLIENT_EMAIL;
const privateKey = FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const storageBucket = 'alfil-digital.appspot.com';

if (!projectId || !clientEmail || !privateKey || !storageBucket) {
  throw new Error('Missing Firebase configuration environment variables.');
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