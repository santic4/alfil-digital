import { Product } from '../../models/mongoose/productModel.js'
import { randomUUID } from 'crypto'
import { logger } from '../../utils/logger.js';

class ProductDao{
    async getAllProducts(filter, options){

        const paginado= await Product.paginate(filter, options);

        return paginado
    }

    async getAllProductsAdmin(){

        const productAdmin = await Product.find({}).lean();
       
        return productAdmin

    }

    async getCategory(category){
        const categoriasProductos = await Product.find({ category: category });

        return categoriasProductos;
    }

    async getProductId(pid){

        const productoPorId = await Product.findById(pid);

        return productoPorId;
    
    }

    async postProduct(userId, newData){

        console.log(userId,' user id', newData, 'newDAta eb DAO')
        newData.owner = userId;

        let inserted = false;
        let newProduct;
    
        while (!inserted) {
            try {
                newData._id = randomUUID(); 

                newProduct = await Product.create(newData);

                logger.info('Vez suma')
                inserted = true; 
            } catch (error) {
                if (error.code === 11000) {
                    logger.info('Se entro en error por duplicacion')
                } else {
                    logger.info('Se entro algun otro error que no es codigo duplicacion')
                }
            }
        }

        return newProduct
    }

    async updateProduct(pid, newData){
        console.log(pid,'pid', newData,'newData')
        const updProduct = await Product.findByIdAndUpdate(
            pid,
            { $set: newData },
            { new: true }
        );

        return updProduct
    }

    async deleteProduct(pid){
        const delProduct = await Product.findByIdAndDelete(pid);

        return delProduct
    }
}

export const productDao = new ProductDao()