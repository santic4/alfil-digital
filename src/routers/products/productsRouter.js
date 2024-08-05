import { Router } from 'express'
import { deleteProduct, getAllProducts, getAllProductsAdmin, getCategory, getFilteredProducts, getProductId, postProduct, updateProduct } from '../../controllers/products/productsController.js';
import { passportAuth } from '../../middlewares/passport.js';
import { adminsOnly } from '../../middlewares/authorizationUserAdmin.js';
import { upload } from '../../middlewares/multer.js';
import { FeaturedProducts } from '../../models/mongoose/featuredModel.js';

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

productsRouter.get('/featured-products', async (req, res) => {
  try {
    const products = await FeaturedProducts.find({});
    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

productsRouter.post('/featured-products', async (req, res) => {
  try {
    const body = req.body
    
    const schema = {
      _id:body._id,
      images: body.images,
      title: body.title,
      price: body.price,
      category: body.category
    }

    const newProduct = await FeaturedProducts.create(schema);

    await newProduct;
    res.json(newProduct);
  } catch (error) {
    res.status(500).send(error);
  }
});

productsRouter.delete('/featured-products/:id', async (req, res) => {
  try {
    await FeaturedProducts.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET /products/pid
productsRouter.get('/:pid', 
    getProductId
)


// POST /products/
const handleUpload = upload.fields([
  { name: 'files', maxCount: 20 },
  { name: 'images', maxCount: 10 }
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
    updateProduct
)

// DEL /products/:pid
productsRouter.delete('/:pid', 
    passportAuth,
    adminsOnly,
    deleteProduct
)
