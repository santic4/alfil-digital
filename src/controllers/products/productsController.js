import { bucket } from "../../config/firebase-config.js";
import { Product } from "../../models/mongoose/productModel.js";
import { productServices } from "../../services/products/productServices.js";
import { logger } from "../../utils/logger.js";

export const getAllProducts = async (req, res, next) => {
    try {

        const options = {
          page: req.query.page || 1,
          limit: req.query.itemsPorPagina || 20, 
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

export const getAllProductsAdmin = async (req, res, next) => {
    try {

        const productAdmin = await productServices.getAllProductsAdmin();

        res.json(productAdmin);
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

export const check = async (req, res, next) => {
  try {
    
    const file = req.file
     res.json(file)

  } catch (error) {
    console.log(error.message,'error')
     next(error)
  }
}


export const postProduct = async (req, res, next) => {
  try {
    const newData = req.body;
    const { files } = req;
    
    const imageFiles = files.images || [];
    const fileadjuntos = files.files || [];
    
    const imageUrls = [];
    const fileUrls = [];
    console.log('llegue aca ')

    // Subir imágenes a Firebase Storage
    for (const file of imageFiles) {
      const fileUpload = bucket.file(`images/${file.originalname}`);
      await fileUpload.save(file.buffer, { contentType: file.mimetype });
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
      imageUrls.push(imageUrl);
    }

    // Subir archivos a Firebase Storage
    for (const file of fileadjuntos) {
      const fileUpload = bucket.file(`files/${file.originalname}`);
      await fileUpload.save(file.buffer, { contentType: file.mimetype });
      const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
      fileUrls.push(fileUrl);
    }

    // Guardar las URLs en el objeto newData
    newData.images = imageUrls;
    newData.fileadj = fileUrls;

    const newProduct = await productServices.postProduct(req.user, newData);

    res.json(newProduct);
  } catch (error) {
    console.log(error.message, 'error');
    next(error);
  }
};

// 

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

    const idProduct = await productServices.deleteProduct(req.params.pid, req.user.url._id)
    console.log(idProduct,'idProduct delete ')
    res.json(idProduct)

  }catch(err){
      next(err)
  }
}
