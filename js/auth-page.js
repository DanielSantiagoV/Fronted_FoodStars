/**
 * FoodieRank - Auth Page Logic
 * Handles login and registration forms
 */

// Variable que almacena la pestaña activa actual ('login' o 'register')
// Current active tab
let currentTab = 'login';

/**
 * Cambia entre las pestañas de login y registro
 * Actualiza la visualización de las pestañas y formularios
 * @param {string} tab - Pestaña a la cual cambiar ('login' o 'register')
 */
function switchTab(tab) {
    // Actualiza la variable global con la pestaña seleccionada
    currentTab = tab;
    
    // Actualiza las pestañas
    // Obtiene el elemento de la pestaña de login
    const loginTab = document.getElementById('loginTab');
    // Obtiene el elemento de la pestaña de registro
    const registerTab = document.getElementById('registerTab');
    // Obtiene el elemento del formulario de login
    const loginForm = document.getElementById('loginForm');
    // Obtiene el elemento del formulario de registro
    const registerForm = document.getElementById('registerForm');
    
    // Si se seleccionó la pestaña de login
    if (tab === 'login') {
        // Agrega la clase 'active' a la pestaña de login
        loginTab.classList.add('active');
        // Remueve la clase 'active' de la pestaña de registro
        registerTab.classList.remove('active');
        // Agrega la clase 'active' al formulario de login (lo muestra)
        loginForm.classList.add('active');
        // Remueve la clase 'active' del formulario de registro (lo oculta)
        registerForm.classList.remove('active');
    } else {
        // Si se seleccionó la pestaña de registro
        // Remueve la clase 'active' de la pestaña de login
        loginTab.classList.remove('active');
        // Agrega la clase 'active' a la pestaña de registro
        registerTab.classList.add('active');
        // Remueve la clase 'active' del formulario de login (lo oculta)
        loginForm.classList.remove('active');
        // Agrega la clase 'active' al formulario de registro (lo muestra)
        registerForm.classList.add('active');
    }
    
    // Limpia los errores del formulario
    clearFormErrors();
}

/**
 * Alterna la visibilidad de la contraseña en el campo de entrada
 * Cambia entre mostrar y ocultar la contraseña, actualizando el icono
 * @param {string} inputId - ID del campo de entrada de contraseña
 */
function togglePassword(inputId) {
    // Obtiene el elemento del campo de entrada de contraseña
    const input = document.getElementById(inputId);
    // Obtiene el botón de toggle desde el elemento padre del input
    const button = input.parentElement.querySelector('.password-toggle');
    
    // Si el tipo de input es 'password' (contraseña oculta)
    if (input.type === 'password') {
        // Cambia el tipo de input a 'text' (contraseña visible)
        input.type = 'text';
        // Actualiza el HTML del botón con el icono de ojo cerrado (ocultar contraseña)
        button.innerHTML = `
            <svg class="eye-closed" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
        `;
    } else {
        // Si el tipo de input es 'text' (contraseña visible)
        // Cambia el tipo de input a 'password' (contraseña oculta)
        input.type = 'password';
        // Actualiza el HTML del botón con el icono de ojo abierto (mostrar contraseña)
        button.innerHTML = `
            <svg class="eye-open" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
        `;
    }
}

/**
 * Limpia todos los errores de los formularios
 * Remueve los mensajes de error y las clases de error de los campos
 */
function clearFormErrors() {
    // Selecciona todos los elementos con la clase 'form-error' y los itera
    document.querySelectorAll('.form-error').forEach(error => {
        // Limpia el texto de error estableciéndolo como cadena vacía
        error.textContent = '';
    });
    
    // Selecciona todos los inputs dentro de grupos de formulario y los itera
    document.querySelectorAll('.form-group input').forEach(input => {
        // Remueve la clase 'error' del input para quitar el estilo de error
        input.classList.remove('error');
    });
}

/**
 * Muestra un error en un campo específico del formulario
 * Agrega la clase de error al campo y muestra el mensaje en el span de error
 * @param {string} fieldId - ID del campo del formulario
 * @param {string} message - Mensaje de error a mostrar
 */
function showFieldError(fieldId, message) {
    // Obtiene el elemento del campo por su ID
    const field = document.getElementById(fieldId);
    // Obtiene el elemento span de error que corresponde al campo (fieldId + 'Error')
    const errorSpan = document.getElementById(fieldId + 'Error');
    
    // Si el campo existe, agrega la clase 'error' para aplicar estilos de error
    if (field) field.classList.add('error');
    // Si el span de error existe, establece el mensaje de error como su texto
    if (errorSpan) errorSpan.textContent = message;
}

