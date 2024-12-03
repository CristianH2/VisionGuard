// Redirigir al index si ya hay un token almacenado
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('auth_token'); // Verificar si el token está almacenado en localStorage

    if (token) {
        window.location.href = "index.html"; // Redirigir al index si ya está logueado
    }
});

document.getElementById("registerForm").addEventListener("submit", function(event) {
    // Prevenir envío del formulario hasta validación
    event.preventDefault();

    // Obtener valores de las contraseñas
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden. Por favor, verifique.");
        return;
    }

    // Si las contraseñas coinciden, proceder con el envío al backend
    const formData = new FormData(document.getElementById("registerForm"));
    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        password_confirmation: formData.get("confirmPassword"), // Confirmación de la contraseña
    };

    // Enviar datos al backend usando fetch
    fetch("http://25.61.101.23/api/register", {  // Cambia la URL a tu API
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        // Manejo de la respuesta del servidor
        if (data.message === "User registered successfully.") {
            alert("¡Registro exitoso!");
            // Almacenar el token en localStorage
            window.location.href = "login.html";  // Redirigir al login
        } else {
            alert("Error: " + data.message);  // Mostrar mensaje de error
        }
    })
    .catch(error => {
        console.error("Error al registrar:", error);
        alert("Hubo un problema al registrar. Inténtelo de nuevo más tarde.");
    });
});

