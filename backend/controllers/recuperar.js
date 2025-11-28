import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Users from "../models/User.js";

const transporte = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user:'johanapalacio763@gmail.com',
        pass: 'ayihlmgzawhrezqs'
    }
});
//funcion de generar codigo de 6 digitos

const generarCodigo=()=>{
    return Math.floor(10000 + Math.random()*90000).toString();
};

//solicitar codigo de recuperacion
export const solicitarCodigo = async (req, res) => {
    try{
        const {Gmail} = req.body;

        if(!Gmail){
            return res.status(400).json({
                message: "El Gmail es obligatorio"
            });
        }
        //buscar usuario
        const usuario = await Users.findOne ({Gmail});

        if(!usuario){
            return res.status(400).json({
                message: "Gmail no encontrado"
            });
        }

        //generar codigo de 6 digitos
        const codigo = generarCodigo();

        //guardar codigo con expiracion de 15 minutos
        usuario.codigoRecuperacion = codigo;
        usuario.codigoExpiracion = Date.now() + 900000;
        await usuario.save();
    


const mailOptions = {
    from: 'johanapalacio763@gmail.com',
    to: usuario.Gmail,
    subject: 'codigo de Recuperacion - TechStore Pro',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #4F46E5; margin: 0; ">TechStore Pro</h2>
            </div>

            <h3 style="color: #333;">Recuperación de Contraseña</h3>

            <p>Hola <strong>${usuario.Nombre}</strong>,</p>

            <p>Recibimos una solicitud para restablecer tu contraseña.</p>

            <p>Tu código de verificación es:</p>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                        margin: 30px 0;">
                <h1 style="color: black;
                        font-size: 36px;
                        letter-spacing: 8px;
                        margin: 0;
                        font-family: monospace; ">
                    ${codigo}
                </h1>
            </div>

            <p style="color: %666; font-size: 14px; ">
               ⏱️ Este código expirará en <strong>15 minutos</strong>.
            </p>

            <p style="color: #666; font-size: 14px;">
                🔒 Si no solicitaste este cambio, ignora este email y tu contraseña permanecerá segura
            </p>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd; "></hr>

            <p style="color: #999; font-size: 12px; text-align: center;">
                © 2025 TechStore Pro - Tu tienda de tecnología de confianza
            </p>
        </div>
`
};

//enviar Gmail
await transporte.sendMail(mailOptions);

console.log(`codigo enviado a ${usuario.Gmail}: ${codigo}`);

res.status(200).json({
    message: "si el correo existe, recibiras un codigo de verificacion",
});

}catch (error){
    console.error("error al enviar codigo:", error);
    res.status(500).json({
        message: "error al procesar la solicitud",
        error: error.message
    });
}
};

//verificar codigo y cambiar contraseña
export const cambiarPassword = async(req, res) =>{
    try{
        const{Gmail, codigo, nuevaPassword} = req.body;

        //validaciones
        if(!Gmail || !codigo || !nuevaPassword){
            return res.status(400).json({
                message: "todos los campos son obligatorios"
            });
        }

        if(nuevaPassword.length <6) {
            return res.status(400).json({
                message: "la contraseña debe tener al menos 6 caracteres"
            });
        }
        // Buscar usuario
        const usuario = await Users.findOne({ 
            Correo_Electronico,
            codigoRecuperacion: codigo,
            codigoExpiracion: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({ 
                message: "Código inválido o expirado" 
            });
        }
                //encriptar nueva contraseña
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

                //actualizar contraseña y limpiar codigo
                usuario.passwords = hashedPassword;
                usuario.codigoRecuperacion = undefined;
                usuario.codigoExpiracion = undefined;
                await usuario.save();

            //email de confirmacion
            const mailOptions = {
                from:'johanapalacio763@gmail.com',
                to: usuario.Gmail,
                subject: 'contraseña actualizada - TechStore Pro',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding:20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style= "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                        width: 60px;
                                        height: 60px;
                                        border-radius:50%;
                                        display: inline-flex;
                                        align-items: center;
                                        justify-content: center;
                                        margin-bottom: 20px;">
                                <span style="color: white; font-size: 30px;">☑️</span
                            </div>
                            <h2 style="color:#4F46E5; margin: 0;">contraseña actualizada</h2>
                        </div>

                        <p>Hola<strong>${usuario.Nombre}</strong>,</p>

                        <p>Tu contraseña ha sido actualizada exitosamente.</p>

                        <p>Ya puedes iniciar sesion con tu nueva contraseña </p>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://127.0.0.1:5500/src/pages/login.html">
                            style="background: linear-gradient(to right, #4F46E5, #7C3AED);
                                    color: white;
                                    padding:12px 30px;
                                    text-decoration: none;
                                    border-radius: 8px;
                                    display: inline-block;">
                                iniciar sesion
                            </a>
                        </div>

                        <p style="color: #dc2626; font-size: 14px">
                            ⚠️ si no realizaste este cambio, contacta a soporte inmediatamente
                        </p>

                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;"></hr>

                        <p style="color: #999; font-size: 12px; text-align: center;">
                          © 2025 TechStore Pro - tu tienda de tecnologia de confianza
                        </p>
                    </div>
                    `
            };

        await transporte.sendMail(mailOptions);
            res.status(200).json({
                message: "contraseña actualizada exitosamente"
            });
        }catch (error){
            console.error("error al cambiar contraseña: ", error);
            res.status(500).json({
                message:"error al cambiar la contraseña",
                error: error.message
            });
        }
    };
    