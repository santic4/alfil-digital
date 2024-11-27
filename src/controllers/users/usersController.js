import { usersManager } from "../../models/index.js";
import { usersServices } from "../../services/users/usersServices.js";
import { hashear } from "../../utils/cryptografia.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await usersServices.getCurrentUser(req.user)

    res.successfullGet(user)

  } catch (error) {
      req.logger.error('Error al obtener información del usuario:'+ error.message);
      next(error);
  }
};
