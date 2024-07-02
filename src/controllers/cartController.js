import { cartServices } from "../services/cartServices.js";

// Obtener un carrito por ID
export const getCartId = async (req, res, next) => {
    try {
        const carritoPorId = await cartServices.getCartId(req.params.id);
        
        res.json(carritoPorId);

    } catch (err) {
        next(err)
    }
};


// Crear un nuevo carrito
export const postCart = async (req, res, next) => {
    try {
        const newCarrito = await cartServices.postCart(req.body.user);
        
        res.json(newCarrito);

    } catch (err) {
        next(err)
    }
};

export const updateQuantityProductInCart = async (req, res, next) => {
    try {
        console.log(req.body.quantity, 'req.body')
        const { cid, pid } = req.params;
        const nuevaCantidad  = req.body.quantity;
   
        const cantidadNumerica = parseInt(nuevaCantidad);

        const productoActualizado = await cartServices.updateQuantityProductInCart(cid, pid, cantidadNumerica);

        res.status(201).json({ message: 'Producto Actualizado en el Carrito', info: productoActualizado });
    } catch (err) {
        next(err)
    }
}

// Añadir un producto al carrito o incrementar la cantidad si ya existe
export const postProductIntoCart = async (req, res, next) => {
    try {
        const producto = await cartServices.postProductIntoCart(req.params.cid, req.params.pid);
        
        res.status(201).json({ message: 'Producto Agregado', info: producto });
    
    } catch (err) {
        next(err)
    }
};

// Eliminar un carrito por ID
export const deleteCart = async (req, res, next) => {
    try {
        const delCarrito = await cartServices.deleteCart(req.params.cid);
        
        res.status(201).json({ message: 'Carrito Eliminado', info: delCarrito });

    } catch (err) {
        next(err)
    }
}

export const deleteProdInCart = async (req, res, next) => {
    try {
        const delProdInCarrito = await cartServices.deleteProdInCart(req.params.cid, req.params.pid);
        
        res.status(201).json({ message: 'Producto Eliminado del carrito', info: delProdInCarrito });
        
    } catch (error) {
        next(error)
    }
};

// BUY
export const purchaseCart = async (req, res, next) => {
    try {

      const result = await cartServices.purchaseCart(req.params.cid);

      res.status(200).json(result);

    } catch (error) {
      next(error)
    }
};