import { Carrito } from "../models/mongoose/cartModel.js"
import { cartRepository } from "../repository/cartRepository.js"
import { usersRepository } from "../repository/usersRepository.js"
import { productRepository } from "../repository/productRepository.js"
import { cartDao } from "../DAO/MongooseDAO.js/cartDao.js"
import { ticketServices } from '../services/ticketServices.js'
import { emailService } from '../services/email/emailServices.js'
import { NotFoundError } from '../models/errors/notFoundError.js'

class CartServices {

    async getCartId(cid){
        const cartSelected = await cartRepository.getCartId(cid)

        return cartSelected
    }

    async postCart(user){
        if(!user){
          user = 'user n/r'
        }
        const newCart = await cartRepository.postCart(user)

        return newCart
    }

    async updateQuantityProductInCart(cid, pid, cantidadNumerica){
        
        if (isNaN(cantidadNumerica) || cantidadNumerica < 0) {
            throw new Error('La nueva cantidad debe ser un número válido y no puede ser negativa.');
        }
        
        const cart = await cartRepository.getCartId(cid);

        console.log(cart, 'cart')

        const productoEnCarrito = cart.carrito.find(item => item.productID._id === pid);

        console.log(productoEnCarrito, 'productoEnCarrito')

        if (!productoEnCarrito) {
            throw new NotFoundError();
        }

        const cartUpd = await cartRepository.updateQuantityProductInCart(cid, pid, cantidadNumerica);

        return cartUpd
    }

    async postProductIntoCart(cid, pid){
        const existCart = await cartRepository.getCartId(cid)

        if (!existCart) {  
            throw new Error('El carrito no existe')
        }


        const productExist = await Carrito.find({
          _id: cid,
          carrito: { $elemMatch: { productID: pid } }
        })

        if(!productExist){
            throw new Error('El producto buscado no existe')
        }

        const updProd = await cartRepository.postProductIntoCart(cid, pid, productExist)

        console.log(updProd, 'UPD PROD')

        return updProd
    }

    async deleteCart(cid){
        const idCart = cid

        if(!idCart){
            throw new Error('Cart not found.')
        }

        const deletedCart = await cartRepository.deleteCart(idCart)

        if(!deletedCart){
            throw new Error('Cart not found.')
        }

        return deletedCart
    }

    async deleteProdInCart(cid, pid){
        if(!cid || !pid){
            throw new Error('Data invalid')
        }

        await cartRepository.getCartId(cid);

        const prodInCart = await cartRepository.deleteProdInCart(cid, pid)

        if(!prodInCart){
            throw new Error('Producto no existe en el carrito')
        }

        return prodInCart
    }

    async purchaseCart(cartID) {
        try {
            const cart = await cartRepository.getCartId(cartID);
     
            const failedProductIds = [];
            const userID = cart.user;

            const user = await usersRepository.findById(userID);

            const email = user.email;
            console.log(cart,'cart')

            const ticket = await this.createTicket(cart);

            await this.processProducts(cart, failedProductIds);

            await this.updateCartAfterPurchase(cart, failedProductIds);
  
            await emailService.send(
                email,
                'Gracias por su compra',
                'Le informamos que ha sido realizada con éxito!',
                `Nro ticket: ${ticket.code}`
            );

            return { ticket, failedProductIds };
        } catch (error) {
            throw new Error('Error al realizar la compra del carrito.', error);
        }
        
    }

    async createTicket(cart, userEmail) {
        const ticketData = { 
          purchase_datetime: new Date(),
          amount: cart.totalAmount,
          purchaser: cart.user,
        };
        console.log(ticketData,'ticketDATA')
     
        const ticket = await ticketServices.generateTicket(
          ticketData.code,
          ticketData.purchase_datetime,
          ticketData.amount,
          ticketData.purchaser
      );
     
        return ticket;
      }
     
    async processProducts(cart, failedProductIds) {
        for (const cartProduct of cart.carrito) {
          const success = await this.updateProductStock(
            cartProduct.productID,
            cartProduct.cant,
            failedProductIds
          );
     
          if (!success) {
            continue;
          }
        }
      }

      async updateProductStock(productId, quantity, failedProductIds) {
        try {
          const product = await productRepository.getProductId(productId);
     
          if (product.stock >= quantity) {
            product.stock -= quantity;
            await product.save();
            return true;
          } else {
            failedProductIds.push(productId);
            return false;
          }
        } catch (error) {
          throw new Error('Error al actualizar el stock del producto.');
        }
       }
     
    async updateCartAfterPurchase(cart, failedProductIds) {
        try {
          const failedProducts = cart.carrito.filter((cartProduct) =>
            failedProductIds.includes(cartProduct.productID)
          );
     
          cart.carrito = failedProducts;
          await cartDao.saveCart(cart);

        } catch (error) {
          throw new Error('Error en el carrito')
        }
      }
    
    }



export const cartServices = new CartServices()