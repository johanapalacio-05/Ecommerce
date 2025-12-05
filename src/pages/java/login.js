document.addEventListener("DOMContentLoaded", function() {
    console.log('✅ Página cargada correcta - sistema listo');

    // ⭐ NUEVO: Verificar si ya hay sesión al cargar login
    const sesionActiva = localStorage.getItem("sesionActiva");
    const usuario = localStorage.getItem("usuario");
    
    console.log('🔍 Verificando sesión existente:');
    console.log('- sesionActiva:', sesionActiva);
    console.log('- usuario:', usuario);
    
    if (sesionActiva === "true" && usuario) {
        console.log('⚠️ Ya hay sesión activa, redirigiendo a productos...');
        window.location.href = 'productos(1).html';
        return;
    }

    const API_URL = "http://localhost:8081/api/login";

    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn = document.getElementById("login-btn");
        const errordiv = document.getElementById("login-error");
        const errorMsg = document.getElementById("login-error-message");

        errordiv.classList.add('hidden'); 

        const datos = {
            Gmail: document.getElementById('Gmail').value.trim(),
            Password: document.getElementById('Password').value
        };

        if (!datos.Gmail || !datos.Password) {
            errorMsg.textContent = "Por favor complete los datos requeridos";
            errordiv.classList.remove('hidden');
            return;
        }

        btn.disabled = true;
        btn.textContent = "Iniciando sesión...";

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
            console.log('📤 Enviando credenciales al servidor...');
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
                signal: controller.signal
            });

            clearTimeout(timeout);

            console.log('📥 Respuesta recibida:', response.status);
            
            const resultado = await response.json();
            console.log('📦 Datos del servidor:', resultado);

            if (response.ok) {
                console.log('✅ 200 - Inicio de sesión exitoso');

                // Guardar información 
                localStorage.setItem("sesionActiva", "true");
                localStorage.setItem("usuario", JSON.stringify({
                    id: resultado.usuario.id,
                    Nombre: resultado.usuario.Nombre,
                    Apellido: resultado.usuario.Apellido,
                    Gmail: resultado.usuario.Gmail,
                    Telefono: resultado.usuario.Telefono
                }));

                console.log('💾 Datos guardados en localStorage:');
                console.log('- sesionActiva:', localStorage.getItem("sesionActiva"));
                console.log('- usuario:', localStorage.getItem("usuario"));

                // Mensaje de éxito
                errordiv.className = 'bg-green-100 border-green-200 text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent = "Inicio de sesión exitoso, redireccionando...";
                errordiv.classList.remove('hidden');

                // Redirigir a productos
                console.log('⏳ Esperando 2 segundos antes de redirigir...');
                setTimeout(() => {
                    console.log('🔄 Redirigiendo a productos(1).html...');
                    window.location.href = 'productos(1).html';
                }, 2000); 

            } else {
                console.log('❌ Error en login:', resultado.message);
                errorMsg.textContent = resultado.message || 'Credenciales incorrectas';
                errordiv.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Iniciar sesión';
            }

        } catch (error) {
            clearTimeout(timeout);
            console.error('❌ Error en la petición:', error);

            if (error.name === 'AbortError') {
                errorMsg.textContent = 'Tiempo de espera agotado. Intente nuevamente';
            } else {
                errorMsg.textContent = 'Error de conexión con el servidor';
            }

            errordiv.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Iniciar sesión';
        }
    });
});