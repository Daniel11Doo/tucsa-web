"use strict";
const endpoint = 'http://127.0.0.1:5000/contacto/api/add';

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formAlerts = document.getElementById('formAlerts');

    // Lista de campos a validar, con reglas y mensajes
    const fieldsConfig = {
        name: {
            minLength: 3,
            maxLength: 50,
            required: true,
            errorMsg: 'El nombre debe tener al menos 3 caracteres.'
        },
        email: {
            required: true,
            // Regex simple para email. Podrías usar algo más robusto.
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMsg: 'Ingresa un correo electrónico válido.'
        },
        phone: {
            required: true,
            pattern: /^[0-9()+-\s]{10}$/,
            errorMsg: 'El teléfono debe tener 10 dígitos (sólo números).'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 500,
            errorMsg: 'El mensaje debe tener entre 10 y 500 caracteres.'
        }
    };

    // Asignar evento blur a cada input
    Object.keys(fieldsConfig).forEach((fieldId) => {
        const inputEl = document.getElementById(fieldId);
        if (inputEl) {
            inputEl.addEventListener('blur', () => validateField(fieldId));
        }
    });

    // Función de validación para un campo específico
    function validateField(fieldId) {
        const inputEl = document.getElementById(fieldId);
        const config = fieldsConfig[fieldId];
        const value = inputEl.value.trim();
        let error = '';

        // Validar si es requerido
        if (config.required && !value) {
            error = 'Este campo es obligatorio.';
        }
        // Validar longitud mínima
        if (!error && config.minLength && value.length < config.minLength) {
            error = config.errorMsg || `Debe tener al menos ${config.minLength} caracteres.`;
        }
        // Validar longitud máxima
        if (!error && config.maxLength && value.length > config.maxLength) {
            error = config.errorMsg || `No debe exceder los ${config.maxLength} caracteres.`;
        }
        // Validar patrón (regex)
        if (!error && config.pattern && !config.pattern.test(value)) {
            error = config.errorMsg;
        }

        // Mostrar/ocultar mensaje de error
        const errorContainer = document.getElementById(`${fieldId}-error`);
        if (error) {
            errorContainer.textContent = error;
        } else {
            errorContainer.textContent = '';
        }

        // Retornar true/false para saber si el campo es válido
        return !error;
    }

    // Validación global al hacer submit
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        formAlerts.innerHTML = ''; // Limpia alertas

        // 1. Validar todos los campos antes de enviar
        let isFormValid = true;
        Object.keys(fieldsConfig).forEach((fieldId) => {
            const fieldValid = validateField(fieldId);
            if (!fieldValid) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // Si hay al menos un error, no enviamos la petición
            showAlert('Por favor corrige los campos marcados antes de enviar.', 'error');
            return;
        }

        // 2. Construir FormData
        const formData = new FormData(contactForm);

        try {
            // 3. Enviar asíncronamente al endpoint
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (response.ok && result.status === 'success') {
                // Éxito
                showAlert(result.message, 'success');
                contactForm.reset(); // Limpia el formulario
            } else {
                // Errores de Flask-WTF u otro tipo
                if (result.errors) {
                    // Mostramos los errores devueltos por el back
                    // y los asignamos al contenedor de cada campo si es posible
                    handleServerErrors(result.errors);
                } else {
                    showAlert('Ocurrió un error al enviar el mensaje.', 'error');
                }
            }
        } catch (err) {
            console.error(err);
            showAlert('No se pudo conectar con el servidor.', 'error');
        }
    });

    // Mostrar mensaje global en #formAlerts
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('alert', `alert-${type}`);
        alertDiv.textContent = message;
        formAlerts.appendChild(alertDiv);
    }

    // Asignar errores específicos del servidor a cada campo
    function handleServerErrors(errors) {
        // errors es un dict: { 'name': ['Error 1', 'Error 2'], 'email': ['Error 3'] }
        let messages = [];
        for (let field in errors) {
            const errorContainer = document.getElementById(`${field}-error`);
            if (errorContainer) {
                // Mostramos solo el primer error para cada campo
                errorContainer.textContent = errors[field][0];
            } else {
                // Si no hay contenedor, lo agregamos a la lista general
                messages.push(...errors[field]);
            }
        }
        if (messages.length > 0) {
            showAlert(messages.join(' | '), 'error');
        }
    }
});
