document.addEventListener("DOMContentLoaded", function () {
    // Obtener los productos desde el archivo JSON
    fetch('json/products.json')
        .then(response => response.json())
        .then(products => {
            // Cargar el carrito desde localStorage
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Elementos del DOM
            const cartItems = document.getElementById("cart-items");
            const checkoutBtn = document.getElementById("checkout-btn");
            const totalPrice = document.getElementById("total-price");
            const modalTotalPrice = document.getElementById("modal-total-price");

            // Función para formatear los precios
            function formatPrice(price) {
                return new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                }).format(price);
            }

            // Si el carrito está vacío, mostrar mensaje y deshabilitar el botón de compra
            if (cart.length === 0) {
                cartItems.innerHTML = ""; // Vaciar la lista de productos
                cartItems.innerHTML = `
                    <div class="centrar">
                        <h3>Tu carrito está vacío</h3>
                        <p>¡Agrega productos a tu carrito para continuar con la compra!</p>
                        <img src="img/vacio.webp" alt="Carrito vacío" class="img-fluid" width="200">
                    </div>
                `;

                checkoutBtn.disabled = true; // Deshabilitar botón de compra
            } else {
                // Si hay productos en el carrito, mostrar los productos
                let total = 0;
                cartItems.innerHTML = ''; // Limpiar el contenido anterior

                cart.forEach(item => {
                    const product = products.find(p => p.id === item.id); // Obtener el producto desde el JSON
                    let itemHtml = `
                        <div class="cart-item d-flex justify-content-between align-items-center border-bottom py-3">
                            <!-- Columna de Imagen -->
                            <div class="col-2 d-flex justify-content-center">
                                <img src="${product.image}" alt="${product.name}" width="60" height="60" class="rounded">
                            </div>

                            <!-- Columna de Información del Producto -->
                            <div class="col-5">
                                <h5>${product.name}</h5>
                                <p>${item.quantity} x ${formatPrice(product.price)}</p>
                                <p>Subtotal: ${formatPrice(item.quantity * product.price)}</p>
                            </div>

                            <!-- Columna de Cantidad y Botones -->
                            <div class="col-3 d-flex justify-content-center align-items-center">
                                <div class="d-flex justify-content-end">
                                    <button class="btn btn-warning btn-sm" onclick="decreaseQuantity(${item.id})" style="background-color: #f4f4f4; border-color: #11929e;">-</button>
                                    <input type="number" id="quantity-${item.id}" value="${item.quantity}" min="1" class="form-control w-25 mx-2 text-center" onchange="updateQuantity(${item.id}, this.value)">
                                    <button class="btn btn-warning btn-sm" onclick="increaseQuantity(${item.id})" style="background-color: #f4f4f4; border-color: #11929e;">+</button>
                                </div>
                            </div>

                            <!-- Columna de Botón Eliminar -->
                            <div class="col-2 d-flex justify-content-center">
                                <button class="btn btn-danger btn-sm" onclick="removeItem(${item.id})">Eliminar</button>
                            </div>
                        </div>
                    `;
                    cartItems.innerHTML += itemHtml;
                    total += product.price * item.quantity;
                });

                totalPrice.innerText = formatPrice(total); // Actualizar total en la vista
                modalTotalPrice.innerText = formatPrice(total); // Actualizar total en el modal
                checkoutBtn.disabled = false; // Habilitar el botón de compra
            }

            // Función para eliminar un producto del carrito
            window.removeItem = function(id) {
                // Filtrar los productos que no sean el seleccionado
                cart = cart.filter(item => item.id !== id);
                localStorage.setItem("cart", JSON.stringify(cart)); // Actualizar el carrito en localStorage
                location.reload(); // Recargar la página para actualizar la vista
            };

            // Función para disminuir la cantidad de un producto
            window.decreaseQuantity = function(id) {
                const product = cart.find(item => item.id === id);
                if (product && product.quantity > 1) {
                    product.quantity -= 1; // Reducir la cantidad
                    localStorage.setItem("cart", JSON.stringify(cart)); // Actualizar carrito en localStorage
                    location.reload(); // Recargar la página para actualizar la vista
                }
            };

            // Función para aumentar la cantidad de un producto
            window.increaseQuantity = function(id) {
                const product = cart.find(item => item.id === id);
                const stock = products.find(p => p.id === id).stock; // Obtener stock desde JSON

                // Verificar si hay stock suficiente para aumentar la cantidad
                if (product && product.quantity < stock) {
                    product.quantity += 1; // Aumentar la cantidad
                    localStorage.setItem("cart", JSON.stringify(cart)); // Actualizar carrito en localStorage
                    location.reload(); // Recargar la página para actualizar la vista
                } else {
                    alert("No hay suficiente stock para este producto."); // Avisar si no hay suficiente stock
                }
            };

            // Función para actualizar la cantidad de un producto
            window.updateQuantity = function(id, quantity) {
                const product = cart.find(item => item.id === id);
                const parsedQuantity = parseInt(quantity);
                const stock = products.find(p => p.id === id).stock;

                // Validar que la cantidad no sea menor a 1 o mayor al stock disponible
                if (product && parsedQuantity >= 1 && parsedQuantity <= stock) {
                    product.quantity = parsedQuantity;
                    localStorage.setItem("cart", JSON.stringify(cart)); // Actualizar carrito en localStorage
                    location.reload(); // Recargar la página para actualizar la vista
                } else {
                    alert("Cantidad inválida. Asegúrate de no exceder el stock disponible."); // Mostrar mensaje si la cantidad es inválida
                }
            };

            // Función para proceder a la compra
            checkoutBtn.addEventListener("click", function() {
                window.location.href = "direccion.html"; // Redirigir a la página de dirección
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
});
