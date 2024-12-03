document.addEventListener('DOMContentLoaded', function() {
    // Realizamos la llamada a la API para obtener los productos
    fetch('http://25.61.101.23/api/products')
        .then(response => response.json())  // Convertimos la respuesta a JSON
        .then(data => {
            // Filtramos los productos "rating"
            const rating = data.filter(product => product.rating == 5);

            // Tomamos solo los primeros 5 productos de  5 estrellas
            const productosDestacados = rating.slice(0, 4);

            // Ahora insertamos esos productos en el HTML (para la primera sección)
            const productosContainer1 = document.getElementById('seccion1');
            productosContainer1.innerHTML = ''; // Limpiamos el contenedor

            const row1 = document.createElement('div');
            row1.classList.add('row', 'd-flex', 'justify-content-start');
            
            productosDestacados.forEach(producto => {
                const col = document.createElement('div');
                col.classList.add('col-12', 'col-md-3', 'mb-3');
                col.innerHTML = `
                    <div class="product-card text-center p-3 border rounded" data-id="${producto.id}">
                        <img src="${producto.image}" alt="${producto.name}" class="img-fluid mb-3">
                        <h5 class="product-title text-short">${producto.name}</h5>
                        <div class="product-rating mb-2">${getRatingStars(producto.rating)}</div>
                        <p class="product-price fw-bold text-primary">${formatPrice(producto.price)}</p>
                    </div>
                `;
                col.querySelector('.product-card').addEventListener('click', function() {
                    window.location.href = `product.html?id=${producto.id}`;
                });
                row1.appendChild(col);
            });

            productosContainer1.appendChild(row1);

            // Filtramos los productos que son de la marca "Sterem"
            const productosSteren = data.filter(product => product.brand.toLowerCase() === 'steren');

            // Tomamos solo los primeros 5 productos de la marca "Bosch"
            const productosDestacadosSteren = productosSteren.slice(0, 4);

            // Ahora insertamos esos productos en el HTML (para la segunda sección)
            const productosContainer2 = document.getElementById('seccion2');
            productosContainer2.innerHTML = ''; // Limpiamos el contenedor

            const row2 = document.createElement('div');
            row2.classList.add('row', 'd-flex', 'justify-content-start');

            productosDestacadosSteren.forEach(producto => {
                const col = document.createElement('div');
                col.classList.add('col-12', 'col-md-3', 'mb-3');
                col.innerHTML = `
                    <div class="product-card text-center p-3 border rounded" data-id="${producto.id}">
                        <img src="${producto.image}" alt="${producto.name}" class="img-fluid mb-3">
                        <h5 class="product-title text-short">${producto.name}</h5>
                        <div class="product-rating mb-2">${getRatingStars(producto.rating)}</div>
                        <p class="product-price fw-bold text-primary">${formatPrice(producto.price)}</p>
                    </div>
                `;
                col.querySelector('.product-card').addEventListener('click', function() {
                    window.location.href = `product.html?id=${producto.id}`;
                });
                row2.appendChild(col);
            });

            productosContainer2.appendChild(row2);

            // Filtramos los productos que son de la marca "TP-Link"
            const productosTp = data.filter(product => product.brand.toLowerCase() === 'tp-link');

            // Tomamos solo los primeros 5 productos de la marca "TP-Link"
            const productosDestacadosTp = productosTp.slice(0, 4);

            // Ahora insertamos esos productos en el HTML (para la tercera sección)
            const productosContainer3 = document.getElementById('seccion3');
            productosContainer3.innerHTML = ''; // Limpiamos el contenedor

            const row3 = document.createElement('div');
            row3.classList.add('row', 'd-flex', 'justify-content-start');

            productosDestacadosTp.forEach(producto => {
                const col = document.createElement('div');
                col.classList.add('col-12', 'col-md-3', 'mb-3');
                col.innerHTML = `
                    <div class="product-card text-center p-3 border rounded" data-id="${producto.id}">
                        <img src="${producto.image}" alt="${producto.name}" class="img-fluid mb-3">
                        <h5 class="product-title text-short">${producto.name}</h5>
                        <div class="product-rating mb-2">${getRatingStars(producto.rating)}</div>
                        <p class="product-price fw-bold text-primary">${formatPrice(producto.price)}</p>
                    </div>
                `;
                col.querySelector('.product-card').addEventListener('click', function() {
                    window.location.href = `product.html?id=${producto.id}`;
                });
                row3.appendChild(col);
            });

            productosContainer3.appendChild(row3);

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

    // Función para formatear el precio en moneda mexicana
    function formatPrice(price) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(price);
    }
});
