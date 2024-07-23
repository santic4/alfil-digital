import { usersServices } from '../../services/users/usersServices.js'
import { encriptar } from "../../utils/cryptografia.js"

const COOKIE_OPTS = { signed: true, maxAge: 1000 * 60 * 60, httpOnly: true }

export async function loginUser(username, password, done){
  try {
    
    const user = await usersServices.findUserByUsername({ username, password })
    done(null, user)
  } catch (error) {
    done(error)
  }
}

// COOKIES
export async function appendJwtAsCookie(req, res, next) {
  try {
    const jwt = await encriptar(req.user)
  
    res.cookie('authorization', jwt, COOKIE_OPTS)
    next() 
  } catch (error) {
    console.log('ERROR', error)
    next(error)
  }
}
  
export async function removeJwtFromCookies(req, res, next) {
  res.clearCookie('authorization', COOKIE_OPTS)
  next()
}

export async function jwtAuthentication(user, done) {
  done(null, user);
}