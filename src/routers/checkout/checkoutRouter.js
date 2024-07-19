import { Router } from "express";
import { adjuntProducts, DownloadFile, generateDownloadToken, getFile } from "../../controllers/checkoutController.js";


export const checkoutRouter = Router()

checkoutRouter.get('/files/:fileName', 
  getFile
);
  
checkoutRouter.get('/download/:token', 
  DownloadFile
);

checkoutRouter.post('/generateToken/:fileUrl', 
  generateDownloadToken
);

checkoutRouter.post('/adjunt', 
  adjuntProducts
);