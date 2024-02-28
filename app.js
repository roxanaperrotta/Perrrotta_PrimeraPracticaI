import express from "express";
import path from "path";
//import productsRouter from "./src/dao/fs/products.router.js";
import productsRouter from "./src/routes/products.router.js";
//import cartsRouter from "./src/dao/fs/carts.router.js";
import cartsRouter from "./src/routes/carts.router.js";
import viewsRouter from "../Primera_PracticaI/src/routes/views.router.js"
import cors from 'cors';
import {Server} from "socket.io";
import handlebars from 'express-handlebars';
import {fileURLToPath} from "url";
import {dirname} from "path";
import {ProductManager} from "./src/managers/ProductManager.js";
import mongoose from "mongoose";
import chatRouter from "./src/routes/chat.router.js";
import { chatModel } from "./src/dao/mongoose/model/chat.model.js";


const PORT= 8080;
const app=express();

const __fileName =  fileURLToPath (import.meta.url);
const __dirnombre = dirname(__fileName);
const productManager =  new ProductManager ();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join (__dirnombre, '/src/public')));

app.use("/api/products", productsRouter);

app.use("/api/carts", cartsRouter);

app.use("/api/chat", chatRouter)



//Configuración para handlebars

app.engine("handlebars", handlebars.engine());
app.set("views", __dirnombre + '/src/views');
app.set ("view engine", "handlebars")


app.use ('/', viewsRouter);
app.use ('/realtimeproducts', viewsRouter)


const httpServer = app.listen(PORT, () =>  console.log (`Server running on PORT ${PORT}`));


//Conexión con DB

mongoose.connect("mongodb+srv://roxanatperrotta:fOSUduUrKwVoG6yq@cluster0.bdtnqky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log('Conexión exitosa a la base de datos')
    })
    .catch((error) => {
        console.error('Error conectándose a la base de datos:', error)
    })
   


//Conexión con socket.io

const socketServer = new Server (httpServer);

socketServer.on('connection', (socket) => {
    console.log('Usuario conectado')

    socket.on('message', async (data) => {
        try {
            await chatModel.create({ email: data.email, message: data.message })
            const messages = await chatModel.find()
            socketServer.emit('messageLogs', messages)
        } catch (error) {
            console.error('Error de escritura en la base de datos')
        }
    })

    socket.on('updateMessages', async () => {
      
        const messages = await chatModel.find()
        socketServer.emit('messageLogs', messages)
        socket.broadcast.emit('newUserConnected')
    })


socketServer.on("connection" , (socket) =>{
    console.log ("Nueva conexión");
    socket.on("mensaje", data =>{
      console.log("mensaje", data)});


    try {
        const products = productManager.getProducts();
        socketServer.emit("products", products);

    } catch (error) {
        socketServer.emit('response', { status: 'error', message: error.message });
    }
   
})
     socket.on("new-Product",   (newProduct) => {
        
        try {

           // Validate price
if (typeof newProduct.price !== 'number') {
    console.error('Price must be a number');
    // Handle the error accordingly
}

// Validate stock
if (typeof newProduct.stock !== 'number') {
    console.error('Stock must be a number');
    // Handle the error accordingly
}
                
            
            const productoNuevo = {
                  
                    title: newProduct.title,
                    description: newProduct.description,
                    code: newProduct.code,
                    price: newProduct.price,
                    stock: newProduct.stock,
                    thumbnail: newProduct.thumbnail,
    
            }
            

            const pushProduct =   productManager.addProduct(productoNuevo);
            const listaActualizada =   productManager.getProducts();
            socketServer.emit("products", listaActualizada);
            socketServer.emit("response", { status: 'success' , message: pushProduct});

        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })
  


    socket.on("delete-product", (id) => {
        try {
            const pid = parseInt(id)
            const deleteProduct =  productManager.deleteProduct(pid)
            const listaActualizada =  productManager.getProducts()
            socketServer.emit("products", listaActualizada)
            socketServer.emit('response', { status: 'success' , message: "producto eliminado correctamente"});
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    } )

})