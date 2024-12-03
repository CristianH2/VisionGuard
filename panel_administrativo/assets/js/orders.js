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

let allOrders = [];

// Función para cargar los pedidos desde el archivo JSON
async function loadOrders() {
    try {
        const response = await fetch('http://25.61.101.23/api/admin/pedidos'); // Ruta al archivo JSON
        const data = await response.json();
        allOrders = data.pedidos;
        
        // Mostrar todos los pedidos inicialmente
        displayOrders(allOrders);
    } catch (error) {
        console.error('Error al cargar los pedidos:', error);
    }
    
    
}

// Función para mostrar los pedidos en la tabla
function displayOrders(orders) {
    const tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    orders.forEach(order => {
        // Convertir total a número y formatear a 2 decimales con separador de miles
        const total = parseFloat(order.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Formato en pesos mexicanos
        
        // Crear una nueva fila con los datos del pedido
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id_pedido}</td>
            <td>$${total} MXN</td>
            <td>${order.usuario.id}</td>
            <td>${order.usuario.name}</td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row); // Agregar la fila a la tabla
    });
}

// Función para buscar y filtrar los pedidos
function searchOrder() {
    const searchValue = document.getElementById('searchOrder').value.toLowerCase(); // Valor de búsqueda en minúsculas
    const filteredOrders = allOrders.filter(order => {
        // Convertir el id del pedido y el nombre del usuario a minúsculas para comparar
        const orderId = order.id_pedido.toString().toLowerCase();
        const userName = order.usuario.name.toLowerCase();

        // Verificar si el valor de búsqueda está presente en el id o en el nombre del usuario
        return orderId.includes(searchValue) || userName.includes(searchValue);
    });

    displayOrders(filteredOrders); // Mostrar los pedidos filtrados
}


// Cargar los pedidos al cargar la página
window.onload = loadOrders;