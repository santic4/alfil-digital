import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define el directorio de destino según el campo del archivo
    let fileDir;
    if (file.fieldname === 'files') {
      fileDir = 'statics/fileadj';
    } else {
      fileDir = 'statics/images';
    }

    // Resuelve la ruta absoluta desde el directorio actual
    const resolvedPath = path.resolve(__dirname, '..', '..', fileDir);
    
    // Verifica y crea el directorio si no existe
    fs.mkdirSync(resolvedPath, { recursive: true });

    // Llama al callback con el directorio de destino
    cb(null, resolvedPath);
  },
  filename: function (req, file, cb) {
    // Usa el nombre original del archivo
    cb(null, file.originalname);
  },
});

// Configuración de Multer con límite de tamaño
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2500 * 1024 * 1024, // 2500 MB
  },
});

export { upload };