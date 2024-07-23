import { usersServices } from "../../services/users/usersServices.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await usersServices.getCurrentUser(req.user)

    res.successfullGet(user)

  } catch (error) {
      req.logger.error('Error al obtener información del usuario:'+ error.message);
      next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await usersServices.createUser(req.body)

    res.successfullPost(user)

  } catch (error) {
      req.logger.error('Error al obtener información del usuario:'+ error.message);
      next(error);
  }
};
