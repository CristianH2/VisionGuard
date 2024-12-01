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

    // Enviar los datos a la API
    fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Mostrar mensaje de éxito
            alert('Producto guardado exitosamente');
            window.location.href = "/panel_administrativo/pages/products.html"; // Redirigir a la lista de productos
        } else {
            alert('Error al guardar el producto');
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
