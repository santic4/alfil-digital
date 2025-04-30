import { categoryDao } from "../../DAO/MongooseDAO.js/categoryDao.js";

class Category {

    async modifyGroupCategory(productIds, category) {

        if (!productIds || !category) {
          throw new Error('Datos insuficientes')
        }
    
        const response = await categoryDao.modifyGroupCategory(productIds, category)

        return response
    }

}

export const categoryServices = new Category();