/**
 * FoodieRank - Utility Functions
 * Helper functions used across the application
 */

/**
 * Muestra una notificación toast
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de toast (success, error, warning, info)
 * @param {number} duration - Duración en milisegundos
 */
function showToast(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
    // Obtiene el elemento toast del DOM
    const toast = document.getElementById('toast');
    // Si el elemento no existe, termina la ejecución
    if (!toast) return;
    
    // Remueve las clases existentes
    // Resetea la clase del toast a 'toast' (sin clases adicionales)
    toast.className = 'toast';
    
    // Agrega la clase del tipo
    // Agrega la clase del tipo de toast (success, error, warning, info) y la clase 'show' para mostrarlo
    toast.classList.add(type, 'show');
    
    // Establece el ícono basado en el tipo
    // Mapa de íconos para cada tipo de toast
    const iconMap = {
        success: '✓',  // Ícono de éxito
        error: '✗',    // Ícono de error
        warning: '⚠',  // Ícono de advertencia
        info: 'ℹ'      // Ícono de información
    };
    
    // Mapa de títulos para cada tipo de toast
    const titleMap = {
        success: 'Éxito',      // Título para éxito
        error: 'Error',        // Título para error
        warning: 'Advertencia', // Título para advertencia
        info: 'Información'    // Título para información
    };
    
    // Establece el contenido
    // Obtiene el elemento del ícono dentro del toast
    const icon = toast.querySelector('.toast-icon');
    // Obtiene el elemento del título dentro del toast
    const title = toast.querySelector('.toast-title');
    // Obtiene el elemento del mensaje dentro del toast
    const messageEl = toast.querySelector('.toast-message');
    
    // Si el elemento del ícono existe, establece su texto con el ícono correspondiente o el de info por defecto
    if (icon) icon.textContent = iconMap[type] || iconMap.info;
    // Si el elemento del título existe, establece su texto con el título correspondiente o el de info por defecto
    if (title) title.textContent = titleMap[type] || titleMap.info;
    // Si el elemento del mensaje existe, establece su texto con el mensaje proporcionado
    if (messageEl) messageEl.textContent = message;
    
    // Ocultar automáticamente
    // Programa la ocultación del toast después de la duración especificada
    setTimeout(() => {
        // Llama a la función para ocultar el toast
        hideToast();
    }, duration);
}

/**
 * Oculta la notificación toast
 * Remueve la clase 'show' para ocultar el toast
 */
function hideToast() {
    // Obtiene el elemento toast del DOM
    const toast = document.getElementById('toast');
    // Si el elemento existe
    if (toast) {
        // Remueve la clase 'show' para ocultar el toast
        toast.classList.remove('show');
    }
}

/**
 * Formatea una fecha a string localizado
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatDate(date) {
    // Si no hay fecha, retorna cadena vacía
    if (!date) return '';
    // Convierte la fecha a un objeto Date
    const d = new Date(date);
    // Retorna la fecha formateada en español de Colombia con año numérico, mes completo y día numérico
    return d.toLocaleDateString('es-CO', {
        year: 'numeric',  // Año en formato numérico
        month: 'long',    // Mes en formato largo (enero, febrero, etc.)
        day: 'numeric'    // Día en formato numérico
    });
}

/**
 * Formatea el tiempo relativo (ej: "hace 2 días")
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} String de tiempo relativo
 */
function formatRelativeTime(date) {
    // Si no hay fecha, retorna cadena vacía
    if (!date) return '';
    
    // Obtiene la fecha/hora actual
    const now = new Date();
    // Convierte la fecha proporcionada a un objeto Date
    const past = new Date(date);
    // Calcula la diferencia en milisegundos
    const diffMs = now - past;
    // Calcula la diferencia en segundos (redondea hacia abajo)
    const diffSecs = Math.floor(diffMs / 1000);
    // Calcula la diferencia en minutos (redondea hacia abajo)
    const diffMins = Math.floor(diffSecs / 60);
    // Calcula la diferencia en horas (redondea hacia abajo)
    const diffHours = Math.floor(diffMins / 60);
    // Calcula la diferencia en días (redondea hacia abajo)
    const diffDays = Math.floor(diffHours / 24);
    // Calcula la diferencia en meses (aproximado, redondea hacia abajo)
    const diffMonths = Math.floor(diffDays / 30);
    // Calcula la diferencia en años (aproximado, redondea hacia abajo)
    const diffYears = Math.floor(diffDays / 365);
    
    // Si la diferencia es menor a 60 segundos, retorna "Hace un momento"
    if (diffSecs < 60) return 'Hace un momento';
    // Si la diferencia es menor a 60 minutos, retorna la cantidad de minutos (con plural si es necesario)
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    // Si la diferencia es menor a 24 horas, retorna la cantidad de horas (con plural si es necesario)
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    // Si la diferencia es menor a 30 días, retorna la cantidad de días (con plural si es necesario)
    if (diffDays < 30) return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    // Si la diferencia es menor a 12 meses, retorna la cantidad de meses (con plural si es necesario)
    if (diffMonths < 12) return `Hace ${diffMonths} mes${diffMonths !== 1 ? 'es' : ''}`;
    // Si es mayor a 12 meses, retorna la cantidad de años (con plural si es necesario)
    return `Hace ${diffYears} año${diffYears !== 1 ? 's' : ''}`;
}

