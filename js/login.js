(function () {
    'use strict'

    // Obtener todos los formularios a los que queremos aplicar estilos de validación de Bootstrap personalizados
    var forms = document.querySelectorAll('.needs-validation')

    // Bucle sobre ellos y evitar la presentación si el formulario no es válido
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

// Manejo del formulario de login
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir que el formulario se envíe de manera tradicional

    // Obtener los valores del formulario
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const remember = document.getElementById("remember").checked;

    // Validación de los campos (esto es redundante si la validación de HTML5 está activada)
    if (!email || !password) {
        alert("Por favor complete todos los campos.");
        return;
    }

    const data = {
        email: email,
        password: password
    };

    // Enviar solicitud POST al backend para login
    fetch("http://localhost:8000/api/login", {  // Cambia la URL a la de tu backend
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Almacenar el token en el localStorage o sessionStorage
            localStorage.setItem('auth_token', data.token);

            // Si el usuario ha seleccionado 'Recordarme', puedes guardarlo por más tiempo
            if (remember) {
                localStorage.setItem('remember', 'true');
            }

            alert("¡Login exitoso!");

            // Redirigir al dashboard o la página protegida
            window.location.href = "dashboard.html";  // Ajusta la URL según corresponda
        } else {
            alert("Error: " + data.message);  // Mostrar mensaje de error
        }
    })
    .catch(error => {
        console.error("Error al iniciar sesión:", error);
        alert("Hubo un problema al iniciar sesión. Inténtelo de nuevo más tarde.");
    });
});
