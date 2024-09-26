import { bucket } from "../../config/firebase-config.js";
import { Category } from "../../models/mongoose/categories.js";
import { Product } from "../../models/mongoose/productModel.js";
import { productServices } from "../../services/products/productServices.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.itemsPorPagina) || 12;
    const order = req.query.sortOrder || 'default';
    const searchTerm = req.query.name || '';
    const categories = req.query.categories ? req.query.categories.split(',') : [];

    const options = {
      page,
      limit,
      lean: true,
    };

    let sort = {};
    switch (order) {
      case 'price':
        sort = { priceARS: 1 }; // Precio ascendente
        break;
      case '-price':
        sort = { priceARS: -1 }; // Precio descendente
        break;
      case 'title':
        sort = { title: 1 }; // Orden alfabético
        break;
      default:
        sort = { position: 1 }; // Orden por posición
    }

    options.sort = sort;

    // Filtros dinámicos
    const filter = {};
    if (categories.length > 0) {
      filter.category = { $in: categories };
    }
    if (searchTerm) {
      filter.title = { $regex: searchTerm, $options: 'i' }; // Búsqueda por nombre
    }

    const paginado = await productServices.getAllProducts(filter, options);
    res.json(paginado);
  } catch (error) {
    next(error);
  }
};


export const postProduct = async (req, res, next) => {
  try {
    const newData = req.body;
    const { files } = req;

    const imageFiles = files.images || [];
    const fileadjuntos = newData.fileadj || [];

    if(fileadjuntos.length === 0){
      throw new Error('Debes cargar archivos como producto.')
    }

    const imageUrls = [];

    // Subir imágenes a Firebase Storage
    for (const file of imageFiles) {
      const fileUpload = bucket.file(`images/${file.originalname}`);
      await fileUpload.save(file.buffer, { contentType: file.mimetype });
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
      imageUrls.push(imageUrl);
    }
    
    // Guardar las URLs en el objeto newData
    newData.images = imageUrls;

    const newProduct = await productServices.postProduct(req.user, newData);

    res.json(newProduct);
  } catch (error) {

    next(error);
  }
};

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

export const postCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
    }

    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json({ message: 'Categoría agregada' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'La categoría ya existe' });
    }
    next(error);
  }
};

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

     next(error)
  }
}



// 

export const updateProduct = async (req, res, next) => {
  try{
    
    const { files } = req;

    const updProduct = await productServices.updateProduct(req.params.pid, req.body, files)
  
    res.json(updProduct)

  }catch(err){
      next(err)
  }
}

export const deleteProduct = async (req, res, next) => {
  try{
    const idProduct = await productServices.deleteProduct(req.params.pid, req.user.url._id)

    res.json(idProduct)

  }catch(err){
      next(err)
  }
}
