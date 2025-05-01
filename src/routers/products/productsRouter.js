import { Router } from 'express'
import { deleteProduct, getAllProducts, getAllProductsAdmin, getCategory, getFilteredProducts, getProductId, toggleFeaturedStatus, modifyPricesAll, modifyPricesByCategory, postProduct, postProductTest, selectedModifyGroupDescription, selectedModifyProductsController, updateProduct, getFeaturedProducts } from '../../controllers/products/productsController.js';
import { passportAuth } from '../../middlewares/passport.js';
import { adminsOnly } from '../../middlewares/authorizationUserAdmin.js';
import { upload } from '../../middlewares/multer.js';

export const productsRouter = Router()

productsRouter.get('/', 
    getAllProducts
);

// PUT /products/admin
productsRouter.get('/admin', 
  passportAuth,
  adminsOnly,
  getAllProductsAdmin
)

// GET /products/category/
productsRouter.get('/category', 
    getCategory
)

productsRouter.get('/filter', 
    getFilteredProducts
)



// ADMIN

productsRouter.get('/featured-products',
  getFeaturedProducts
);

productsRouter.put('/featured-products/toggle-status', 
    passportAuth,
    adminsOnly,
    toggleFeaturedStatus
);


// GET /products/pid
productsRouter.get('/:pid', 
    getProductId
)

// POST /products/
const handleUpload = upload.fields([
  { name: 'images', maxCount: 20 }
]);

productsRouter.post('/',
  passportAuth,
  adminsOnly,
  handleUpload,
  postProduct
);

// PUT /products/:pid
productsRouter.put('/:pid', 
  passportAuth,
  adminsOnly,
  handleUpload,
  updateProduct
)

// DEL /products/:pid
productsRouter.delete('/:pid', 
  passportAuth,
  adminsOnly,
  deleteProduct
)

// Endpoint para modificar precios de todos los productos
productsRouter.post('/modify-all',
  passportAuth,
  adminsOnly,
  modifyPricesAll
);

// Endpoint para modificar precios por categoría
productsRouter.post('/modify-by-category', 
  passportAuth,
  adminsOnly,
  modifyPricesByCategory
);

// MODIFICAR PRECIO EN GRUPO

productsRouter.post('/modify-selected', 
  passportAuth,
  adminsOnly,
  selectedModifyProductsController
);

// MODIFICAR DESCRIPCION EN GRUPO

productsRouter.post('/modify-group-description', 
  passportAuth,
  adminsOnly,
  selectedModifyGroupDescription
);
