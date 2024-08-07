import { Router } from "express";
import { adjuntProducts, DownloadFileFB, generateURL } from "../../controllers/download/downloadController.js";

export const checkoutRouter = Router()


checkoutRouter.post('/generate-urls',
  generateURL
);


checkoutRouter.get('/downloadFB/:token', 
  DownloadFileFB
);


checkoutRouter.post('/adjunt', 
  adjuntProducts
);