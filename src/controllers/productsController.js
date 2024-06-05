import { Product } from "../models/mongoose/productModel.js";
import { productServices } from "../services/productServices.js";
import { logger } from "../utils/logger.js";

export const getAllProducts = async (req, res, next) => {
    try {

        const options = {
          page: req.query.page || 1,
          limit: req.query.itemsPorPagina || 10, 
          sort: req.query.order ? { 'price': req.query.order } : {},
          lean: true,
        };
    
        const filter = req.query.filtro ? { category: req.query.filtro } : {}; 
    
        const paginado = await productServices.getAllProducts(filter, options);

        res.json(paginado);
      } catch (error) {
        next(error)
      }
}

export const getCategory = async (req, res, next) => {
    try{

     const { category } = req.query;
     
  
     const categoryProducts = await productServices.getCategory(category);
  
     const results = {
      status: 'success',
      payload: categoryProducts,
    };

     res.json(results)
 
    }catch(err){
     next(err)
    }
}

export const getFilteredProducts = async (req, res) => {
  const { name, minPrice, maxPrice } = req.query;
  
  const query = {};

  if (name) {
    query.title = new RegExp(name, 'i'); 
    
}


  if (minPrice && maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice };
  } else if (minPrice) {
      query.price = { $gte: minPrice };
  } else if (maxPrice) {
      query.price = { $lte: maxPrice };
  }

  console.log(query,'query')

  try {
      const products = await Product.find(query);
      res.status(200).json(products);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


export const getProductId = async (req, res, next) => {
    try{
     const product = await productServices.getProductId(req.params.pid);
 
     res.json(product)
 
    }catch(err){
     next(err)
    }
}

export const postProduct = async (req, res, next) => {
  try {
     const newData = req.body;

     const userPer = req.user

     const { files } = req;

     const imageFiles = files.filter((file) => file.mimetype.startsWith('image/'));
     const pdfFile = files.filter((file) => file.mimetype === 'application/pdf');
     if (imageFiles && imageFiles.length > 0) {
         newData.images = imageFiles.map(file => `${file.filename}`);
     }

     console.log(pdfFile,'pdfFile')

     if (pdfFile) {
      newData.pdfFile = pdfFile[0].filename;
     }

     const newProduct = await productServices.postProduct(userPer ,newData)

     console.log(newProduct,'newProduct')

     res.json(newProduct)

  } catch (error) {
    console.log(error.message,'error')
     next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try{
      const updProduct = await productServices.updateProduct(req.params.pid, req.body, req.user._id)
  
      res.json(updProduct)

  }catch(err){
      next(err)
  }
}

export const deleteProduct = async (req, res, next) => {
  try{
      const idProduct = await productServices.deleteProduct(req.params.pid, req.user._id)
      
      res.json(idProduct)

  }catch(err){
      next(err)
  }
}
