import { Router} from 'express'
import { deleteCart, deleteProdInCart, getCartId, postCart, postProductIntoCart, purchaseCart, updateQuantityProductInCart } from '../controllers/cartController.js'

export const carritoRouter = Router()

// GET /carts/:cid/
carritoRouter.get('/:id',
    getCartId
);

// POST /carts/
carritoRouter.post('/',
    postCart
);

// PUT /carts/:cid/product/:pid
carritoRouter.put('/:cid/product/:pid',
    updateQuantityProductInCart
);

// PUT /carts/:cid/add/:pid
carritoRouter.put('/:cid/add/:pid', 
    postProductIntoCart
)

// DELETE /carts/:cid 
carritoRouter.delete('/:cid', 
    deleteCart
)

// DELETE /carts/:cid/product/:pid
carritoRouter.delete('/:cid/product/:pid', 
    deleteProdInCart
);

// BUY
carritoRouter.post('/:cid/purchase', 
    purchaseCart
);