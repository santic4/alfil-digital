import { Schema, model } from 'mongoose'

const schemaProduct = new Schema ({
    _id: { type: String},
    title: { type: String},
    price: { type: Number },
    images: { type: [String], default: [] },
}, {
    strict: 'throw',
    versionKey: false,
})


export const FeaturedProducts = model('featured-products', schemaProduct)