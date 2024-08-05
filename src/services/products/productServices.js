import { PermissionsError } from "../../models/errors/permissionsError.js";
import { productRepository } from "../../repository/productRepository.js";
import { usersRepository } from "../../repository/usersRepository.js";
import { NotFoundError } from '../../models/errors/notFoundError.js'
import { emailService } from "../email/emailServices.js";
import { DataInvalid } from "../../models/errors/dataInvalid.js";
import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY } from '../../config/config.js';

class ProductServices{
    async getAllProducts(filter, options){
        
        const paginado = await productRepository.getAllProducts(filter, options)

        const results = {
            status: 'success',
            payload: paginado.docs,
            totalPages: paginado.totalPages,
            prevPage: paginado.prevPage,
            nextPage: paginado.nextPage,
            page: paginado.page,
            hasPrevPage: paginado.hasPrevPage,
            hasNextPage: paginado.hasNextPage,
        };

        return results
    }

    async getAllProductsAdmin(){
        
        const productAdmin = await productRepository.getAllProductsAdmin()

        return productAdmin
    }

    async getCategory(category){
        if(!category){
            throw new DataInvalid()
        }
        const categoryProducts = await productRepository.getCategory(category);


        return categoryProducts
    }

    async getProductId(pid){
        const product = await productRepository.getProductId(pid)

        if(!product){
            throw new NotFoundError()
        }

        return product
    }
    


    async postProduct(user ,newData){
  
        if (newData.price < 0) {
            throw new Error('El precio del producto no puede ser negativo.');
        }
   

        if (user.url.rol !== 'admin') {
            throw new PermissionsError();
        }
  
        const userId = user.url._id

        const newProduct = await productRepository.postProduct(userId, newData)

        return newProduct
    }

    async updateProduct(pid, newData, user){

        const Usuario = await usersRepository.findById(user)

        if (!Usuario) {
            throw new Error('User not found.');
        }

        if (!(Usuario.rol === 'admin')) {
            throw new Error('No tienes permisos para modificar productos');
        }

        const product = await productRepository.getProductId(pid);

        if (!product) {
            throw new NotFoundError();
        }

        const updProduct = await productRepository.updateProduct(pid, newData, Usuario)

        if (!updProduct) {
            throw new Error(`El producto con id ${pid} no se encontró`);
        }

        return updProduct
    }

    async deleteProduct(pid, userId) {

        const Usuario = await usersRepository.findById(userId)
    
   
        if (!Usuario) {
            throw new Error('Usuario no encontrado');
        }

        if (Usuario.rol !== 'admin' ){
            throw new Error('No tienes permisos para modificar productos');
        }

        const product = await productRepository.getProductId(pid);
        console.log(product,'product')

        const delProducto = await productRepository.deleteProduct(pid);

        console.log(delProducto,'delproducto')

        delProducto && Usuario.rol === 'premium' && emailService.send(
            Usuario.email,
            'Producto eliminado',
            `El producto eliminado fue ${product.title}`
        );

        return delProducto;
    }; 
}

export const productServices = new ProductServices()