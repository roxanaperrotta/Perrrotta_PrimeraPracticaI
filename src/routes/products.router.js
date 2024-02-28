import { Router } from "express"
import { productModel } from "../dao/mongoose/model/product.model.js"

const productsRouter = Router()


productsRouter.get('/', async (req, res) => {
    try {
        const products = await productModel.find({}, { _id: 0, __v: 0 }).lean() 
        res.render('home', {products})
    } catch (error) {
        res.status(400).send('Internal server Error', error)
    }
})


productsRouter.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {
       
    })
})


productsRouter.get('/', async (req, res) => {
    const { limit } = req.query
    try {
        const products = await productModel.find().limit(limit)
        res.status(200).send({ result: 'Success', message: products })
    } catch (error) {
        req.status(400).send({
            response: 'Error ', message: error
        })
    }
})


productsRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const product = await productModel.findById(id)
        if (!product) {
            return res.status(404).send('Producto no encontrado')
        }
        res.status(200).send({ result: 'Success', message: product })
    } catch (error) {
        res.status(404).send({ result: 'Error', message: 'No encontrado' })
    }
})

//agregar producto

productsRouter.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body

    try {
        let prod = await productModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        })
        res.status(200).send({ result: "Success", message: prod })
    } catch (error) {
        res.status(400).send({
            result: 'Error create product', message: error.message
        })
    }
})

//actualizar producto

productsRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, description, price, thumbnail, code, stock, status, category } = req.body

    try {
        const product = await productModel.findByIdAndUpdate(id, {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        })

        if (!product) {
            return res.status(404).send({ result: 'Error', message: 'Product not found' })
        }
        res.status(200).send({ result: 'OK', message: 'Product updated' })
    } catch (error) {
        res.status(400).send({ result: 'Error updating product', message: error })
    }
})

//Eliminar producto

productsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const product = await productModel.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).send({ result: 'Error', message: 'Product not found' })
        }
        res.status(200).send({ result: 'Success', message: 'Product deleted', product })
    } catch (error) {
        res.status(400).send({ result: 'Error deleting product', message: error })
    }
})

export default productsRouter