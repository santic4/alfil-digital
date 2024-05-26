import { authorizeAdmin } from '../controllers/authorizationUserAdmin.js'

export const adminsOnly = authorizeAdmin;
