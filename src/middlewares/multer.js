import multer from 'multer';

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    if (file.mimetype.startsWith('image/')) {

      cb(null, './statics/photos'); 
    } else {

      cb(null, './statics/pdfs'); 
    } //else {
      //cb(new Error('Formato de archivo no admitido'));
    //}
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configuración de Multer con límite de tamaño
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Establece el límite de tamaño a 10 MB (en bytes)
  },
});

export { upload };