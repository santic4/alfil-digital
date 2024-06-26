import pkg from 'bcryptjs';
const { hashSync, compareSync } = pkg;
import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from '../config/config.js';

// hash
export function hashear(frase) {
  if (!frase || typeof frase !== 'string') {
    throw new Error('Invalid data to hash. Expected a non-empty string.');
  }
  return hashSync(frase);
}

export function hasheadasSonIguales({ recibida, almacenada }) {
  if (!recibida) throw new Error('invalid data to decode')
  if (!almacenada) throw new Error('invalid data to compare')
  return compareSync(recibida, almacenada)
}

// jwt
export function encriptar(data) {
  return new Promise((resolve, reject) => {
    if (!data) {
      return reject(new Error('nothing to jwt encode!'))
    }
    jwt.sign(data, JWT_PRIVATE_KEY, { expiresIn: '24h' }, (err, encoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(encoded)
      }
    })
  })
}

export function desencriptar(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error('no token to decode!'))
    }
    jwt.verify(token, JWT_PRIVATE_KEY, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}
