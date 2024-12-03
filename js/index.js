document.addEventListener('DOMContentLoaded', function() {
    // Realizamos la llamada a la API para obtener los productos
    fetch('http://25.61.101.23/api/products')
        .then(response => response.json())  // Convertimos la respuesta a JSON
        .then(data => {
            // Filtramos los productos que son de la categoría "Cámara"
            const camaras = data.filter(product => product.category.toLowerCase() === 'cámara');

            // Tomamos solo los primeros 5 productos de la categoría "Cámara"
            const productosDestacados = camaras.slice(0, 5);

            // Ahora insertamos esos productos en el HTML
            const productosContainer = document.getElementById('seccion1'); // Elemento contenedor de los productos

            // Limpiamos el contenedor antes de agregar nuevos productos
            productosContainer.innerHTML = '';

            // Creamos una fila para los productos
            const row = document.createElement('div');
            row.classList.add('row', 'd-flex', 'justify-content-start'); // Aseguramos que los productos estén en una fila

            // Creamos las columnas para cada producto
            productosDestacados.forEach(producto => {
                const col = document.createElement('div');
                col.classList.add('col-12', 'col-md-3', 'mb-3'); // Usamos col-12 para móviles y col-md-4 para pantallas medianas en adelante
                col.innerHTML = `
                    <div class="product-card text-center p-3 border rounded">
                        <!-- Imagen -->
                        <img src="${producto.image}" alt="${producto.name}" class="img-fluid mb-3">
                        
                        <!-- Título -->
                        <h5 class="product-title">${producto.name}</h5>
                        
                        <!-- Descripción -->
                        <p class="product-description text-muted">
                            ${producto.description}
                        </p>
                        
                        <!-- Estrellas -->
                        <div class="product-rating mb-2">
                            ${getRatingStars(producto.rating)}
                        </div>
                        
                        <!-- Precio -->
                        <p class="product-price fw-bold text-primary">$${producto.price}</p>
                    </div>
                `;
                row.appendChild(col);
            });

            // Añadimos la fila de productos al contenedor
            productosContainer.appendChild(row);
        })
        .catch(error => console.error('Error al obtener los productos:', error));

    // Función para generar las estrellas de acuerdo a la calificación
    function getRatingStars(rating) {
        const numStars = Math.round(parseFloat(rating)); // Redondeamos la calificación
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < numStars) {
                stars += `<i class="bi bi-star-fill text-warning"></i>`; // Estrella llena
            } else {
                stars += `<i class="bi bi-star text-secondary"></i>`; // Estrella vacía
            }
        }
        return stars;
    }
});

