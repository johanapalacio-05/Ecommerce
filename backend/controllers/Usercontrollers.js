import Users from "../models/User.js"; 
import bcrypt from "bcrypt";

//creacion de los usuarios
export const registerUser = async (req, res)=>{
    console.log("➡ BODY RECIBIDO:", req.body);
    try {
        const {Nombre, Apellido, Gmail, Edad, Password} = req.body;
       
        //validar que no falte ningun campo
        if (!Nombre || !Apellido || !Gmail || !Edad || !Password) {
            return res.status(400).json({message:"todos los campos son obligatorios"});
        }
        //validar si el usuario ya existe
        const existeUsers=await Users.findOne({Gmail});
        if(existeUsers){
            return res.status(400).json({message:"usuario ya esta registrado"});
        }

        //encriptar la contraseña
        const saltRounds=10;
        const hashedPassword=await bcrypt.hash(Password, saltRounds);

        //crear el usuario en la base de datos 
        const nuevoUsuario=new Users({ Nombre, Apellido, Gmail, Edad, Password:hashedPassword});
        await nuevoUsuario.save();
        res.status(201).json({message:"usuario registrado con exito"});

    } catch (error) {
        console.error("❌ ERROR REGISTER:", error);
        res.status(500).json({message:"error al registrar el usuario", error:error.message});
    }
};

