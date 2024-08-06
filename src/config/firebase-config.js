import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

// Inicializa Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'alfil-digital.appspot.com', // Asegúrate de usar el nombre de tu bucket
});

// Exporta el bucket de almacenamiento
const bucket = getStorage().bucket();

export { bucket };