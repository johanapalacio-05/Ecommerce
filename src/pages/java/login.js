document.addEventListener("DOMContentLoaded", function() {
    console.log('✅ pagina cargada correcta - sistema listo');

    //creamos la constante de la Api
    const API_URL = "http://localhost:8081/api/login";

    //enviar los datos del formulario
    document.getElementById('login-form').addEventListener ('submit', async function (e){
        e.preventDefault();

        //preparamos los elementos de la pagina 
        const btn = document.getElementById("login-btn");
        const errordiv = document.getElementById("login-error");
        const errorMsg = document.getElementById("login-error-message");

        errordiv.classList.add('hidden'); 

        //recoger los campos del formulario 
        const datos={
            Gmail: document.getElementById('Gmail').value.trim(),
            Password: document.getElementById('Password').value
        };

        //validamos que los campos no esten vacios
        if(!datos.Gmail || !datos.Password){
            errorMsg.textContent="por favor complete los datos requeridos";
            errordiv.classList.remove('hidden');
            return;
        }

        //cambia el boton mientras procesa
        btn.disabled=true;
        btn.textContent="Iniciando sesion...";

        // enviamos los datos al servidor
        try {
            const response = await fetch(API_URL,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(datos)
            });
            // recibir respuesta del servidor 
            const resultado = await response.json();

            if (response.ok){
                console.log('✅ 201- inicio de sesion exitoso');

                // guardar informacion 
                localStorage.setItem("sesionActiva", "true");
                localStorage.setItem("usuario",JSON.stringify({
                    id: resultado.usuario.id,
                    Nombre: resultado.usuario.Nombre,
                    Apellido: resultado.usuario.Apellido,
                    Gmail: resultado.usuario.Gmail,
                    Telefono: resultado.usuario.Telefono
                }));

                // mensaje de exito
                errordiv.className='bg-green-100 border-green-200  text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent="inicio de sesion exitoso, redireccionando...";
                errordiv.classList.remove('hidden');

                // redirigir a productos
                setTimeout(()=>window.location.href='productos(1).html',2000); 

                // credenciales incorrectas
            } else {
                errordiv.textContent=resultado.message || 'credenciales incorrectas';
                errordiv.classList.remove('hidden');
                btn.disabled=false;
                btn.innerHTML='iniciar sesion';
            }

            // si no hay conexion al servidor
        } catch (error) {
            clearTimeout(timeout);

            if (error.name==='abortError'){
                errorMsg.textContent='tiempo de espera agotado. intente nuevamente';
            } else{
                errorMsg.textContent='error de conexion con el servidor';
            }

            errordiv.classList.remove('hidden');
            btn.disabled=false;
            btn.textContent='iniciar sesion';
        }
    });
});