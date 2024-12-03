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

// Función para cargar los productos desde el API
window.addEventListener('load', function() {
    loadProducts(); // Cargar productos cuando la página se carga

    // Escuchar eventos de búsqueda
    document.getElementById('searchProduct').addEventListener('input', function() {
        searchProduct();
    });
});

// Función para cargar todos los productos
function loadProducts() {
    fetch('http://25.61.101.23/api/products')
        .then(response => response.json())
        .then(products => {
            const productTableBody = document.getElementById('productTableBody');
            productTableBody.innerHTML = ''; // Limpiar la tabla antes de cargar los productos

            products.forEach(product => {
                const row = document.createElement('tr');

                // Formatear el precio a formato moneda
                const formattedPrice = new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                }).format(product.price); // Formato de moneda mexicano, ajusta según sea necesario

                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${formattedPrice}</td>
                    <td>${product.stock}</td>
                    <td>
                        <a href="edit-product.html?id=${product.id}" class="btn btn-secondary btn-sm">Editar</a>
                        <button class="btn btn-danger btn-sm red" onclick="deleteProduct(${product.id})">Eliminar</button>
                    </td>
                `;

                productTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

// Función para eliminar un producto
function deleteProduct(productId) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        fetch(`http://25.61.101.23/api/products/${productId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert('Producto eliminado Correctamente');
                loadProducts(); // Recargar la lista de productos después de eliminar uno
            } else {
                alert('Error al eliminar el producto');
            }
        })
        .catch(error => console.error('Error al eliminar el producto:', error));
    }
}

// Función de búsqueda de productos
function searchProduct() {
    const searchQuery = document.getElementById('searchProduct').value.toLowerCase();

    const rows = document.querySelectorAll('#productTableBody tr');
    rows.forEach(row => {
        const productName = row.cells[1].textContent.toLowerCase();
        const productCategory = row.cells[2]?.textContent?.toLowerCase() || ''; // En caso de que no haya una categoría visible
        const productBrand = row.cells[3]?.textContent?.toLowerCase() || '';  // En caso de que no haya una marca visible
        const productPrice = row.cells[4]?.textContent?.toLowerCase() || ''; // En caso de que no haya precio visible

        if (
            productName.includes(searchQuery) ||
            productCategory.includes(searchQuery) ||
            productBrand.includes(searchQuery) ||
            productPrice.includes(searchQuery)
        ) {
            row.style.display = ''; // Mostrar la fila si coincide con la búsqueda
        } else {
            row.style.display = 'none'; // Ocultar la fila si no coincide
        }
    });
}
