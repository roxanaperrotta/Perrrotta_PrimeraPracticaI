import express from 'express';
import ProductManager from '../managers/ProductManager.js' ;


const router = express.Router();
const productManager = new ProductManager();



router.get ('/', (req, res) => {
    const products = productManager.getProducts();
    res.render ('home', {products});
});

router.get ('/realtimeproducts', (req, res)=>{
    const products = productManager.getProducts();
    res.render('realTimeProducts', {products});
})


export default router