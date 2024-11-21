
document.addEventListener("DOMContentLoaded", function () {
    const productGrid = document.getElementById("product-grid");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const brandFilter = document.getElementById("brand-filter");
    const priceFilter = document.getElementById("price-filter");
    const priceValue = document.getElementById("price-value");
    const colorFilter = document.getElementById("color-filter");
    const ratingFilter = document.getElementById("rating-filter");
    const sortPrice = document.getElementById("sort-price");


    // Simulación de productos obtenidos desde la base de datos
    const products = [
        { id: 1, name: "Cámara HD", category: "Cámaras", brand: "Marca 1", price: 1999.00, color: "Negro", rating: 4.5, image: "img/sinImagen-2.jpg" },
        { id: 2, name: "Cámara Full HD", category: "Cámaras", brand: "Marca 2", price: 2999.00, color: "Blanco", rating: 5, image: "img/sinImagen-2.jpg" },
        { id: 3, name: "DVR Básico", category: "Grabadores", brand: "Marca 1", price: 1500.00, color: "Negro", rating: 3.5, image: "img/sinImagen-2.jpg" },
        { id: 4, name: "DVR Avanzado", category: "Grabadores", brand: "Marca 2", price: 3500.00, color: "Blanco", rating: 4, image: "img/sinImagen-2.jpg" },
        { id: 5, name: "Kit de Cámaras", category: "Cámaras", brand: "Marca 3", price: 4999.00, color: "Azul", rating: 5.5, image: "img/sinImagen-2.jpg" },
        { id: 6, name: "Cable Coaxial", category: "Accesorios", brand: "Marca 1", price: 250.00, color: "Negro", rating: 2, image: "img/sinImagen-2.jpg" },
        { id: 7, name: "Conector BNC", category: "Accesorios", brand: "Marca 2", price: 100.00, color: "Blanco", rating: 3.5, image: "img/sinImagen-2.jpg" },
        { id: 8, name: "Fuente de Poder 12V", category: "Accesorios", brand: "Marca 3", price: 600.00, color: "Negro", rating: 4, image: "img/sinImagen-2.jpg" },
        { id: 9, name: "Cámara 4K", category: "Cámaras", brand: "Marca 1", price: 4000.00, color: "Negro", rating: 5.5, image: "img/sinImagen-2.jpg" },
        { id: 10, name: "DVR Profesional", category: "Grabadores", brand: "Marca 3", price: 7500.00, color: "Azul", rating: 5, image: "img/sinImagen-2.jpg" },
        { id: 11, name: "Cámara IP", category: "Cámaras", brand: "Marca 2", price: 2500.00, color: "Blanco", rating: 4, image: "img/sinImagen-2.jpg" },
        { id: 12, name: "Kit de Instalación", category: "Accesorios", brand: "Marca 1", price: 500.00, color: "Azul", rating: 3, image: "img/sinImagen-2.jpg" },
        { id: 13, name: "Cámara Interior", category: "Cámaras", brand: "Marca 3", price: 1500.00, color: "Blanco", rating: 2.5, image: "img/sinImagen-2.jpg" },
        { id: 14, name: "Sensor de Movimiento", category: "Accesorios", brand: "Marca 2", price: 1200.00, color: "Negro", rating: 4, image: "img/sinImagen-2.jpg" },
        { id: 15, name: "Cámara Térmica", category: "Cámaras", brand: "Marca 1", price: 15000.00, color: "Negro", rating: 5.5, image: "img/sinImagen-2.jpg" },
        { id: 16, name: "DVR Compacto", category: "Grabadores", brand: "Marca 3", price: 2500.00, color: "Azul", rating: 3, image: "img/sinImagen-2.jpg" },
        { id: 17, name: "Lente de Zoom", category: "Accesorios", brand: "Marca 1", price: 800.00, color: "Blanco", rating: 4.5, image: "img/sinImagen-2.jpg" },
        { id: 18, name: "Cable HDMI", category: "Accesorios", brand: "Marca 2", price: 150.00, color: "Negro", rating: 2.5, image: "img/sinImagen-2.jpg" },
        { id: 19, name: "Cámara Exterior", category: "Cámaras", brand: "Marca 3", price: 3200.00, color: "Negro", rating: 4.5, image: "img/sinImagen-2.jpg" },
        { id: 20, name: "Sistema DVR Completo", category: "Grabadores", brand: "Marca 1", price: 10000.00, color: "Blanco", rating: 5, image: "img/sinImagen-2.jpg" }
    ];
    let filteredProducts = [...products]; // Copia inicial para manipulación

    // Renderizar productos
    function renderProducts(productsToRender) {
        productGrid.innerHTML = ""; // Limpiar productos existentes
        productsToRender.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("col-md-4", "mb-4");
            productCard.innerHTML = `
                <div class="product-card text-center p-3 border rounded">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid mb-3">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-description text-muted">${product.category} - ${product.brand}</p>
                    <div class="product-rating mb-2">
                        ${renderStars(product.rating)}
                    </div>
                    <p class="product-price fw-bold text-primary">$${product.price.toFixed(2)}</p>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // Generar estrellas dinámicamente
    function renderStars(rating) {
        let starsHTML = "";
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                starsHTML += `<i class="bi bi-star-fill"></i>`; // Estrella llena
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                starsHTML += `<i class="bi bi-star-half"></i>`; // Estrella a la mitad
            } else {
                starsHTML += `<i class="bi bi-star"></i>`; // Estrella vacía
            }
        }
        return starsHTML;
    }

    // Filtros dinámicos
    function updateSelectedFilter(filterGroup) {
        const items = filterGroup.querySelectorAll(".list-group-item");
        items.forEach(item => {
            item.addEventListener("click", () => {
                item.classList.toggle("selected");
                applyFilters();
            });
        });
    }

    function applyFilters() {
        let filtered = [...products];

        // Filtro por categoría
        const selectedCategories = Array.from(categoryFilter.querySelectorAll(".selected"))
            .map(item => item.dataset.category);
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => selectedCategories.includes(product.category));
        }

        // Filtro por marca
        const selectedBrands = Array.from(brandFilter.querySelectorAll(".selected"))
            .map(item => item.dataset.brand);
        if (selectedBrands.length > 0) {
            filtered = filtered.filter(product => selectedBrands.includes(product.brand));
        }

        // Filtro por precio
        const maxPrice = parseInt(priceFilter.value, 10);
        priceValue.textContent = `$${maxPrice}`;
        filtered = filtered.filter(product => product.price <= maxPrice);

        // Filtro por color
        const selectedColors = Array.from(colorFilter.querySelectorAll(".selected"))
            .map(item => item.dataset.color);
        if (selectedColors.length > 0) {
            filtered = filtered.filter(product => selectedColors.includes(product.color));
        }

        // Filtro por estrellas
        const selectedRatings = Array.from(ratingFilter.querySelectorAll(".selected"))
            .map(item => parseInt(item.dataset.rating, 10));
        if (selectedRatings.length > 0) {
            filtered = filtered.filter(product => {
                return selectedRatings.some(rating => product.rating >= rating);
            });
        }

        // Filtro por búsqueda
        const query = searchInput.value.trim().toLowerCase();
        if (query !== "") {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                product.brand.toLowerCase().includes(query)
            );
        }

        // Ordenar productos
        const sortOrder = sortPrice.value;
        if (sortOrder === "asc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "desc") {
            filtered.sort((a, b) => b.price - a.price);
        }

        // Renderizar productos filtrados
        renderProducts(filtered);

        if (filtered.length === 0) {
            productGrid.innerHTML = "<p class='text-center'>No se encontraron productos.</p>";
        }

    }
        
    // Event listeners
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Evitar recargar la página
        applyFilters();
    });

    priceFilter.addEventListener("input", applyFilters);
    sortPrice.addEventListener("change", applyFilters);

    // Inicializar los filtros dinámicos
    updateSelectedFilter(categoryFilter);
    updateSelectedFilter(brandFilter);
    updateSelectedFilter(colorFilter);
    updateSelectedFilter(ratingFilter);

    // Renderizar productos iniciales
    renderProducts(products);
});
/*
    // Búsqueda por Nombre, Categoría o Marca
     searchForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Evitar recargar la página
        const query = searchInput.value.trim().toLowerCase(); // Obtener texto de búsqueda

        // Filtrar productos que coincidan con la búsqueda
        const searchedProducts = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query)
        );

        //Renderizar resultados
        renderProducts(searchedProducts);

        // Mostrar mensaje si no hay resultados
        if (searchedProducts.length === 0) {
            productGrid.innerHTML = "<p class='text-center'>No se encontraron productos.</p>";
        }
    });

    // Inicialización
    renderProducts(products);
    updateSelectedFilter(categoryFilter);
    updateSelectedFilter(brandFilter);
    updateSelectedFilter(colorFilter);
    updateSelectedFilter(ratingFilter);

    priceFilter.addEventListener("input", applyFilters);
    sortPrice.addEventListener("change", applyFilters);
});*/