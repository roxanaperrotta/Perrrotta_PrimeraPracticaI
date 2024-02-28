import { Router } from 'express'
import { cartModel } from "../dao/mongoose/model/carts.model.js"
import { productModel } from '../dao/mongoose/model/product.model.js'

const cartsRouter = Router()

cartsRouter.post('/', async (req, res) => {
    try {
        const cart = await cartModel.create({ products: [] })
        res.status(200).send({ result: 'Success', message: cart })
    } catch (error) {
        res.status(400).send({ result: 'Error', message: error })
    }
})

cartsRouter.get('/', async (req, res) => {
    try {
        const allCarts = await cartModel.find({}, { _id: 0, __v: 0 }).lean();
        res.status(200).send( {result: 'Success', message: allCarts});
    } catch (error) {
        res.status(400).send('Internal server Error', error)
    }
})

cartsRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            return res.status(404).send({ result: 'Error', message: 'Cart not found' })
        }
        res.status(200).send({ result: 'Success', message: cart })
    } catch (error) {
        res.status(400).send({ result: 'Error consulting cart', error })
    }
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            return res.status(404).json({ result: 'Error', message: 'Cart not found' })
        }

        const product = await productModel.findById(pid)
        if (!product) {
            return res.status(404).json({ result: 'Error', message: 'Product not found' })
        }

        const existingProductIndex = cart.products.findIndex(prod => prod.product.toString() === pid)
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity
        } else {
            cart.products.push({ product: pid, quantity })
        }
        await cart.save()
        res.status(200).json({ result: 'Success', message: 'Product added to cart' })
    } catch (error) {
        res.status(400).json({ result: 'Error', message: error.message })
    }
})

export default cartsRouter