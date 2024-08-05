import multer from 'multer';

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file.fieldname,' file.fieldname ')
    if (file.fieldname === 'files') {
      cb(null, './statics/fileadj');
    } else {
      cb(null, './statics/photos'); 

    }
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