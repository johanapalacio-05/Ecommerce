// ============================================
// VERIFICAR CÓDIGO Y CAMBIAR CONTRASEÑA
// ============================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Script de verificación cargado correctamente');

    const form = document.querySelector('form');
    
    if (!form) {
        console.error('❌ No se encontró el formulario');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('✅ Formulario enviado');

        //Obtener los valores de los campos
        // const inputs = form.querySelectorAll('input');
        // const codigo = inputs[0].value.trim();
        // const nuevaPassword = inputs[1].value.trim();
        // const confirmarPassword = inputs[2].value.trim();
        
        const codigo = document.getElementById("codigo-verificacion").value.trim();
        const nuevaPassword = document.getElementById("nueva-password").value;
        const confirmarPassword = document.getElementById("Confirmar-password").value.trim();
        const btnSubmit = form.querySelector('button[type="submit"]');

        console.log('Datos capturados:', { codigo, nuevaPassword, confirmarPassword });

        // Validaciones
        if (!codigo || !nuevaPassword || !confirmarPassword) {
            alert("⚠️ Por favor completa todos los campos");
            return;
        }

        if (codigo.length !== 5 || !/^\d{5}$/.test(codigo)) {
            alert("⚠️ El código debe tener 5 dígitos numéricos");
            return;
        }

        if (nuevaPassword.length < 6) {
            alert("⚠️ La contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (nuevaPassword !== confirmarPassword) {
            alert("⚠️ Las contraseñas no coinciden");
            return;
        }

        // Recuperar el email del sessionStorage
        const Gmail = sessionStorage.getItem('GmailRecuperacion');
        
        if (!Gmail) {
            alert("⚠️ No se encontró el correo electrónico. Por favor solicita el código nuevamente.");
            window.location.href = './recuperar.html';
            return;
        }

        console.log('Email recuperado:', Gmail);

        // Deshabilitar el botón y mostrar loading
        const textoOriginal = btnSubmit.textContent;
        btnSubmit.textContent = "Cambiando contraseña...";
        btnSubmit.disabled = true;
        btnSubmit.style.opacity = '0.6';
        btnSubmit.style.cursor = 'not-allowed';

        try {
            console.log('🚀 Enviando petición al servidor...');
            
            const res = await fetch('https://ecommerce-1-nwlj.onrender.com/api/Recuperar/cambiar-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ 
                    Gmail,
                    codigo,
                    nuevaPassword
                })
            });

            const data = await res.json();
            console.log('Respuesta del servidor:', data);

            if (res.ok) {
                // ✅ TODO SALIÓ BIEN
                sessionStorage.removeItem('GmailRecuperacion');
                alert('✅ Contraseña cambiada exitosamente. Ahora puedes iniciar sesión.');
                
                // 🚀 REDIRIGIR AL LOGIN
                window.location.href = './login.html';
            } else {
                // ❌ Código incorrecto o error
                alert('❌ ' + (data.message || 'Código incorrecto o expirado'));
                btnSubmit.textContent = textoOriginal;
                btnSubmit.disabled = false;
                btnSubmit.style.opacity = '1';
                btnSubmit.style.cursor = 'pointer';
            }

        } catch (error) {
            console.error('❌ Error al verificar:', error);
            alert('❌ Error de conexión. Verifica que el servidor esté corriendo en http://localhost:8081');
            btnSubmit.textContent = textoOriginal;
            btnSubmit.disabled = false;
            btnSubmit.style.opacity = '1';
            btnSubmit.style.cursor = 'pointer';
        }
    });

    // Permitir enviar con Enter en cualquier campo
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                form.querySelector('button[type="submit"]').click();
            }
        });
    });

    console.log('✅ Event listeners configurados correctamente');
});
// Permitir enviar con Enter
document.getElementById('Gmail')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-enviar').click();
    }
});