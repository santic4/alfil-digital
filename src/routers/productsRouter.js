import { Router } from 'express'
import { deleteProduct, getAllProducts, getCategory, getFile, getFilteredProducts, getProductId, postProduct, sendEmail, updateProduct } from '../controllers/productsController.js';
import { passportAuth } from '../middlewares/passport.js';
import { adminsOnly } from '../middlewares/authorizationUserAdmin.js';
import { upload } from '../middlewares/multer.js';
import { FeaturedProducts } from '../models/mongoose/featuredModel.js';


export const productsRouter = Router()

productsRouter.get('/', 
    getAllProducts
);

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

    console.log(schema)
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

productsRouter.get('/files/:filename', getFile);

productsRouter.post('/send-email', sendEmail);

// POST /products/
const handleUpload = upload.array('files', 20);

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
