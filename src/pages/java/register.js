document.addEventListener('DOMContentLoaded', function () {
    console.log('Página cargada correctamente');

    const API_URL = 'https://ecommerce-1-nwlj.onrender.com/api/Users/register';

    document.getElementById('register-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const btn = document.getElementById('register-btn');
        const errordiv = document.getElementById('register-error');
        const errorMsg = document.getElementById('register-error-message');
        errordiv.classList.add('hidden');

        // Campos del formulario (IDs corregidos)
        const Nombre = document.getElementById('nombre').value.trim();
        const Apellido = document.getElementById('apellido').value.trim();
        const Edad = document.getElementById('Edad').value.trim();
        const Gmail = document.getElementById('correo').value.trim();
        const Password = document.getElementById('password').value.trim();

        // Validación de campos obligatorios
        if (!Nombre || !Apellido || !Edad || !Gmail || !Password) {
            errorMsg.textContent = 'Por favor, complete todos los campos.';
            errordiv.classList.remove('hidden');
            return;
        }

        // Datos a enviar
        const datos = { Nombre, Apellido, Edad, Gmail, Password };

        btn.disabled = true;
        btn.textContent = 'Creando cuenta...';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (response.ok) {
                errordiv.className = 'bg-green-100 border-green-200 text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent = 'Usuario creado exitosamente. Redirigiendo al login...';
                errordiv.classList.remove('hidden');

                setTimeout(() => window.location.href = 'login.html', 3000);
            } else {
                errorMsg.textContent = resultado.message || 'Error al crear el usuario';
                errordiv.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = 'Crear Cuenta';
            }

        } catch (error) {
            console.error('Error al conectar con el servidor', error);
            errorMsg.textContent = 'Error de conexión con el servidor';
            errordiv.classList.remove('hidden');
            btn.disabled = false;
            btn.innerHTML = 'Crear Cuenta';
        }
    });
});
