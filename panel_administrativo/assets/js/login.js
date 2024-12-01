(function () {
	'use strict'

	// Obtener todos los formularios a los que queremos aplicar estilos de validación de Bootstrap personalizados
	var forms = document.querySelectorAll('.needs-validation')

	// Bucle sobre ellos y evitar la presentación
	Array.prototype.slice.call(forms)
		.forEach(function (form) {
			form.addEventListener('submit', function (event) {
				if (!form.checkValidity()) {
					event.preventDefault()
					event.stopPropagation()
				}

				form.classList.add('was-validated')
			}, false)
		})
})()