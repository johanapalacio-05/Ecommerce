import Productos from "../models/productos.js";

//crear el producto 
export const crearProducto= async (req, res)=> {
    try{
        const{productId,Nombre,Descripcion,Precio,imagen}=req.body;
        const newProduct=new Productos({
            productId,
            Nombre,
            Descripcion,
            Precio,
            imagen
        });
        await newProduct.save();
        res.status(201).json({message:"producto guardado con exito"});
    
    }catch (error){
        console.error("error al guardar el producto", error);
        res.status(400).json({message:"error al ingresar el producto"
        });

    }
};

//traer los datos de la base de datos 
export const obtenerProductos= async (req, res)=> {
    try {
        const Listarproductos = await Productos.find();
        res.json(Listarproductos);
    } catch (error){
        res.status(500).json({message:"error al obtener los productos"});
    }
};

