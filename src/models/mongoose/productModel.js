import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { randomUUID }from 'crypto'

const schemaProduct = new Schema ({
    _id: { type: String, default: randomUUID() },
    title: { type: String, require: true },
    description: { type: String, require: true },
    priceARS: { type: Number, require: true }, 
    priceUSD: { type: Number, require: true },
    status: { type: Boolean, default: true },
    category: { type: String, require: true },
    mercadoLibreUrl: { type: String, default: '' },
    images: { type: [String], default: [] },
    fileadj: [
        {
          url: { type: String, required: true }, // URL del archivo
          name: { type: String, required: true } // Nombre asociado al archivo
        }
      ],
    position: { type: Number, default: null },
    owner: { type: String, ref: 'users' },
}, {
    strict: 'throw',
    versionKey: false,
})

schemaProduct.plugin(mongoosePaginate)

export const Product = model('products', schemaProduct)