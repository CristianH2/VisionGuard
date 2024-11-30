document.addEventListener("DOMContentLoaded", function () {
    const productGrid = document.getElementById("product-grid");
    const searchInput = document.getElementById("search-input");
    const priceValue = document.getElementById("price-value");
    const sortPrice = document.getElementById("sort-price");

    // Filtros de precio, categoría, marca, color y estrellas
    const priceFilter = document.getElementById("price-filter");
    const categoryFilter = document.getElementById("category-filter");
    const brandFilter = document.getElementById("brand-filter");
    const colorFilter = document.getElementById("color-filter");
    const ratingFilter = document.getElementById("rating-filter");

    // Variables globales
    let products = [];
    let filteredProducts = [];

    // Leer el parámetro de la URL
    const urlParam = window.location.search;
    console.log(urlParam);

    // Creamos una instancia de URLSearchParams
    const parametrosURL = new URLSearchParams(urlParam);
    console.log(parametrosURL);

    // Obteniendo los valores
    var buscaOP = parametrosURL.get('busca');
    var categoriaOP = parametrosURL.get('categoria');
    var marcaOP = parametrosURL.get('marca');
    var estrellasOP = parametrosURL.get('estrellas');

    // Filtros existentes en la URL
    let buscaValorURL = parametrosURL.has('busca');
    let categoriaValorURL = parametrosURL.has('categoria');
    let marcaValorURL = parametrosURL.has('marca');
    let estrellasValorURL = parametrosURL.has('estrellas');

    // Función para asignar formato de moneda
    function formatPrice(price) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(price);
    }

    // Función para cargar productos desde un archivo JSON
    async function loadProducts() {
        try {
            const response = await fetch("http://localhost:3000/api/productos"); // URL de tu API REST
            if (!response.ok) {
                throw new Error('Error al obtener productos');
            }
            products = await response.json(); // Los productos ahora provienen de la API
            filteredProducts = [...products];

            // Aplicar filtros iniciales si se encuentran parámetros en la URL
            if (buscaOP) {
                applyFilters(); // Filtrar productos según búsqueda inicial
            } else {
                renderProducts(products); // Mostrar todos los productos inicialmente
            }

            // Actualizar filtros según los parámetros de la URL
            updateCategoryFilter();  // Actualizar filtro de categorías
            updateRatingFilter();    // Actualizar filtro de calificación
            updateBrandFilter();  // Actualizamos las marcas seleccionadas

            // Aplicar los filtros después de marcar las opciones automáticamente
            applyFilters();
        } catch (error) {
            console.error("Error al cargar productos:", error);
            productGrid.innerHTML = "<p class='text-center text-danger'>Error al cargar los productos.</p>";
        }
    }

    // Función para renderizar productos
    function renderProducts(productsToRender) {
        productGrid.innerHTML = ""; // Limpiar productos existentes
        productsToRender.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("col-md-4", "mb-4");
            productCard.innerHTML = `
            <a href="product.html?id=${product.id}" class="text-decoration-none text-dark">
                <div class="product-card text-center p-3 border rounded">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid mb-3">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-description text-muted">${product.category} - ${product.brand}</p>
                    <div class="product-rating mb-2">
                        ${renderStars(product.rating)}
                    </div>
                    <p class="product-price fw-bold text-primary">${formatPrice(product.price)}</p>
                </div>
            </a>
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

    //Actualizar filtros
    function updateSelectedFilter(filterGroup) {
        const items = filterGroup.querySelectorAll(".list-group-item");
        items.forEach(item => {
            item.addEventListener("click", () => {
                if (filterGroup.id === "category-filter") {
                    // Manejo especial para categorías
                    if (item.dataset.category === "Todos") {
                        // Si selecciona "Todos", desmarcar otras categorías
                        items.forEach(i => i.classList.remove("selected"));
                        item.classList.add("selected");
                        searchInput.value = buscaOP = "";
                    } else {
                        // Si selecciona otra categoría, desmarcar "Todos"
                        const allItem = Array.from(items).find(i => i.dataset.category === "Todos");
                        allItem.classList.remove("selected");
                        item.classList.toggle("selected");
                    }
                } else {
                    // Para otros filtros (marca, color, calificación), solo alternar selección
                    item.classList.toggle("selected");
                }
                applyFilters(); // Aplicar filtros después de cada selección
            });
        });
    }

    // Función para aplicar filtros (ya existe en tu código)
    function applyFilters() {
        let filtered = [...products];

        // Filtro por categoría
        const selectedCategories = Array.from(categoryFilter.querySelectorAll(".selected"))
            .map(item => item.dataset.category);

        if (selectedCategories.includes("Todos") || selectedCategories.length === 0) {
            // No aplicar filtro de categorías si "Todos" está seleccionado o no hay ninguna categoría seleccionada
        } else {
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
        priceValue.textContent = `${formatPrice(maxPrice)}`;
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

        if ( !selectedCategories.includes("Todos") && (buscaOP !== "") && (buscaValorURL == true)) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(buscaOP) ||
                product.category.toLowerCase().includes(buscaOP) ||
                product.brand.toLowerCase().includes(buscaOP)
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

    // Actualizar el filtro de categoría para marcar la categoría seleccionada desde la URL
    function updateCategoryFilter() {
        const categoryItems = categoryFilter.querySelectorAll(".list-group-item");
        categoryItems.forEach(item => {
            if (item.dataset.category === categoriaOP) {
                item.classList.add("selected");
            }
        });
    }

    // Actualizar el filtro de estrellas para marcar las estrellas seleccionadas desde la URL
    function updateRatingFilter() {
        const ratingItems = ratingFilter.querySelectorAll(".list-group-item");
        ratingItems.forEach(item => {
            if (item.dataset.rating === estrellasOP) {
                item.classList.add("selected");
            }
        });
    }

    // Actualizar el filtro de marca para marcar la marca seleccionada desde la URL
    function updateBrandFilter() {
        const brandItems = brandFilter.querySelectorAll(".list-group-item");
        brandItems.forEach(item => {
            if (item.dataset.brand === marcaOP) {
                item.classList.add("selected");
            }
        });
    }

    // Cargar productos al inicializar
    loadProducts();

    priceFilter.addEventListener("input", applyFilters);
    sortPrice.addEventListener("change", applyFilters);

    // Inicializar los filtros dinámicos
    updateSelectedFilter(categoryFilter);
    updateSelectedFilter(brandFilter);
    updateSelectedFilter(colorFilter);
    updateSelectedFilter(ratingFilter);

    // Configurar valor inicial del input de búsqueda
    searchInput.value = buscaOP;
});
