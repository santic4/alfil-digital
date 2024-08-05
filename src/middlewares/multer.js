import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileDir = file.fieldname === 'files' ? './statics/fileadj' : './statics/photos';
    
    // Verifica y crea el directorio si no existe
    fs.mkdirSync(path.resolve(fileDir), { recursive: true });

    cb(null, fileDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Configuración de Multer con límite de tamaño
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, 
  },
});

export { upload };