/**
 * Genera HTML de calificación por estrellas
 * @param {number} rating - Valor de calificación (1-5)
 * @param {number} maxStars - Número máximo de estrellas
 * @returns {string} String HTML con estrellas
 */
function generateStars(rating, maxStars = 5) {
    // Calcula el número de estrellas completas (redondea hacia abajo)
    const fullStars = Math.floor(rating);
    // Verifica si hay media estrella (si el resto de la división es >= 0.5)
    const hasHalfStar = rating % 1 >= 0.5;
    // Calcula el número de estrellas vacías (total - completas - media estrella si existe)
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
    
    // Inicializa la cadena HTML vacía
    let html = '';
    
    // Estrellas completas
    // Itera para agregar las estrellas completas
    for (let i = 0; i < fullStars; i++) {
        // Agrega una estrella completa
        html += '⭐';
    }
    
    // Media estrella
    // Si hay media estrella
    if (hasHalfStar) {
        // Usa una estrella completa por simplicidad (normalmente sería media estrella)
        html += '⭐'; // Using full star for simplicity
    }
    
    // Estrellas vacías
    // Itera para agregar las estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
        // Agrega una estrella vacía
        html += '☆';
    }
    
    // Retorna el HTML generado
    return html;
}

/**
 * Trunca texto a la longitud especificada
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
function truncateText(text, maxLength = 100) {
    // Si no hay texto o el texto es menor o igual a la longitud máxima, retorna el texto original
    if (!text || text.length <= maxLength) return text;
    // Retorna el texto truncado a la longitud máxima, eliminando espacios al inicio/final y agregando '...'
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Valida el formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
function validateEmail(email) {
    // Expresión regular para validar formato de email (texto antes de @, @, texto después de @, punto, dominio)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Prueba si el email coincide con la expresión regular
    return re.test(email);
}

/**
 * Valida la fortaleza de la contraseña
 * @param {string} password - Contraseña a validar
 * @returns {object} Resultado de validación con isValid y message
 */
function validatePassword(password) {
    // Valida que la contraseña exista y tenga la longitud mínima requerida
    if (!password || password.length < CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
        // Retorna un objeto indicando que no es válida y el mensaje de error
        return {
            isValid: false,
            message: `La contraseña debe tener al menos ${CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} caracteres`
        };
    }
    
    // Valida que la contraseña contenga al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
        // Retorna un objeto indicando que no es válida y el mensaje de error
        return {
            isValid: false,
            message: 'La contraseña debe contener al menos una letra mayúscula'
        };
    }
    
    // Valida que la contraseña contenga al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
        // Retorna un objeto indicando que no es válida y el mensaje de error
        return {
            isValid: false,
            message: 'La contraseña debe contener al menos una letra minúscula'
        };
    }
    
    // Valida que la contraseña contenga al menos un número
    if (!/[0-9]/.test(password)) {
        // Retorna un objeto indicando que no es válida y el mensaje de error
        return {
            isValid: false,
            message: 'La contraseña debe contener al menos un número'
        };
    }
    
    // Si pasa todas las validaciones, retorna que es válida
    return { isValid: true, message: 'Contraseña válida' };
}

/**
 * Obtiene los parámetros de consulta de la URL
 * @returns {object} Objeto con los parámetros de consulta
 */
