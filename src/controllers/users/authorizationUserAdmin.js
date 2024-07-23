import { PermissionsError } from "../../models/errors/permissionsError.js";
import { logger } from "../../utils/logger.js";

export async function authorizeRoles(req, res, next, allowedRoles) {
  logger.info(req.user,'user en authorize')
    if (!allowedRoles.includes(req.user['rol'])) {
      return next(new PermissionsError());
    }
    next();
  }

  export async function authorizeAdmin(req, res, next) {
    const listOfRoles = ['admin'];
    authorizeRoles(req, res, next, listOfRoles);
  }
