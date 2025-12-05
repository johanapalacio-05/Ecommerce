import express from 'express';
import cors from 'cors';
import "./db/db.js"
import productRoutes from './routes/productos.js'
import UsersRoutes from "./routes/User.js"
import {loginUser} from "./controllers/login.js";
import PerfilRouter from "./routes/perfil.js";
import recuperarpassword from './routes/recuperacion.js'
import pedidosRoutes from './routes/pedidos.js';




const app =express();
app.use(express.json());


//habilitar todas las rutas
app.use(cors());

//primera ruta
app.get('/',(req,res) => {
    res.send('Bienvenido al curso de Node express');
});

app.use("/api/productos",productRoutes);
app.use("/api/Users", UsersRoutes);
app.use("/api/login",loginUser);
app.use("/api/perfil", PerfilRouter);
app.use("/api/Recuperar", recuperarpassword);
app.use("/api/pedidos",pedidosRoutes );



app.listen(8081,()=> console.log("Servidor corriendo en http://localhost:8081"));  



