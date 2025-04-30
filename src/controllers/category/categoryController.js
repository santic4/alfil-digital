import { categoryServices } from "../../services/category/categoryServices.js";

export const modifyGroupCategory = async (req, res, next) => {
    const { productIds, category } = req.body;

    try {

      const updatedProducts = await categoryServices.modifyGroupCategory(productIds, category)

      res.json(updatedProducts);
    } catch (error) {
      next(error)
    }
}
