document.addEventListener("DOMContentLoaded", async function () {
    // Referencias a elementos del DOM
    const productTitle = document.getElementById("product-title");
    const productPrice = document.getElementById("product-price");
    const productDescription = document.getElementById("product-description");
    const productStock = document.getElementById("product-stock");
    const productShippingTime = document.getElementById("product-shipping-time");
    const productCategory = document.getElementById("product-category");
    const productName = document.getElementById("product-name");
    const productMainImage = document.getElementById("product-main-image");
    const productThumbnails = document.getElementById("product-thumbnails");
    const buyNowBtn = document.getElementById("buy-now-btn");
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    const quantityInput = document.getElementById("quantity");
    const similarProducts = document.getElementById("similar-products");
    const reviews = document.getElementById("reviews");

    // Obtener ID del producto desde la URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        document.body.innerHTML = "<p class='text-center text-danger'>Producto no encontrado.</p>";
        return;
    }

    try {
        // Cargar datos del producto desde JSON
        const response = await fetch("json/products.json");
        const products = await response.json();
        const product = products.find(p => p.id === parseInt(productId));

        if (!product) {
            document.body.innerHTML = "<p class='text-center text-danger'>Producto no encontrado.</p>";
            return;
        }

        // Mostrar detalles del producto
        productTitle.textContent = product.name;
        productPrice.textContent = formatPrice(product.price);
        productDescription.textContent = product.description;
        productCategory.textContent = product.category;
        productName.textContent = product.name;
        productMainImage.src = product.image;
        productMainImage.alt = product.name;

        // Verificar stock
        if (product.stock > 0) {
            productStock.textContent = `${product.stock} disponibles`;
            productShippingTime.textContent = "3-5 días hábiles";

            // Habilitar botones y campo de cantidad
            buyNowBtn.disabled = false;
            addToCartBtn.disabled = false;
            quantityInput.disabled = false;
        } else {
            productStock.textContent = "Sin stock disponible";
            productShippingTime.textContent = "No disponible";

            // Deshabilitar botones y campo de cantidad
            buyNowBtn.disabled = true;
            addToCartBtn.disabled = true;
            quantityInput.disabled = true;

            // Aplicar clase visual para indicar deshabilitado (opcional)
            buyNowBtn.classList.add("disabled");
            addToCartBtn.classList.add("disabled");
        }

        // Mostrar miniaturas
        product.images.forEach(image => {
            const thumbnail = document.createElement("img");
            thumbnail.src = image;
            thumbnail.alt = product.name;
            thumbnail.classList.add("img-thumbnail", "me-2");
            thumbnail.style.cursor = "pointer";
            thumbnail.addEventListener("click", () => {
                productMainImage.src = image;
            });
            productThumbnails.appendChild(thumbnail);
        });

        // Cargar productos similares
        const similar = products.filter(p => p.category === product.category && p.id !== product.id);
        similar.forEach(similarProduct => {
            const card = document.createElement("div");
            card.classList.add("col-md-3", "mb-4");
            card.innerHTML = `
            <a href="product.html?id=${similarProduct.id}" class="text-decoration-none text-dark">
                <div class="product-card text-center p-3 border rounded">
                    <img src="${similarProduct.image}" alt="${similarProduct.name}" class="img-fluid mb-3">
                    <h5 class="product-title">${similarProduct.name}</h5>
                    <p class="product-description text-muted">${similarProduct.category} - ${similarProduct.brand}</p>
                    <div class="product-rating mb-2">
                        ${renderStars(similarProduct.rating)}
                    </div>
                    <p class="product-price fw-bold text-primary">${formatPrice(product.price)}</p>
                </div>
            </a>
        `;
            // card.innerHTML = `
            //     <a href="product.html?id=${similarProduct.id}" class="text-decoration-none text-dark">
            //         <div class="product-card text-center p-3 border rounded">
            //             <img src="${similarProduct.image}" alt="${similarProduct.name}" class="img-fluid mb-3">
            //             <h6 class="product-title">${similarProduct.name}</h6>
            //             <p class="product-price text-primary">${formatPrice(similarProduct.price)}</p>
            //         </div>
            //     </a>
            // `;
            similarProducts.appendChild(card);
        });

        // Mostrar opiniones (simulación)
        reviews.innerHTML = `
            <p><strong>Valoración:</strong> ${renderStars(product.rating)}</p>
            <p>Aquí aparecerán las opiniones de los usuarios.</p>
        `;
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        document.body.innerHTML = "<p class='text-center text-danger'>Error al cargar los datos del producto.</p>";
    }

    // Formatear precios
    function formatPrice(price) {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(price);
    }

    // Generar estrellas para la valoración
    function renderStars(rating) {
        let starsHTML = "";
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                starsHTML += `<i class="bi bi-star-fill text-warning"></i>`;
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                starsHTML += `<i class="bi bi-star-half text-warning"></i>`;
            } else {
                starsHTML += `<i class="bi bi-star text-muted"></i>`;
            }
        }
        return starsHTML;
    }
});
