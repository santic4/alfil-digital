import { Router } from 'express'

//controllers
import { createUser, getCurrentUser } from '../controllers/usersController.js'

// passport
import { passportAuth } from '../middlewares/passport.js'
import { adminsOnly } from '../middlewares/authorizationUserAdmin.js'


export const usersRouter = Router()

usersRouter.get('/current', 
    passportAuth,
    adminsOnly,
    getCurrentUser
)

usersRouter.post('/',
    createUser
)