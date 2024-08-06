import multer from 'multer';
import fs from 'fs';

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file,' file ')
    if (file.fieldname === 'images') {
      const dir = './statics/photos';
      ensureDirExists(dir);
      cb(null, dir);
    } else {
      const dirfile = './statics/fileajd';
      ensureDirExists(dirfile);
      cb(null, dirfile);
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
