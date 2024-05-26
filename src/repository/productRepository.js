import { productDao } from "../DAO/MongooseDAO.js/productDao.js"
import { DataInvalid } from '../models/errors/dataInvalid.js'

class ProductRepository{
    async getAllProducts(filter, options){
        try {
            const paginado = await productDao.getAllProducts(filter, options)

            return paginado

        } catch (error) {
            throw new Error('Error en filtros')
        }
    }

    async getCategory(category){
        const categoryProducts = await productDao.getCategory(category);

        return categoryProducts
    }

    async getProductId(pid){
        try {
            const product = await productDao.getProductId(pid)

            return product  
        } catch (error) {
            throw new Error('Producto no encontrado')
        }
    };

    async postProduct(userId, newData){
        try {
            const newProduct = await productDao.postProduct(userId, newData)

            return newProduct
        } catch (error) {
            console.error(error.message)
            throw new DataInvalid()
        }
    }

    async updateProduct(pid, newData, user){
        try {
            const updProduct = await productDao.updateProduct(pid, newData, user)

            return updProduct
        } catch (error) {
            console.log(error.message)
            throw new Error(`Error al actualizar el producto por ID: ${error.message}`);
        }
    }

    async deleteProduct(pid) {
        try {
            const updProduct = await productDao.deleteProduct(pid)

            return updProduct
        } catch (error) {
            throw new Error('Producto no encontrado')
        }
    }
}

export const productRepository = new ProductRepository()