/**
 * Valida el formato del correo electrónico
 * Utiliza la función de validación global de email
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} True si el formato es válido
 */
function validateEmailFormat(email) {
    // Llama a la función global validateEmail y retorna su resultado
    return validateEmail(email);
}

/**
 * Valida el formulario de login
 * Verifica que el email y password cumplan con los requisitos
 * @param {object} data - Datos del formulario
 * @returns {boolean} True si el formulario es válido
 */
function validateLoginForm(data) {
    // Limpia todos los errores previos del formulario
    clearFormErrors();
    // Inicializa la variable de validez como true
    let isValid = true;
    
    // Valida el correo electrónico
    // Verifica si el email está vacío o no existe
    if (!data.email) {
        // Muestra un error indicando que el email es requerido
        showFieldError('loginEmail', 'El correo electrónico es requerido');
        // Marca el formulario como inválido
        isValid = false;
    } else if (!validateEmailFormat(data.email)) {
        // Si el email existe pero el formato no es válido
        // Muestra un error indicando que el formato es inválido
        showFieldError('loginEmail', 'Ingresa un correo electrónico válido');
        // Marca el formulario como inválido
        isValid = false;
    }
    
    // Valida la contraseña
    // Verifica si la contraseña está vacía o no existe
    if (!data.password) {
        // Muestra un error indicando que la contraseña es requerida
        showFieldError('loginPassword', 'La contraseña es requerida');
        // Marca el formulario como inválido
        isValid = false;
    } else if (data.password.length < CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
        // Si la contraseña existe pero es muy corta
        // Muestra un error con la longitud mínima requerida (usando template literal)
        showFieldError('loginPassword', `La contraseña debe tener al menos ${CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} caracteres`);
        // Marca el formulario como inválido
        isValid = false;
    }
    
    // Retorna el estado de validez del formulario
    return isValid;
}

/**
 * Valida el formulario de registro
 * Verifica que todos los campos cumplan con los requisitos
 * @param {object} data - Datos del formulario
 * @returns {boolean} True si el formulario es válido
 */
function validateRegisterForm(data) {
    // Limpia todos los errores previos del formulario
    clearFormErrors();
    // Inicializa la variable de validez como true
    let isValid = true;
    
    // Valida el nombre
    // Verifica si el nombre está vacío o no existe
    if (!data.nombre) {
        // Muestra un error indicando que el nombre es requerido
        showFieldError('registerName', 'El nombre es requerido');
        // Marca el formulario como inválido
        isValid = false;
    } else if (data.nombre.length < CONFIG.VALIDATION.USERNAME_MIN_LENGTH) {
        // Si el nombre existe pero es muy corto
        // Muestra un error con la longitud mínima requerida (usando template literal)
        showFieldError('registerName', `El nombre debe tener al menos ${CONFIG.VALIDATION.USERNAME_MIN_LENGTH} caracteres`);
        // Marca el formulario como inválido
        isValid = false;
    }
    
    // Valida el correo electrónico
    // Verifica si el email está vacío o no existe
    if (!data.email) {
        // Muestra un error indicando que el email es requerido
        showFieldError('registerEmail', 'El correo electrónico es requerido');
        // Marca el formulario como inválido
        isValid = false;
    } else if (!validateEmailFormat(data.email)) {
        // Si el email existe pero el formato no es válido
        // Muestra un error indicando que el formato es inválido
        showFieldError('registerEmail', 'Ingresa un correo electrónico válido');
        // Marca el formulario como inválido
        isValid = false;
    }
    
    // Valida la contraseña
    // Verifica si la contraseña está vacía o no existe
    if (!data.password) {
        // Muestra un error indicando que la contraseña es requerida
        showFieldError('registerPassword', 'La contraseña es requerida');
        // Marca el formulario como inválido
        isValid = false;
    } else {
        // Si la contraseña existe, valida su fortaleza
        // Llama a la función de validación de contraseña que retorna un objeto con isValid y message
        const passwordValidation = validatePassword(data.password);
        // Verifica si la validación indica que la contraseña no es válida
        if (!passwordValidation.isValid) {
            // Muestra el mensaje de error específico de la validación
            showFieldError('registerPassword', passwordValidation.message);
            // Marca el formulario como inválido
            isValid = false;
        }
    }
    
    // Valida la confirmación de contraseña
    // Verifica si la confirmación de contraseña está vacía o no existe
    if (!data.confirmPassword) {
        // Muestra un error indicando que debe confirmar la contraseña
        showFieldError('registerConfirmPassword', 'Debes confirmar la contraseña');
        // Marca el formulario como inválido
        isValid = false;
    } else if (data.password !== data.confirmPassword) {
        // Si la confirmación existe pero no coincide con la contraseña
        // Muestra un error indicando que las contraseñas no coinciden
        showFieldError('registerConfirmPassword', 'Las contraseñas no coinciden');
        // Marca el formulario como inválido
        isValid = false;
    }
    
    // Valida la aceptación de términos y condiciones
    // Verifica si el usuario no ha aceptado los términos
    if (!data.acceptTerms) {
        // Muestra un error indicando que debe aceptar los términos
        showFieldError('acceptTerms', 'Debes aceptar los términos y condiciones');
        // Marca el formulario como inválido
        isValid = false;
    }
    
    // Retorna el estado de validez del formulario
    return isValid;
}

