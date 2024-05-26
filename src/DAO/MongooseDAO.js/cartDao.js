import { Carrito } from "../../models/mongoose/cartModel.js"
import { logger } from "../../utils/logger.js";

class CartDao {

    async getCartId(cid){
      try{
        const idCarritoSelec = await Carrito.findById(cid)
          .populate('carrito.productID');
        
        return idCarritoSelec
      }catch(error){
        throw new Error(`Error al obtener el carrito por ID: ${error.message}`);
      }
    }

    async postCart(user){
      try {
        const newCarrito = await Carrito.create({ user: user })

        logger.info(newCarrito,'newCarrito')

        return newCarrito
      } catch (error) {
        throw new Error(`Error al crear un nuevo carrito: ${error.message}`);
      }
    }
    
    async updateQuantityProductInCart(cid, pid, cantidadNumerica){
      try {
        const carrito = await Carrito.findById(cid);

        await carrito.upsertProd(pid, cantidadNumerica);
        
        return carrito
      } catch (err) {
        throw new Error(`Error al actualizar el carrito: ${err.message}`);
      }
    }

    async postProductIntoCart(cid, pid, productExist){

      if (productExist.length > 0) {
        
        const updProduct = await Carrito.findByIdAndUpdate(
          cid,
          { $inc: { "carrito.$[elem].cant": 1 }},
            { arrayFilters: [{ "elem.productID": pid }]},
            { new: true }
        )

        return updProduct

     } else {
        const addProduct = await Carrito.findByIdAndUpdate(
          cid,
            { $push: { carrito: { productID: pid, cant: 1 } } },
            { new: true }
        ).lean()
        
        return addProduct;
    }
    }

    async deleteCart(cartID){
        const deletedCart = await Carrito.findByIdAndDelete(cartID)
   
        return deletedCart
    }

    async deleteProdInCart(cid, pid){

        const deletedProd = await Carrito.findByIdAndUpdate(
          cid,
          { $pull: { carrito: { productID: pid } } },
          { new: true }
        );
        console.log(deletedProd,'DELETED PROD')

        return deletedProd
    }

    async saveCart(cart) {
      try{
        await cart.save();
      } catch (error) {
        throw new Error('Error saving cart');
      }
    }
}

export const cartDao = new CartDao()