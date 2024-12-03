document.addEventListener('DOMContentLoaded', function() {
    const authLink = document.getElementById('authLink');
    
    // Verificar si el token existe en el localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token) {
         // Si el token existe, el usuario está autenticado
         const userName = localStorage.getItem('user_name');  // Obtener el nombre del usuario

        // Cambiar el texto del enlace a "Cerrar sesión (Nombre)"
        authLink.href = "javascript:void(0)";  // Evitar redirigir a login
        authLink.innerHTML = `<i class="bi bi-person-circle"></i> Cerrar Sesión (${userName})`;
        
        // Añadir un evento para manejar el cierre de sesión
        authLink.addEventListener('click', function() {
            // Eliminar el token del localStorage (logout)
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_id');
            
            // Redirigir al login
            window.location.href = '/login.html';  // O la URL que corresponda para el logout
        });
    } else {
        // Si no hay token, el usuario no está autenticado
        authLink.href = "login.html";  // Redirigir al login
        authLink.innerHTML = '<i class="bi bi-person-circle"></i> Iniciar Sesión';
    }
});
