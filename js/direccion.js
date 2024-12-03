document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('auth_token'); // Verificar si el token está almacenado en localStorage

    // Si el token no existe o es inválido, redirigir al login
    if (!token) {
        alert("No estás autenticado. Redirigiendo al login...");
        window.location.href = "login.html"; // Redirigir a la página de login
        return; // Detener la ejecución del script si no hay token
    }

    // Función para validar los campos del formulario
    function validarCampos() {
        const camposRequeridos = document.querySelectorAll('.requerido'); // Seleccionamos todos los campos con la clase 'requerido'
        let valido = true;

        // Iteramos sobre los campos requeridos para verificar si están vacíos
        camposRequeridos.forEach(function(campo) {
            if (campo.value.trim() === '') {  // Si el campo está vacío
                valido = false;
                campo.style.border = '2px solid red'; // Resaltar el campo vacío en rojo
            } else {
                campo.style.border = ''; // Limpiar el estilo si el campo tiene valor
            }
        });

        return valido;
    }

    // Función para procesar la compra
    const checkoutBtn = document.getElementById("checkout-btn");
    const userId = localStorage.getItem('user_id');

    checkoutBtn.addEventListener("click", function(event) {
        // Validar los campos antes de procesar la compra
        if (!validarCampos()) {
            alert("Por favor, llena todos los campos obligatorios.");
            event.preventDefault();  // Detener la ejecución del evento si la validación falla
            return;  // No continuar con la compra
        }

        // Realizar la petición de procesamiento de la compra solo si la validación es exitosa
        fetch(`http://25.61.101.23/api/carro/procesar-compra/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Compra procesada exitosamente') {
                console.log('Compra exitosa');
                alert('Compra procesada exitosamente. GRACIAS POR SU COMPRA');
                // Redirigir al usuario a la página de dirección después de una compra exitosa
                window.location.href = '/index.html'; // Redirigir a la página de dirección
            } else {
                alert('Hubo un problema con el proceso de la compra. Intenta nuevamente.');
            }
        })
        .catch(error => {
            console.error('Error de red', error);
            alert('Hubo un problema al procesar la compra. Intenta nuevamente.');
        });
    });
});

// Función para generar los años dinámicamente
function generarAños() {
    const select = document.getElementById('year'); // Seleccionamos el <select> por su ID
    const startYear = 2024; // Año inicial
    const endYear = 2035;  // Año final
    
    // Iteramos del año inicial al final y añadimos las opciones
    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement('option'); // Creamos un nuevo elemento <option>
        option.value = year; // El valor del option es el año
        option.textContent = year; // El texto que se muestra es el año
        select.appendChild(option); // Añadimos la opción al <select>
    }
}

// Llamamos a la función para generar los años cuando cargue el documento
document.addEventListener('DOMContentLoaded', generarAños);