function getQueryParams() {
    // Inicializa un objeto vacío para almacenar los parámetros
    const params = {};
    // Obtiene los parámetros de consulta de la URL actual
    const searchParams = new URLSearchParams(window.location.search);
    
    // Itera sobre cada par clave-valor de los parámetros
    for (const [key, value] of searchParams) {
        // Agrega el parámetro al objeto usando la clave como propiedad
        params[key] = value;
    }
    
    // Retorna el objeto con todos los parámetros
    return params;
}

/**
 * Actualiza la URL con parámetros de consulta sin recargar
 * @param {object} params - Parámetros a agregar a la URL
 */
function updateQueryParams(params) {
    // Crea un objeto URL basado en la ubicación actual
    const url = new URL(window.location);
    
    // Itera sobre cada clave del objeto de parámetros
    Object.keys(params).forEach(key => {
        // Si el parámetro tiene un valor
        if (params[key]) {
            // Establece el parámetro en la URL
            url.searchParams.set(key, params[key]);
        } else {
            // Si no tiene valor, elimina el parámetro de la URL
            url.searchParams.delete(key);
        }
    });
    
    // Actualiza la URL sin recargar la página usando el historial del navegador
    window.history.pushState({}, '', url);
}

/**
 * Función debounce
 * Retarda la ejecución de una función hasta que no se llame por un período de tiempo
 * @param {function} func - Función a debounce
 * @param {number} wait - Tiempo de espera en milisegundos
 * @returns {function} Función con debounce aplicado
 */
function debounce(func, wait = 300) {
    // Variable para almacenar el identificador del timeout
    let timeout;
    // Retorna una función que aplica el debounce
    return function executedFunction(...args) {
        // Función que se ejecutará después del tiempo de espera
        const later = () => {
            // Limpia el timeout anterior
            clearTimeout(timeout);
            // Ejecuta la función original con los argumentos
            func(...args);
        };
        // Limpia cualquier timeout previo
        clearTimeout(timeout);
        // Establece un nuevo timeout para ejecutar la función después del tiempo de espera
        timeout = setTimeout(later, wait);
    };
}

/**
 * Hace scroll suave a un elemento
 * @param {string} elementId - ID del elemento al cual hacer scroll
 */
function scrollToElement(elementId) {
    // Obtiene el elemento por su ID
    const element = document.getElementById(elementId);
    // Si el elemento existe
    if (element) {
        // Hace scroll suave hasta el elemento
        element.scrollIntoView({
            behavior: 'smooth',  // Comportamiento suave
            block: 'start'      // Alinea el elemento al inicio del viewport
        });
    }
}

/**
 * Obtiene el ícono de una categoría
 * @param {string} categoryName - Nombre de la categoría
 * @returns {string} Emoji del ícono
 */
function getCategoryIcon(categoryName) {
    // Retorna el ícono de la categoría del CONFIG o el ícono por defecto si no existe
    return CONFIG.CATEGORY_ICONS[categoryName] || CONFIG.CATEGORY_ICONS.default;
}

/**
 * Formatea un número con locale
 * @param {number} num - Número a formatear
 * @returns {string} Número formateado
 */
function formatNumber(num) {
    // Si el número no existe o es falsy, retorna '0'
    if (!num) return '0';
    // Retorna el número formateado según la localización es-CO (Colombia)
    return new Intl.NumberFormat('es-CO').format(num);
}

/**
 * Sanitiza HTML para prevenir XSS
 * @param {string} html - String HTML a sanitizar
 * @returns {string} HTML sanitizado
 */
function sanitizeHTML(html) {
    // Crea un elemento div temporal en memoria
    const temp = document.createElement('div');
    // Establece el texto del div (esto escapa automáticamente los caracteres HTML)
    temp.textContent = html;
    // Retorna el innerHTML que ahora está sanitizado (sin tags HTML ejecutables)
    return temp.innerHTML;
}

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 */
async function copyToClipboard(text) {
    try {
        // Intenta copiar el texto al portapapeles usando la API del navegador
        await navigator.clipboard.writeText(text);
        // Muestra un mensaje de éxito
        showToast('Copiado al portapapeles', 'success');
    } catch (err) {
        // Si hay un error, muestra un mensaje de error
        showToast('Error al copiar', 'error');
    }
}

/**
 * Verifica si el usuario está en un dispositivo móvil
 * @returns {boolean} True si es dispositivo móvil
 */
