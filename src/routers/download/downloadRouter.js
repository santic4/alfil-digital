import { Router } from "express";
import { generateURL } from "../../controllers/download/downloadController.js";

export const checkoutRouter = Router()

checkoutRouter.post('/generate-urls',
  generateURL
);

