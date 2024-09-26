import { Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';

const schemaCarrito = new Schema(
  {
    _id: { type: String, default: randomUUID },
    status: { type: Boolean, default: true },
    carrito: [
      {
        productID: { type: String, ref: 'products' },
        cant: { type: Number, min: 1, default: 1 },
      },
    ],
    user: { type: String, require: true},
    totalAmount: { type: Number, default: 0 },
  }, 
  {
    strict: 'throw',
    versionKey: false,
  }
);

schemaCarrito.methods.upsertProd = async function (prodId, quantity) {

  const existingProductIndex = this.carrito.findIndex(p => String(p.productID) === prodId);
  
  if (existingProductIndex !== -1) {

    // Si el producto ya existe, actualiza la cantidad
    this.carrito[existingProductIndex].cant = quantity;

  } else if (quantity > 0) {

    // Si el producto no existe y la cantidad es mayor que 0, agrégalo
    this.carrito.push({
      productID: prodId,
      cant: quantity
    });
    
  }

  await this.save();
};


schemaCarrito.pre('find', function (next) {
  this.populate('carrito.productID');
  next();
});

export const Carrito = model('carrito', schemaCarrito);


