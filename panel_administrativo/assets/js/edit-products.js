// Obtener el ID del producto (puedes pasarlo desde la URL o de otra forma)
const productId = new URLSearchParams(window.location.search).get("id");

if (productId) {
    // Realizamos una solicitud para obtener los datos del producto
    fetch(`http://localhost:8000/api/products/${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.product) {
                const product = data.product;

                // Rellenar el formulario con los datos del producto
                document.getElementById("productName").value = product.name;
                document.getElementById("productCategory").value = product.category;
                document.getElementById("productBrand").value = product.brand;
                document.getElementById("productModel").value = product.model;
                document.getElementById("productPrice").value = product.price;
                document.getElementById("productDescription").value = product.description;
                document.getElementById("productStock").value = product.stock;
                document.getElementById("productColor").value = product.color;
                document.getElementById("productRating").value = product.rating;

                // Obtener el nombre de la carpeta indirectamente de la imagen principal
                const folderName = product.image.split('/')[1];
                document.getElementById("productFolderName").value = folderName;

                // Rellenar las imágenes previas
                const productImages = JSON.parse(product.images); // Parseamos la cadena JSON
                const previewContainer = document.getElementById('productImagesPreview');
                previewContainer.innerHTML = '';

                productImages.forEach(imagePath => {
                    const img = document.createElement('img');
                    img.src = `http://localhost:5500/${imagePath}`; // Ajusta esta ruta
                    img.classList.add('img-thumbnail');
                    img.style.width = '100px';
                    img.style.marginRight = '10px';
                    previewContainer.appendChild(img);
                    console.log(imagePath);
                });

                // Mostrar la imagen principal
                // const mainImagePreview = document.getElementById('mainImagePreview');
                // mainImagePreview.src = `http://localhost:5500/${product.image}`; // Ajusta esta ruta
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos del producto:', error);
            alert('Error al cargar el producto.');
        });
}

// Evento para guardar los cambios del producto
document.getElementById("productForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Recoger los datos del formulario
    const productName = document.getElementById("productName").value;
    const productCategory = document.getElementById("productCategory").value;
    const productBrand = document.getElementById("productBrand").value;
    const productModel = document.getElementById("productModel").value;
    const productPrice = parseFloat(document.getElementById("productPrice").value);
    const productDescription = document.getElementById("productDescription").value;
    const productStock = parseInt(document.getElementById("productStock").value);
    const productColor = document.getElementById("productColor").value;
    const productRating = parseFloat(document.getElementById("productRating").value);
    const productFolderName = document.getElementById("productFolderName").value;

    // Obtener las imágenes seleccionadas
    const productImagesFolder = document.getElementById("productImagesFolder");
    const productImages = Array.from(productImagesFolder.files).map(file => `img_products/${productFolderName}/${file.name}`);

    // La imagen principal (se asume que se ha seleccionado correctamente)
    const productMainImage = document.getElementById("productMainImage").files[0];
    const mainImagePath = `img_products/${productFolderName}/${productMainImage.name}`;

    // Crear el objeto JSON
    const productData = {
        name: productName,
        category: productCategory,
        brand: productBrand,
        model: productModel,
        price: productPrice,
        description: productDescription,
        stock: productStock,
        images: productImages, // Las rutas de las imágenes dentro de la carpeta
        color: productColor,
        rating: productRating,
        image: mainImagePath // Ruta de la imagen principal
    };

    // Enviar los datos a la API para actualizar el producto
    fetch(`http://localhost:8000/api/products/${productId}`, {
        method: 'PUT', // Cambiar de POST a PUT para editar el producto
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Mostrar mensaje de éxito
            alert('Producto actualizado exitosamente');
            window.location.href = "/panel_administrativo/pages/products.html"; // Redirigir a la lista de productos
        } else {
            alert('Error al actualizar el producto');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error, intente de nuevo.');
    });
});

// Función para manejar la vista previa de las imágenes
document.getElementById('productImagesFolder').addEventListener('change', function(event) {
    const files = event.target.files; // Archivos seleccionados
    const previewContainer = document.getElementById('productImagesPreview'); // Contenedor donde se mostrarán las imágenes

    // Limpiar el contenedor antes de agregar las nuevas imágenes
    previewContainer.innerHTML = '';

    // Iterar sobre los archivos seleccionados y mostrar una vista previa de cada uno
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Verificar si el archivo es una imagen
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function(e) {
                // Crear un elemento de imagen para la vista previa
                const img = document.createElement('img');
                img.src = e.target.result; // Asignar la URL de la imagen
                img.classList.add('img-thumbnail'); // Agregar clases para un estilo agradable
                img.style.width = '100px'; // Puedes ajustar el tamaño según sea necesario
                img.style.marginRight = '10px'; // Espaciado entre las imágenes

                // Agregar la imagen al contenedor
                previewContainer.appendChild(img);
            };

            // Leer el archivo como una URL de datos para mostrarlo en el navegador
            reader.readAsDataURL(file);
        }
    }
});
