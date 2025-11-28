//importamos el modelo de la base de datos
import Users from '../models/User.js';

//obtener perfil del usuario de la base de datos

export const obtenerPerfil=async (req, res)=>{
    try {
        const {Gmail} = req.body;
        if(!Gmail){
            return res.status(400).json({message:"Email es requerido"})
        }

        //traer el correo del usuario
        const usuario=await User.findOne({Gmail : Gmail}).select('-Password');
        if(!usuario){
            return res.status(400).json({message:"usuario no encontrado"})
        }
        
        res.status(200).json({
            usuario:{
                id: usuario._id,
                Nombre: usuario.Nombre,
                Apellido: usuario.Apellido,
                Gmail: usuario.Gmail,
                Telefono: usuario.Telefono
            }
        })
    } catch (error) {
        res.status(500).json({
            message:"error al obtener el perfil", error:error.message 
            });
    }
}


//actualizar perfil de usuario
export const actualizarperfil = async (req, res) => {
    try{
        const{Gmail, Nombre, Apellido, Telefono, Edad} = req.body;

        //validar campos obligatorios
        if (!Gmail) {
            return res.status(400).json ({message: "Gmail es requerido"});
        }

        if (!Nombre || !Apellido || !Telefono){
            return res.status(400).json({message: "todos los campos son requeridos"});
        }

        if (!Edad){
            return res.status(400).json({message: "campo requerido"});
        }

        //buscar y actualizar usuario
        const usuarioActualizado = await Users.findOneAndUpdate(
            {Gmail: Gmail},
            {
                Nombre: Nombre,
                Apellido: Apellido,
                Telefono: Telefono,
                Edad: Edad
            },
            {new: true}
            //no va seleccionar el campo passwords
        ).select('-password');

        if(!usuarioActualizado) {
            return res.status(404).json({message: "usuario no encontrado"});
        }
        res.status(200).json({
            message: "perfil actualizado exitosamente",
            usuario:{
                id: usuarioActualizado._id,
                Nombre: usuarioActualizado.Nombre,
                Apellido: usuarioActualizado.Apellido,
                Gmail: usuarioActualizado.Gmail,
                Telefono: usuarioActualizado.Telefono,
                Edad: usuarioActualizado.Edad
            }
        });
    }catch (error) {
        res.status(500).json({
            message: "error al actualizar perfil",
            error: error.message
        });

    }
};


//eliminar perfil
export const eliminarperfil = async(req, res) => {
    try{
        const{Gmail} =req.body;

        //validar que el email este presente
        if(!Gmail){
            return res.status(400).json({message: "Gmail es requerido"});
        }

        //buscar y eliminar usuario
        const usuarioEliminado = await User.findOneAndDelete({
            Gmail: Gmail
        });

        if (!usuarioEliminado) {
            return res.status(404).json({message:"usuario no encontrado"});
        }

        res.status(200).json({
            message: "usuario eliminado exitosamente",
            usuario:{
                id: usuarioEliminado._id,
                Nombre: usuarioEliminado.Nombre,
                Apellido: usuarioEliminado.Apellido,
                Gmail: usuarioEliminado.Gmail,
                Telefono: usuarioEliminado.Telefono,
                Edad: usuarioEliminado.Edad
            }
        });
    }catch(error) {
        res.status(500).json({
            message:"error al eliminar perfil",
            error:error.message 
        });
    }
};

