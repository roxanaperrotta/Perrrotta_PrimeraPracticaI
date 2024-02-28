import express from "express";


const router = express.Router();

import ProductManager from "../../managers/ProductManager.js"

const productManager = new ProductManager;

router.get("/", async (req, res)=>{

    const data=  await productManager.getProducts() 
    
    const limite = parseInt(req.query.limit);
  
    const products = limite ? data.slice(0,limite) : data
   
      res.json(products);       
   
})

router.get('/:pid',  async (req, res)=>{
    
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId)
    res.json(product);
    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
    });

router.post('/', async (req, res) => {

        try {
            const {title, description, price, code} = req.body;
            const productoNuevo = await productManager.addProduct(title, description, price, code);
            
            if (!productoNuevo) {
                res.status(500).json({ error: "Error al crear el producto" });
                return;
            }
    
            res.json(productoNuevo);

        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    
router.put("/:pid", async(req, res)=>{
    try{
        const id= parseInt(req.params.pid);
        const updatedFields= req.body;
        const productoActualizado= await productManager.updateProduct(id, updatedFields );
        res.json(productoActualizado)
    }
    catch(error){
    res.status(500).json({error: error.message});
    }
})

router.delete('/:pid', async (req, res)=>{
    try {
        const id= parseInt(req.params.pid);
        const productoBorrado= await productManager.deleteProduct(id)
        res.json(productoBorrado);

    } catch (error) {
        res.status(500).json({error: error.message})
    };
});


export default router
