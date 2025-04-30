import { Product } from "../../models/mongoose/productModel.js";

class CategoryDao{
    async modifyGroupCategory(productIds, category) {
        try {

          const updatedProducts = await Product.updateMany(
            { _id: { $in: productIds } },
            { $set: { category } }
          );

          return updatedProducts;
        } catch (error) {
          console.error('Error al obtener productos por categoria:', error);
          throw error;
        }
      }
}

export const categoryDao = new CategoryDao();