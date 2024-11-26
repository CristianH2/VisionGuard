
document.addEventListener("DOMContentLoaded", function () {
    const productGrid = document.getElementById("product-grid");
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const brandFilter = document.getElementById("brand-filter");
    const priceFilter = document.getElementById("price-filter");
    const priceValue = document.getElementById("price-value");
    const colorFilter = document.getElementById("color-filter");
    const ratingFilter = document.getElementById("rating-filter");
    const sortPrice = document.getElementById("sort-price");

    // Variables globales
    let products = [];
    let filteredProducts = [];

    // Leer el parámetro 'busca' de la URL
    const urlParam = window.location.search;
    console.log(urlParam);

    // Creamos una instancia de URLSeacrhParams
    const parametrosURL = new URLSearchParams(urlParam);
    console.log(parametrosURL);

    // Recorriendo todos los parámetros de la URL
    for (let valoresURL of parametrosURL){
        console.log(valoresURL);
    }

    // Obteniendo los valores
    var busca = parametrosURL.get('busca');
    console.info('Peoducto buscado: '+ busca);

    // Verificar sis existe un parámetro en la URL
    let valorURL = parametrosURL.has('busca');
    console.log(valorURL);

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
            const response = await fetch("json/products.json"); // Ruta al archivo JSON
            products = await response.json();
            filteredProducts = [...products];

            if (busca) {
                applyFilters(); // Filtrar productos según búsqueda inicial
            } else {
                renderProducts(products); // Mostrar todos los productos inicialmente
            }
        } catch (error) {
            console.error("Error al cargar productos:", error);
            productGrid.innerHTML = "<p class='text-center text-danger'>Error al cargar los productos.</p>";
        }
    }
    
    // Renderizar productos
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
                        searchInput.value = busca = "";
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

        if ( !selectedCategories.includes("Todos") && (busca !== "") && (valorURL == true)) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(busca) ||
                product.category.toLowerCase().includes(busca) ||
                product.brand.toLowerCase().includes(busca)
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

    // Cargar productos al inicializar
    loadProducts();

    priceFilter.addEventListener("input", applyFilters);
    sortPrice.addEventListener("change", applyFilters);

    // Inicializar los filtros dinámicos
    updateSelectedFilter(categoryFilter);
    updateSelectedFilter(brandFilter);
    updateSelectedFilter(colorFilter);
    updateSelectedFilter(ratingFilter);

    // Renderizar productos iniciales
    if (valorURL == true) {
        applyFilters(); // Mostrar sólo productos aplicados a un filtro
    } else {
        renderProducts(products); // Mostrar todos los productos si no hay búsqueda
    }    

    // Configurar valor inicial del input de búsqueda
    searchInput.value = busca;
});