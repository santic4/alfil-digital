import { Product } from "../models/mongoose/productModel.js";
import Transaction from "../models/mongoose/transactionSchema.js";
import { emailService } from "../services/email/emailServices.js";
import { productServices } from "../services/productServices.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchTransactionByPaymentId } from "../services/transactionsCardServices.js";
import { cartServices } from "../services/cartServices.js";
import { cartServicesMP } from "../services/email/emailProducts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
     const fileadjuntos = files.filter(file => !file.mimetype.startsWith('image/'));
     
     if (imageFiles && imageFiles.length > 0) {
         newData.images = imageFiles.map(file => `${file.filename}`);
     }

     if (fileadjuntos) {
      const fileadjArray = fileadjuntos.map(file => file.filename);
      newData.fileadj = fileadjArray;
     }

     const newProduct = await productServices.postProduct(userPer ,newData)

     res.json(newProduct)

  } catch (error) {
    console.log(error.message,'error')
     next(error)
  }
}

// 

export const getFile = async (req, res) => {
    const { paymentId } = req.params;
    const { emailSend } = req.query;

    try {
        if (!paymentId || !emailSend) {
            return res.status(401).json({ error: 'Falta paymentId o email.' });
        }

        const transaction = await fetchTransactionByPaymentId(paymentId);

        if (!transaction || transaction.status !== 'accredited') {
            return res.status(401).json({ error: 'Transacción no encontrada o no acreditada.' });
        }

        const cartID = transaction.cart;
        const carritoFound = await cartServices.getCartId(cartID);

        if (!carritoFound) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }

        const nombresArchivos = carritoFound.carrito.reduce((acc, item) => {
            return acc.concat(item.productID.fileadj);
        }, []);

        const directory = path.join(__dirname, '../../statics/fileadj');
        const fileUrls = nombresArchivos.map(nombreArchivo => path.join(directory, nombreArchivo));

        // Enviar correos con enlaces de descarga
        const message = `Gracias por tu compra. Puedes descargar tus archivos desde los siguientes enlaces: ${fileUrls.join(', ')}`;
        cartServicesMP.sendEmailProducts(paymentId, fileUrls, emailSend)

        // Devolver enlaces de descarga al frontend
        const downloadLinks = nombresArchivos.map(nombreArchivo => ({
            fileName: nombreArchivo,
            downloadLink: `/statics/fileadj/${nombreArchivo}`
        }));

        res.status(200).json({ files: downloadLinks });

    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const sendEmailProducts = async (req, res) => {
    const { email, fileUrls } = req.body;
    const { cart } = req.headers;

    if (!cart) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    try {
        const transaction = await fetchTransactionByPaymentId(paymentId);

        if (!transaction) {
            return res.status(403).json({ error: 'Pago no verificado' });
        }

        const filesList = fileUrls.join(', ');
        const message = `Gracias por tu compra. Puedes descargar tus archivos desde los siguientes enlaces: ${filesList}`;

        await emailService.send(email, 'Archivos comprados', message);

        res.status(200).json({ message: 'Correo enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error al enviar el correo' });
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
      const idProduct = await productServices.deleteProduct(req.params.pid, req.user._id)
      
      res.json(idProduct)

  }catch(err){
      next(err)
  }
}
