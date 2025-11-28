import bcrypt from "bcrypt";
import User from "../models/User.js";

export const loginUser= async (req, res)=>{
    try{
        const {Gmail, Password}=req.body;
        //validamos los campos presentes
        if(!Gmail || !Password){
            return res.status(400).json({message:"Gmail y contraseña obligatorias"});
        }
        //buscamos el usuario en la base de datos
        const usuario= await User.findOne({Gmail});
        if(!usuario){
            return res.status(404).json({message:"usuario no encontrado"});
        }
        //comparamos la contraseña encryptada en la base de datos
        const Passwordvalida= await bcrypt.compare(Password, usuario.Password)
        if(!Passwordvalida){
            return res.status(401).json({message:"contraseña incorrecta"});
        }
        //validamos el inicio de sesion exitoso
        res.status(200).json({message:"Inicio de sesion correcto",
        usuario:{
        id: usuario._id,
        Nombre: usuario.Nombre,
        Apellido: usuario.Apellido,
        Gmail: usuario.Gmail,
        Telefono: usuario.Telefono
        }
    
});

    }catch (error){
        res.status(500).json({message:"error al iniciar sesion", error:error.message})

    }
}