function isMobile() {
    // Verifica si el user agent del navegador coincide con algún dispositivo móvil conocido
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Genera un ID aleatorio
 * @returns {string} ID aleatorio
 */
function generateId() {
    // Convierte el timestamp actual a base 36 y concatena con un número aleatorio también en base 36
    // Esto crea un ID único basado en el tiempo y un componente aleatorio
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Inicializa tooltips (si agregas una librería de tooltips más adelante)
 */
function initTooltips() {
    // Placeholder para inicialización de tooltips
    // Registra en la consola que los tooltips fueron inicializados
    console.log('Tooltips initialized');
}

/**
 * Carga perezosa de imágenes
 * Carga las imágenes solo cuando entran en el viewport
 */
function lazyLoadImages() {
    // Obtiene todas las imágenes que tienen el atributo data-src (imágenes para carga perezosa)
    const images = document.querySelectorAll('img[data-src]');
    
    // Crea un IntersectionObserver para detectar cuando las imágenes entran en el viewport
    const imageObserver = new IntersectionObserver((entries, observer) => {
        // Itera sobre cada entrada observada
        entries.forEach(entry => {
            // Si la imagen está intersectando (visible en el viewport)
            if (entry.isIntersecting) {
                // Obtiene la imagen objetivo
                const img = entry.target;
                // Establece el src de la imagen con el valor de data-src
                img.src = img.dataset.src;
                // Remueve el atributo data-src ya que la imagen ya está cargada
                img.removeAttribute('data-src');
                // Deja de observar esta imagen
                observer.unobserve(img);
            }
        });
    });
    
    // Observa cada imagen para detectar cuando entra en el viewport
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Agrega un event listener con delegación
 * Permite agregar listeners a elementos que pueden no existir aún o a múltiples elementos
 * @param {string} selector - Selector CSS
 * @param {string} event - Nombre del evento
 * @param {function} handler - Manejador del evento
 */
function delegateEvent(selector, event, handler) {
    // Agrega un listener al documento que escucha el evento especificado
    document.addEventListener(event, (e) => {
        // Busca el elemento más cercano que coincida con el selector
        const target = e.target.closest(selector);
        // Si se encuentra un elemento que coincide
        if (target) {
            // Ejecuta el handler en el contexto del elemento encontrado
            handler.call(target, e);
        }
    });
}

/**
 * Inicializa animaciones de scroll
 * Agrega la clase 'visible' a los elementos cuando entran en el viewport
 */
function initScrollAnimations() {
    // Crea un IntersectionObserver para detectar cuando los elementos entran en el viewport
    const observer = new IntersectionObserver(
        // Callback que se ejecuta cuando los elementos entran o salen del viewport
        (entries) => {
            // Itera sobre cada entrada observada
            entries.forEach(entry => {
                // Si el elemento está intersectando (visible en el viewport)
                if (entry.isIntersecting) {
                    // Agrega la clase 'visible' al elemento para activar la animación
                    entry.target.classList.add('visible');
                }
            });
        },
        // Opciones del observer: threshold de 0.1 significa que se activa cuando el 10% del elemento es visible
        { threshold: 0.1 }
    );
    
    // Obtiene todos los elementos con la clase 'animate-on-scroll' y los observa
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Maneja el envío de formulario con validación
 * @param {string} formId - ID del formulario
 * @param {function} onSubmit - Manejador de envío
 */
function handleFormSubmit(formId, onSubmit) {
    // Obtiene el formulario por su ID
    const form = document.getElementById(formId);
    // Si el formulario no existe, termina la ejecución
    if (!form) return;
    
    // Agrega un listener al evento submit del formulario
    form.addEventListener('submit', async (e) => {
        // Previene el comportamiento por defecto del formulario (recargar página)
        e.preventDefault();
        
        // Crea un objeto FormData con los datos del formulario
        const formData = new FormData(form);
        // Convierte el FormData a un objeto JavaScript plano
        const data = Object.fromEntries(formData);
        
        // Deshabilita el botón de envío
        // Obtiene el botón de envío del formulario
        const submitBtn = form.querySelector('button[type="submit"]');
        // Si el botón existe
        if (submitBtn) {
            // Deshabilita el botón para evitar múltiples envíos
            submitBtn.disabled = true;
            // Cambia el texto del botón a 'Procesando...'
            submitBtn.textContent = 'Procesando...';
        }
        
        try {
            // Ejecuta la función de envío con los datos del formulario
            await onSubmit(data);
        } catch (error) {
            // Si hay un error, muestra un mensaje de error
            showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
        } finally {
            // Independientemente del resultado, rehabilita el botón
            if (submitBtn) {
                // Rehabilita el botón
                submitBtn.disabled = false;
                // Restaura el texto original del botón
                submitBtn.textContent = 'Enviar';
            }
        }
    });
}

/**
 * Agrega scroll suave al header cuando se hace scroll en la página
 * Cambia el estilo del header cuando se hace scroll hacia abajo
 */
function initHeaderScroll() {
    // Variable para almacenar la última posición de scroll
    let lastScroll = 0;
    // Obtiene el elemento del header
    const header = document.querySelector('.header');
    
    // Agrega un listener al evento scroll de la ventana
    window.addEventListener('scroll', () => {
        // Obtiene la posición actual de scroll
        const currentScroll = window.pageYOffset;
        
        // Si el scroll es mayor a 100 píxeles
        if (currentScroll > 100) {
            // Agrega la clase 'scrolled' al header para cambiar su estilo
            header.classList.add('scrolled');
        } else {
            // Si el scroll es menor a 100 píxeles, remueve la clase 'scrolled'
            header.classList.remove('scrolled');
        }
        
        // Actualiza la última posición de scroll
        lastScroll = currentScroll;
    });
}

/**
 * Convierte un archivo de imagen a Base64
 * @param {File} file - Archivo de imagen
 * @param {number} maxSizeMB - Tamaño máximo en MB (default: 2)
 * @returns {Promise<string>} - String Base64 de la imagen
 */
async function convertImageToBase64(file, maxSizeMB = 2) {
    // Retorna una Promise que se resuelve con el string Base64
    return new Promise((resolve, reject) => {
        // Validar tipo de archivo
        // Verifica si el tipo del archivo empieza con 'image/'
        if (!file.type.startsWith('image/')) {
            // Si no es una imagen, rechaza la Promise con un error
            reject(new Error('El archivo debe ser una imagen'));
            // Termina la ejecución
            return;
        }
        
        // Validar tamaño (maxSizeMB en MB)
        // Convierte el tamaño máximo de MB a bytes
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        // Verifica si el tamaño del archivo excede el máximo permitido
        if (file.size > maxSizeBytes) {
            // Si es demasiado grande, rechaza la Promise con un error
            reject(new Error(`La imagen es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`));
            // Termina la ejecución
            return;
        }
        
        // Crea un FileReader para leer el archivo
        const reader = new FileReader();
        
        // Cuando el archivo se carga exitosamente
        reader.onload = (e) => {
            // Resuelve la Promise con el resultado (string Base64)
            resolve(e.target.result);
        };
        
        // Si hay un error al leer el archivo
        reader.onerror = () => {
            // Rechaza la Promise con un error
            reject(new Error('Error al leer el archivo'));
        };
        
        // Lee el archivo como Data URL (Base64)
        reader.readAsDataURL(file);
    });
}

/**
 * Maneja la carga de una imagen y la convierte a Base64
 * @param {Event} event - Evento del input file
 * @param {string} previewId - ID del elemento donde mostrar la preview
 * @param {string} inputId - ID del input file
 */
async function handleImageUpload(event, previewId, inputId) {
    // Obtiene el archivo seleccionado del input
    const file = event.target.files[0];
    // Si no hay archivo, termina la ejecución
    if (!file) return;
    
    // Obtiene el elemento donde se mostrará la preview
    const previewElement = document.getElementById(previewId);
    // Obtiene el contenedor padre del elemento de preview
    const previewContainer = previewElement?.parentElement;
    // Obtiene el botón de eliminar imagen (por ID o por selector)
    const removeBtn = document.getElementById(inputId + 'Remove') || previewContainer?.querySelector('.image-remove-btn');
    // Obtiene el input hidden donde se guardará el Base64
    const base64Input = document.getElementById(inputId + 'Base64');
    
    // Verifica que los elementos necesarios existan
    if (!previewElement || !previewContainer) {
        // Si no existen, registra un error en la consola
        console.error('Elementos de preview no encontrados');
        // Termina la ejecución
        return;
    }
    
    try {
        // Mostrar loading
        // Muestra un indicador de carga mientras se procesa la imagen
        previewElement.innerHTML = '<div class="loader"></div><p>Procesando imagen...</p>';
        
        // Convertir a Base64
        // Convierte el archivo a string Base64 con tamaño máximo de 2MB
        const base64String = await convertImageToBase64(file, 2);
        
        // Guardar Base64 en input hidden
        // Si existe el input hidden, guarda el string Base64
        if (base64Input) {
            base64Input.value = base64String;
        }
        
        // Mostrar preview
        // Muestra la imagen en el elemento de preview
        previewElement.innerHTML = `<img src="${base64String}" alt="Preview">`;
        // Establece el padding a 0 para que la imagen se vea completa
        previewElement.style.padding = '0';
        
        // Mostrar botón de eliminar
        // Si existe el botón de eliminar, lo muestra
        if (removeBtn) {
            removeBtn.style.display = 'flex';
        }
        
        // Permitir click en preview para cambiar imagen
        // Hace que la preview sea clickeable para abrir el selector de archivo nuevamente
        previewElement.style.cursor = 'pointer';
        previewElement.onclick = () => document.getElementById(inputId).click();
        
    } catch (error) {
        // Si hay un error durante el procesamiento
        // Registra el error en la consola para depuración
        console.error('Error al procesar imagen:', error);
        // Muestra un mensaje de error al usuario
        showToast(error.message || 'Error al procesar la imagen', 'error');
        
        // Restaurar placeholder
        // Restaura el HTML del placeholder original
        previewElement.innerHTML = `
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p>Haz clic para subir una imagen</p>
            <p class="image-hint">Formatos: JPG, PNG, WEBP (máx. 2MB)</p>
        `;
        // Restaura el padding original
        previewElement.style.padding = '2rem';
        
        // Limpiar input
        // Limpia el valor del input file
        event.target.value = '';
        // Si existe el input hidden, también lo limpia
        if (base64Input) {
            base64Input.value = '';
        }
    }
}

/**
 * Elimina la imagen seleccionada
 * Restaura el estado inicial del input y preview
 * @param {string} inputId - ID del input file
 * @param {string} previewId - ID del elemento de preview
 */
function removeImage(inputId, previewId) {
    // Obtiene el input file
    const input = document.getElementById(inputId);
    // Obtiene el elemento de preview
    const previewElement = document.getElementById(previewId);
    // Obtiene el contenedor padre del elemento de preview
    const previewContainer = previewElement?.parentElement;
    // Obtiene el botón de eliminar imagen (por ID o por selector)
    const removeBtn = document.getElementById(inputId + 'Remove') || previewContainer?.querySelector('.image-remove-btn');
    // Obtiene el input hidden donde se guarda el Base64
    const base64Input = document.getElementById(inputId + 'Base64');
    
    // Si existe el input file, limpia su valor
    if (input) input.value = '';
    // Si existe el input hidden, limpia su valor
    if (base64Input) base64Input.value = '';
    
    // Si existe el elemento de preview
    if (previewElement) {
        // Restaura el HTML del placeholder original
        previewElement.innerHTML = `
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p>Haz clic para subir una imagen</p>
            <p class="image-hint">Formatos: JPG, PNG, WEBP (máx. 2MB)</p>
        `;
        // Restaura el padding original
        previewElement.style.padding = '2rem';
        // Hace que la preview sea clickeable para abrir el selector de archivo
        previewElement.style.cursor = 'pointer';
        previewElement.onclick = () => document.getElementById(inputId).click();
    }
    
    // Si existe el botón de eliminar, lo oculta
    if (removeBtn) {
        removeBtn.style.display = 'none';
    }
}

// Exportar funciones globalmente
// Hace la función handleImageUpload disponible globalmente a través de window
window.handleImageUpload = handleImageUpload;
// Hace la función removeImage disponible globalmente a través de window
window.removeImage = removeImage;
// Hace la función convertImageToBase64 disponible globalmente a través de window
window.convertImageToBase64 = convertImageToBase64;

// Inicializa cuando el DOM está listo
// Verifica si el documento está cargando
if (document.readyState === 'loading') {
    // Si está cargando, espera a que el evento 'DOMContentLoaded' se dispare
    document.addEventListener('DOMContentLoaded', () => {
        // Inicializa el comportamiento de scroll del header
        initHeaderScroll();
        // Inicializa la carga perezosa de imágenes
        lazyLoadImages();
    });
} else {
    // Si el DOM ya está listo, ejecuta directamente
    // Inicializa el comportamiento de scroll del header
    initHeaderScroll();
    // Inicializa la carga perezosa de imágenes
    lazyLoadImages();
}