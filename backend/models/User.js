import mongoose from "mongoose"
const UsersShema =new mongoose.Schema({

    Nombre:{type:String,required:true},
    Apellido:{type:String,required:true},
    Gmail:{type:String,required:true},
    Edad:{type:Number,required:true}, 
    Password:{type:String,required:true},

    codigoRecuperacion: {type: String},
    codigoExpiracion: {type: Date}
});


//forzamos que guarde en user  
const Users=mongoose.model("Users",UsersShema,"Users")

export default Users;

