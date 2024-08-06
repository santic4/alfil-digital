import multer from 'multer';

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    if (file.fieldname === 'files') {
      cb(null, './statics/photos'); 
    } else {
      cb(null, './statics/photos'); 
    }

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