import admin from 'firebase-admin';

// Verificar si las variables de entorno están definidas
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
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