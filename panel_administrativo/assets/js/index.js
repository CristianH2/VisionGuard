document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('auth_token'); // Verificar si el token está almacenado en localStorage

    if (!token) {
        // Si no hay token, redirigir al login
        window.location.href = "/login.html";
        return;
    }

    // Si el token existe, se verifica el rol del usuario
    fetch("http://25.61.101.23/api/getrole", { // URL del endpoint que verifica el rol
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: localStorage.getItem('user_id') // Enviar el ID del usuario almacenado
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.role_id === 2) {  // El role_id 2 es "Usuario"
            // Si no es administrador, redirigir a la vista estándar de usuario
            window.location.href = "/index.html"; 
        }
    })
    .catch(error => {
        console.error("Error al verificar el rol del usuario:", error);
        alert("Hubo un problema al verificar el rol del usuario. Inténtalo de nuevo más tarde.");
    });
});