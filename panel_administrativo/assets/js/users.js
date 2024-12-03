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

let allUsers = [];

// Función para cargar los usuarios desde el archivo JSON
async function loadUsers() {
    try {
        const response = await fetch('http://25.61.101.23/api/admin/users'); // Ruta al archivo JSON
        const data = await response.json();
        allUsers = data.users;
        
        // Mostrar todos los usuarios inicialmente
        displayUsers(allUsers);
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
    }
}

// Función para mostrar los usuarios en la tabla
function displayUsers(users) {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
            <td>${user.role_name}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para filtrar los usuarios según la búsqueda
function filterUsers() {
    const query = document.getElementById('searchUser').value.toLowerCase();
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
    );
    displayUsers(filteredUsers); // Mostrar los usuarios filtrados
}

// Cargar los usuarios al cargar la página
window.onload = loadUsers;
