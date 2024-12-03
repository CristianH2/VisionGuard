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
    const cartCount = document.getElementById("cart-count");

    // Obtener ID del producto desde la URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        document.body.innerHTML = "<p class='text-center text-danger'>Producto no encontrado.</p>";
        return;
    }

    try {
        // Llamar la API de scraping
        const scrapingResponse = await fetch("http://25.61.101.23/api/scrape");
        const scrapingData = await scrapingResponse.json();
        const scrapingProducts = scrapingData.data;
        
        // Cargar datos del producto API
        const response = await fetch("http://25.61.101.23/api/products");
        const products = await response.json();
        const product = products.find(p => p.id === parseInt(productId));

        if (!product) {
            document.body.innerHTML = "<p class='text-center text-danger'>Producto no encontrado.</p>";
            return;
        }

        // Convertir la cadena JSON de imágenes en un arreglo
        const images = JSON.parse(product.images);

        // Mostrar detalles del producto
        productTitle.textContent = product.name;
        productPrice.textContent = formatPrice(product.price);
        productDescription.innerHTML = product.description; // Usamos innerHTML para mostrar el HTML
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

        // Comparar los títulos de los productos de la API con los de la página y mostrar el mensaje si coinciden
        const scrapedProduct = scrapingProducts.find(sp => sp.title === product.name);
        if (scrapedProduct) {
            const priceMessage = `Precio más barato que en Steren.com: ${scrapedProduct.price}`;
            const priceMessageElement = document.createElement("p");
            priceMessageElement.classList.add("mt-3", "bg-primary", "text-center");
            priceMessageElement.style.fontWeight = "bold"; // Hacer el texto en negrita
            priceMessageElement.style.color = "white";
            priceMessageElement.textContent = priceMessage;
            productTitle.parentElement.appendChild(priceMessageElement);
        }

        // Mostrar miniaturas
        images.forEach(image => {
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
                    <p class="product-price fw-bold text-primary">${formatPrice(similarProduct.price)}</p>
                </div>
            </a>
        `;
            similarProducts.appendChild(card);
        });

        // Mostrar opiniones (simulación)
        reviews.innerHTML = ` 
            <p><strong>Valoración:</strong> ${renderStars(product.rating)}</p>
            <p>Aquí aparecerán las opiniones de los usuarios.</p>
        `;

        // Función para comprar directamente
        buyNowBtn.addEventListener("click", () => {
            let quantity = parseInt(quantityInput.value);

            // Validar cantidad antes de agregar al carrito
            if (quantity <= 0) {
                quantity = 1; // Si la cantidad es menor o igual a 0, se restablece a 1
                quantityInput.value = 1; // Restablecer el valor en el input
            }

            if (quantity > product.stock) {
                alert("No hay suficiente stock disponible.");
                return;
            }

            addToCartAPI(product, quantity);
            window.location.href = '/cart.html'; // Redirigir al carrito
        });

        // Función para agregar al carrito
        addToCartBtn.addEventListener("click", () => {
            let quantity = parseInt(quantityInput.value);

            // Validar cantidad antes de agregar al carrito
            if (quantity <= 0) {
                quantity = 1; // Si la cantidad es menor o igual a 0, se restablece a 1
                quantityInput.value = 1; // Restablecer el valor en el input
            }

            if (quantity > product.stock) {
                alert("No hay suficiente stock disponible.");
                return;
            }

            addToCartAPI(product, quantity);
        });

        // Función para agregar productos al carrito a través de la API
        async function addToCartAPI(product, quantity) {
            const token = localStorage.getItem("auth_token"); // Verificar si el token está almacenado en localStorage

            if (!token) {
                alert("No estás autenticado. Por favor, inicia sesión.");
                window.location.href = "/login.html"; // Redirigir a la página de login
                return;
            }

            const userId = localStorage.getItem('user_id');
            
            try {
                const response = await fetch("http://25.61.101.23/api/carro", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_usuario: userId,
                        id_producto: product.id,
                        num_productos: quantity,
                    }),
                });

                const data = await response.json();

                if (data.message === "Producto añadido al carrito") {
                    console.log("Producto añadido al carrito.");
                    updateCartCount(); // Actualizar el contador del carrito
                } else {
                    alert("Error al agregar el producto al carrito.");
                }
            } catch (error) {
                console.error("Error al agregar el producto al carrito:", error);
                alert("Hubo un problema al agregar el producto al carrito.");
            }
        }

        // Función para actualizar el contador de productos en el carrito
        async function updateCartCount() {
            const token = localStorage.getItem("auth_token");

            if (!token) return;

            const userId = localStorage.getItem('user_id');

            try {
                const response = await fetch(`http://25.61.101.23/api/carro/${userId}`);
                const cartItems = await response.json();
                const totalItems = cartItems.reduce((acc, item) => acc + item.num_productos, 0);

                cartCount.textContent = totalItems; // Actualizar el contador de productos en el carrito
            } catch (error) {
                console.error("Error al actualizar el contador del carrito:", error);
            }
        }

        // Actualizar contador de carrito al cargar la página
        updateCartCount();

        // Función para validar la cantidad en tiempo real
        quantityInput.addEventListener("input", () => {
            let quantity = parseInt(quantityInput.value);

            // Si la cantidad es menor que 1, se restablece a 1
            if (quantity < 1 || isNaN(quantity)) {
                quantityInput.value = 1;
            }
        });

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

    } catch (error) {
        console.error("Error al cargar el producto:", error);
        document.body.innerHTML = "<p class='text-center text-danger'>Error al cargar los datos del producto.</p>";
    }
});
