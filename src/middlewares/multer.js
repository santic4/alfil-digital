import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file,'fileeeee')
    let fileDir;
    if (file.fieldname === 'files') {
      fileDir = '../statics/fileadj';
    } else {
      fileDir = '../statics/photos';
    }

    console.log(fileDir,'fileDir1')
    // Resuelve la ruta absoluta desde el directorio actual
    const resolvedPath = path.resolve(__dirname, fileDir);
    console.log(resolvedPath,'resolvedPath')
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