/**
 * Maneja el envío del formulario de login
 * Previene el comportamiento por defecto, valida y procesa el login
 * @param {Event} e - Evento de envío del formulario
 */
async function handleLoginSubmit(e) {
    // Previene el comportamiento por defecto del formulario (recargar la página)
    e.preventDefault();
    
    // Obtiene el formulario que disparó el evento
    const form = e.target;
    // Obtiene el botón de envío del formulario
    const submitBtn = form.querySelector('button[type="submit"]');
    // Crea un objeto FormData con los datos del formulario
    const formData = new FormData(form);
    // Convierte el FormData a un objeto JavaScript plano
    const data = Object.fromEntries(formData);
    
    // Valida el formulario antes de continuar
    if (!validateLoginForm(data)) {
        // Si el formulario no es válido, termina la ejecución sin hacer nada más
        return;
    }
    
    // Deshabilita el botón de envío para evitar múltiples envíos
    submitBtn.disabled = true;
    // Guarda el texto original del botón para restaurarlo después
    const originalText = submitBtn.innerHTML;
    // Cambia el texto del botón a 'Iniciando sesión...' para indicar que está procesando
    submitBtn.innerHTML = '<span>Iniciando sesión...</span>';
    
    try {
        // Llama a la función de login desde auth.js pasando email y password
        await handleLogin({
            email: data.email,
            password: data.password
        });
        
        // Feedback de éxito (el toast se muestra en handleLogin)
        // Agrega una clase al formulario para indicar éxito visualmente
        form.classList.add('form-success');
        
    } catch (error) {
        // Si hay un error durante el proceso de login
        // Registra el error en la consola para depuración
        console.error('Login error:', error);
        
        // Muestra un mensaje de error
        // Obtiene el mensaje del error o usa el mensaje genérico de error
        const errorMessage = error.message || CONFIG.MESSAGES.ERROR.GENERIC;
        // Muestra un toast con el mensaje de error
        showToast(errorMessage, 'error');
        
        // Rehabilita el botón de envío
        submitBtn.disabled = false;
        // Restaura el texto original del botón
        submitBtn.innerHTML = originalText;
    }
}

/**
 * Maneja el envío del formulario de registro
 * Previene el comportamiento por defecto, valida y procesa el registro
 * @param {Event} e - Evento de envío del formulario
 */
async function handleRegisterSubmit(e) {
    // Previene el comportamiento por defecto del formulario (recargar la página)
    e.preventDefault();
    
    // Obtiene el formulario que disparó el evento
    const form = e.target;
    // Obtiene el botón de envío del formulario
    const submitBtn = form.querySelector('button[type="submit"]');
    // Crea un objeto FormData con los datos del formulario
    const formData = new FormData(form);
    // Convierte el FormData a un objeto JavaScript plano
    const data = Object.fromEntries(formData);
    
    // Convierte el checkbox a booleano
    // Obtiene el valor del checkbox 'acceptTerms' y verifica si es 'on'
    data.acceptTerms = formData.get('acceptTerms') === 'on';
    
    // Valida el formulario antes de continuar
    if (!validateRegisterForm(data)) {
        // Si el formulario no es válido, termina la ejecución sin hacer nada más
        return;
    }
    
    // Deshabilita el botón de envío para evitar múltiples envíos
    submitBtn.disabled = true;
    // Guarda el texto original del botón para restaurarlo después
    const originalText = submitBtn.innerHTML;
    // Cambia el texto del botón a 'Creando cuenta...' para indicar que está procesando
    submitBtn.innerHTML = '<span>Creando cuenta...</span>';
    
    try {
        // Remueve confirmPassword de los datos antes de enviar (no se necesita en el servidor)
        // Usa destructuring para separar los campos que no se envían
        const { confirmPassword, acceptTerms, ...registerData } = data;
        
        // Llama a la función de registro desde auth.js pasando los datos limpios
        await handleRegister(registerData);
        
        // Feedback de éxito (el toast se muestra en handleRegister)
        // Agrega una clase al formulario para indicar éxito visualmente
        form.classList.add('form-success');
        
    } catch (error) {
        // Si hay un error durante el proceso de registro
        // Registra el error en la consola para depuración
        console.error('Register error:', error);
        
        // Muestra un mensaje de error
        // Obtiene el mensaje del error o usa el mensaje genérico de error
        const errorMessage = error.message || CONFIG.MESSAGES.ERROR.GENERIC;
        // Muestra un toast con el mensaje de error
        showToast(errorMessage, 'error');
        
        // Rehabilita el botón de envío
        submitBtn.disabled = false;
        // Restaura el texto original del botón
        submitBtn.innerHTML = originalText;
    }
}

