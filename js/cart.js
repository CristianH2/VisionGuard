document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('auth_token'); // Verificar si el token está almacenado en localStorage

    // Si el token no existe o es inválido, redirigir al login
    if (!token) {
        alert("No estás autenticado. Redirigiendo al login...");
        window.location.href = "login.html"; // Redirigir a la página de login
    }

    // Obtener el ID del usuario desde el token (suponiendo que el token contiene el ID del usuario)
    function getUserIdFromToken(token) {
        // Decodificar el token (dependiendo de cómo esté estructurado el token)
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar JWT
        return payload.user_id; // Asegúrate de que el nombre del campo sea correcto
    }

    const userId = localStorage.getItem('user_id');
    

    // Función para formatear los precios
    function formatPrice(price) {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(price);
    }

    // Función para obtener el carrito desde la API
    function loadCartAPI() {
        fetch(`http://25.61.101.23/api/carro/${userId}`)
        .then(response => response.json())
        .then(cartItems => {
            // Cargar los productos en el carrito
            displayCartItems(cartItems);
        })
        .catch(error => console.error('Error al cargar el carrito:', error));
    }

    // Función para mostrar los productos en el carrito
    function displayCartItems(cartItems) {
        const cartItemsElement = document.getElementById("cart-items");
        const checkoutBtn = document.getElementById("checkout-btn");
        const totalPrice = document.getElementById("total-price");
        const modalTotalPrice = document.getElementById("modal-total-price");

        if (cartItems.message === "El carrito está vacío") {
            cartItemsElement.innerHTML =` 
                <div class="centrar">
                    <h3>Tu carrito está vacío</h3>
                    <p>¡Agrega productos a tu carrito para continuar con la compra!</p>
                    <img src="img/vacio.webp" alt="Carrito vacío" class="img-fluid" width="200">
                </div>
            `;
            checkoutBtn.disabled = true; // Deshabilitar botón de compra
        } else {
            let total = 0;
            cartItemsElement.innerHTML = ''; // Limpiar el contenido anterior

            cartItems.forEach(item => {
                const product = item.producto; // Producto relacionado con el carrito
                const itemHtml =`
                    <div class="cart-item d-flex justify-content-between align-items-center border-bottom py-3">
                        <!-- Columna de Imagen -->
                        <div class="col-2 d-flex justify-content-center">
                            <img src="${product.image}" alt="${product.name}" width="60" height="60" class="rounded">
                        </div>

                        <!-- Columna de Información del Producto -->
                        <div class="col-5">
                            <h5>${product.name}</h5>
                            <p>${item.num_productos} x ${formatPrice(product.price)}</p>
                            <p>Subtotal: ${formatPrice(item.num_productos * product.price)}</p>
                        </div>

                        <!-- Columna de Cantidad y Botones -->
                        <div class="col-3 d-flex justify-content-center align-items-center">
                            <div class="d-flex justify-content-end">
                                <button class="btn btn-warning btn-sm" onclick="decreaseQuantity(${item.id_producto})" style="background-color: #f4f4f4; border-color: #11929e;">-</button>
                                <input type="number" id="quantity-${item.id_producto}" value="${item.num_productos}" min="1" class="form-control w-25 mx-2 text-center" onchange="updateQuantity(${item.id_producto}, this.value)">
                                <button class="btn btn-warning btn-sm" onclick="increaseQuantity(${item.id_producto})" style="background-color: #f4f4f4; border-color: #11929e;">+</button>
                            </div>
                        </div>

                        <!-- Columna de Botón Eliminar -->
                        <div class="col-2 d-flex justify-content-center">
                            <button class="btn btn-danger btn-sm" onclick="removeItem(${item.id_producto})">Eliminar</button>
                        </div>
                    </div>
                `;
                cartItemsElement.innerHTML += itemHtml;
                total += product.price * item.num_productos;
            });

            totalPrice.innerText = formatPrice(total); // Actualizar total en la vista
            modalTotalPrice.innerText = formatPrice(total); // Actualizar total en el modal
            checkoutBtn.disabled = false; // Habilitar el botón de compra
        }
    }

    // Función para  aumentar la cantidad
    window.addToCartAPI = function(productId, quantity) {
        fetch(`http://25.61.101.23/api/carro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_usuario: userId,
                id_producto: productId,
                num_productos: 1
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Producto añadido al carrito') {
                console.log('Producto añadido correctamente');
                loadCartAPI(); // Actualizar el carrito después de agregar el producto
            } else {
                console.error('Error al añadir el producto al carrito');
            }
        })
        .catch(error => console.error('Error de red', error));
    };

    // Función para obtener el carrito y obtener el ID del carrito
    function getCartId(userId, productId) {
        return fetch(`http://25.61.101.23/api/carro/${userId}`)
            .then(response => response.json())
            .then(cartItems => {
                if (cartItems.length > 0) {
                    // Buscar el producto con el ID proporcionado
                    const item = cartItems.find(c => c.id_producto === productId);
                    if (item) {
                        // Si encontramos el producto, retornar el ID del carrito
                        return item.id; // Retornamos el ID del carrito (no del producto)
                    } else {
                        console.log("Producto no encontrado en el carrito.");
                        return null;
                    }
                } else {
                    console.log("El carrito está vacío.");
                    return null;
                }
            })
            .catch(error => {
                console.error('Error al obtener el carrito:', error);
                return null;
            });
    }

    // Función para disminuir la cantidad de un producto en el carrito
    window.decreaseQuantity = function(productId) {
        // Obtener el ID del carrito
        getCartId(userId, productId)
            .then(cartId => {
                if (cartId === null) {
                    alert("No hay productos en el carrito.");
                    return;
                }

                // Hacer la solicitud para obtener el carrito y los detalles del producto
                fetch(`http://25.61.101.23/api/carro/${userId}`)
                    .then(response => response.json())
                    .then(cartItems => {
                        const item = cartItems.find(c => c.id_producto === productId);
                        if (!item) {
                            alert("Producto no encontrado en el carrito.");
                            return;
                        }
                        const newQuantity = item.num_productos - 1;

                        // Si la cantidad es mayor que 0, actualizamos la cantidad
                        if (newQuantity > 0) {
                            fetch('http://25.61.101.23/api/carro/decrement-product', {
                                method: 'PUT', // Cambiar a PUT
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    id: cartId // Usar el ID del carrito obtenido
                                })
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.message === 'Producto removido con éxito') {
                                    console.log('Cantidad disminuida correctamente');
                                    loadCartAPI(); // Actualizar el carrito después de modificar la cantidad
                                }
                            })
                            .catch(error => console.error('Error de red', error));
                        } else {
                            // Si la cantidad llega a 0, eliminamos el producto
                            fetch(`http://25.61.101.23/api/carro`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    id_usuario: userId,
                                    id_producto: productId
                                })
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.message === 'Producto quitado del carrito') {
                                    console.log('Producto quitado del carrito');
                                    loadCartAPI();
                                }
                            })
                            .catch(error => console.error('Error de red', error));
                        }
                    })
                    .catch(error => console.error('Error al obtener los productos del carrito:', error));
            });
        
    };



    // Manejo cantidad de un producto
    window.increaseQuantity = function(productId) {
        // Obtener el carrito actual desde la API
        fetch(`http://25.61.101.23/api/carro/${userId}`, {
            method: 'GET',
            headers: {}
        })
        .then(response => response.json())
        .then(cartItems => {
            const item = cartItems.find(c => c.id_producto === productId);
            const stock = item.producto.stock;

            if (item.num_productos < stock) {
                addToCartAPI(productId, item.num_productos + 1); // Aumentar cantidad
            } else {
                alert("No hay suficiente stock para este producto.");
            }
        })
        .catch(error => console.error('Error al cargar el carrito:', error));
    };

    // Función para actualizar la cantidad de un producto
    window.updateQuantity = function(productId, quantity) {
        const parsedQuantity = parseInt(quantity);

        if (parsedQuantity < 1) {
            alert("Cantidad inválida. Debe ser al menos 1.");
            return;
        }

        // Actualizar cantidad en la base de datos
        addToCartAPI(productId, parsedQuantity);
    };

    // Función para eliminar un producto del carrito
    window.removeItem = function(productId) {
        fetch(`http://25.61.101.23/api/carro`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_usuario: userId,
                id_producto: productId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Producto quitado del carrito') {
                console.log('Producto eliminado correctamente');
                loadCartAPI(); // Actualizar el carrito después de eliminar el producto
            }
        })
        .catch(error => console.error('Error de red', error));
    };

    // Función para procesar la compra
    const checkoutBtn = document.getElementById("checkout-btn");
    checkoutBtn.addEventListener("click", function() {
        window.location.href = 'direccion.html';
    });

    // Cargar el carrito al inicio
    loadCartAPI();
});