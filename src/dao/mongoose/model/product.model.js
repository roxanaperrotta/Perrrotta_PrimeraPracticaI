import mongoose from "mongoose";
import { Schema } from "mongoose";

const productsCollection = "productos";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },
   
    code: {
        type: String,
        required: true,
        unique: true
    },
    
    stock: {
        type: Number,
        required: true
    },

    thumbnail: [],
})

export const productModel = mongoose.model(productsCollection, productsSchema)