/**
 * Actualiza el indicador de fortaleza de contraseña
 * Calcula la fortaleza basándose en varios criterios y actualiza la UI
 * @param {string} password - Contraseña a evaluar
 */
function updatePasswordStrength(password) {
    // Obtiene el elemento que muestra la barra de fortaleza (el fill)
    const strengthFill = document.getElementById('strengthFill');
    // Obtiene el elemento que muestra el texto de fortaleza
    const strengthText = document.getElementById('strengthText');
    
    // Si alguno de los elementos no existe, termina la ejecución
    if (!strengthFill || !strengthText) return;
    
    // Remueve todas las clases de fortaleza para empezar desde cero
    strengthFill.classList.remove('weak', 'medium', 'strong');
    
    // Si no hay contraseña
    if (!password) {
        // Establece el ancho de la barra a 0 (sin progreso)
        strengthFill.style.width = '0';
        // Muestra un mensaje indicando el requisito mínimo
        strengthText.textContent = 'La contraseña debe tener al menos 8 caracteres';
        // Termina la ejecución
        return;
    }
    
    // Inicializa el contador de fortaleza en 0
    let strength = 0;
    // Objeto con todas las verificaciones que se realizarán
    const checks = {
        // Verifica si la contraseña tiene al menos 8 caracteres
        length: password.length >= 8,
        // Verifica si contiene al menos una letra mayúscula usando regex
        uppercase: /[A-Z]/.test(password),
        // Verifica si contiene al menos una letra minúscula usando regex
        lowercase: /[a-z]/.test(password),
        // Verifica si contiene al menos un número usando regex
        numbers: /[0-9]/.test(password),
        // Verifica si contiene al menos un carácter especial (no alfanumérico) usando regex
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    // Calcula la fortaleza
    // Itera sobre todos los valores del objeto checks
    Object.values(checks).forEach(check => {
        // Si la verificación es verdadera, incrementa el contador de fortaleza
        if (check) strength++;
    });
    
    // Actualiza la UI según la fortaleza calculada
    // Si la fortaleza es 2 o menos (débil)
    if (strength <= 2) {
        // Agrega la clase 'weak' a la barra de fortaleza
        strengthFill.classList.add('weak');
        // Establece el texto a 'Contraseña débil'
        strengthText.textContent = 'Contraseña débil';
        // Establece el color del texto a rojo (usando variable CSS de peligro)
        strengthText.style.color = 'var(--danger)';
    } else if (strength <= 4) {
        // Si la fortaleza es entre 3 y 4 (media)
        // Agrega la clase 'medium' a la barra de fortaleza
        strengthFill.classList.add('medium');
        // Establece el texto a 'Contraseña media'
        strengthText.textContent = 'Contraseña media';
        // Establece el color del texto a amarillo/naranja (usando variable CSS de advertencia)
        strengthText.style.color = 'var(--warning)';
    } else {
        // Si la fortaleza es 5 (fuerte - todos los criterios cumplidos)
        // Agrega la clase 'strong' a la barra de fortaleza
        strengthFill.classList.add('strong');
        // Establece el texto a 'Contraseña fuerte'
        strengthText.textContent = 'Contraseña fuerte';
        // Establece el color del texto a verde (usando variable CSS de éxito)
        strengthText.style.color = 'var(--success)';
    }
}

/**
 * Configura el monitor de fortaleza de contraseña
 * Agrega un listener al campo de contraseña para actualizar la fortaleza en tiempo real
 */
function setupPasswordStrength() {
    // Obtiene el elemento del campo de entrada de contraseña de registro
    const passwordInput = document.getElementById('registerPassword');
    // Si el elemento existe
    if (passwordInput) {
        // Agrega un listener al evento 'input' que se dispara cada vez que cambia el texto
        passwordInput.addEventListener('input', (e) => {
            // Actualiza la fortaleza de contraseña con el valor actual del campo
            updatePasswordStrength(e.target.value);
        });
    }
}

/**
 * Verifica si el usuario ya está autenticado
 * Si está autenticado, muestra mensaje y redirige
 */
function checkExistingAuth() {
    // Verifica si el usuario está autenticado
    if (isAuthenticated()) {
        // Muestra un mensaje informativo indicando que ya está logueado
        showToast('Ya has iniciado sesión', 'info');
        // Espera 1.5 segundos antes de redirigir
        setTimeout(() => {
            // Obtiene los parámetros de la URL actual
            const params = getQueryParams();
            // Obtiene la URL de redirección si existe en los parámetros
            let redirectUrl = params.redirect;
            
            // Si no hay parámetro de redirección, va a index.html
            if (!redirectUrl) {
                // Determina la ruta correcta basada en la ubicación actual
                // Obtiene la ruta actual del navegador
                const currentPath = window.location.pathname;
                // Si la ruta incluye '/html/', usa ruta relativa hacia arriba, sino ruta relativa simple
                redirectUrl = currentPath.includes('/html/') 
                    ? '../index.html' 
                    : 'index.html';
            }
            
            // Redirige a la URL determinada
            window.location.href = redirectUrl;
        }, 1500);
    }
}

/**
 * Inicializa la página de autenticación
 * Configura todos los event listeners y verificaciones necesarias
 */
function initAuthPage() {
    // Verifica si el usuario ya está autenticado
    checkExistingAuth();
    
    // Configura los manejadores de formularios
    // Obtiene el formulario de login
    const loginForm = document.getElementById('loginForm');
    // Obtiene el formulario de registro
    const registerForm = document.getElementById('registerForm');
    
    // Si el formulario de login existe
    if (loginForm) {
        // Agrega un listener al evento 'submit' del formulario de login
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Si el formulario de registro existe
    if (registerForm) {
        // Agrega un listener al evento 'submit' del formulario de registro
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
    
    // Configura el indicador de fortaleza de contraseña
    setupPasswordStrength();
    
    // Verifica si hay un parámetro de redirección y muestra mensaje
    // Obtiene los parámetros de la URL actual
    const params = getQueryParams();
    // Si existe un parámetro 'redirect'
    if (params.redirect) {
        // Muestra un mensaje informativo indicando que debe iniciar sesión
        showToast('Debes iniciar sesión para continuar', 'info');
    }
    
    // Configura los botones de autenticación social (placeholder)
    // Selecciona todos los botones con la clase 'social-btn'
    document.querySelectorAll('.social-btn').forEach(btn => {
        // Agrega un listener al evento 'click' de cada botón
        btn.addEventListener('click', () => {
            // Muestra un mensaje indicando que la funcionalidad no está disponible aún
            showToast('Autenticación social próximamente disponible', 'info');
        });
    });
    
    // Configura el enlace de recuperación de contraseña
    // Selecciona todos los enlaces con la clase 'forgot-password'
    document.querySelectorAll('.forgot-password').forEach(link => {
        // Agrega un listener al evento 'click' de cada enlace
        link.addEventListener('click', (e) => {
            // Previene el comportamiento por defecto del enlace (navegar)
            e.preventDefault();
            // Muestra un mensaje indicando que la funcionalidad no está disponible aún
            showToast('Recuperación de contraseña próximamente disponible', 'info');
        });
    });
}

// Inicializa cuando el DOM está listo
// Verifica si el documento está cargando
if (document.readyState === 'loading') {
    // Si está cargando, espera a que el evento 'DOMContentLoaded' se dispare
    document.addEventListener('DOMContentLoaded', initAuthPage);
} else {
    // Si el DOM ya está listo, ejecuta directamente la inicialización
    initAuthPage();
}

// Exporta funciones para uso global
// Hace la función switchTab disponible globalmente a través de window
window.switchTab = switchTab;
// Hace la función togglePassword disponible globalmente a través de window
window.togglePassword = togglePassword;
