// Redirigir al index si ya hay un token almacenado
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('auth_token'); // Verificar si el token está almacenado en localStorage

    if (token) {
        window.location.href = "index.html"; // Redirigir al index si ya está logueado
    }
});


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
document.getElementById("loginForm").addEventListener("submit", function(event) {
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
    fetch("http://25.61.101.23/api/login", {  // Cambia la URL a la de tu backend
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Login successful.") {
            // Almacenar el token en el localStorage o sessionStorage
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user_name', data.user.name);
            localStorage.setItem('user_id', data.user.id);

            // Si el usuario ha seleccionado 'Recordarme', puedes guardarlo por más tiempo
            if (remember) {
                localStorage.setItem('remember', 'true');
            }

            alert("¡Login exitoso!");

            // Realizar la solicitud para obtener el rol del usuario
            const userRoleData = {
                user_id: data.user.id
            };

            // Obtener el rol del usuario
            fetch("http://25.61.101.23/api/getrole", {  // Cambia la URL a la de tu API
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userRoleData)
            })
            .then(roleResponse => roleResponse.json())
            .then(roleData => {
                if (roleData.role_id === 1) {  // Verificar si es Administrador
                    // Si el rol es Administrador, redirigir al panel de administración
                    alert("Usted es ADMINISTRADOR: Será redirigido al Panel Administrativo");
                    window.location.href = "/panel_administrativo/index.html"; // Cambia la URL según sea necesario
                } else {
                    // Si no es administrador, redirigir al usuario normal
                    window.location.href = "/index.html"; // Cambia la URL según sea necesario
                }
            })
            .catch(error => {
                console.error("Error al obtener el rol del usuario:", error);
                alert("Hubo un problema al verificar el rol del usuario.");
            });
        } else {
            alert("Error: " + data.message);  // Mostrar mensaje de error
        }
    })
    .catch(error => {
        console.error("Error al iniciar sesión:", error);
        alert("Hubo un problema al iniciar sesión. Inténtelo de nuevo más tarde.");
    });
});
