/**
 * FoodieRank - Utility Functions
 * Helper functions used across the application
 */

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    // Remove existing classes
    toast.className = 'toast';
    
    // Add type class
    toast.classList.add(type, 'show');
    
    // Set icon based on type
    const iconMap = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    
    const titleMap = {
        success: 'Éxito',
        error: 'Error',
        warning: 'Advertencia',
        info: 'Información'
    };
    
    // Set content
    const icon = toast.querySelector('.toast-icon');
    const title = toast.querySelector('.toast-title');
    const messageEl = toast.querySelector('.toast-message');
    
    if (icon) icon.textContent = iconMap[type] || iconMap.info;
    if (title) title.textContent = titleMap[type] || titleMap.info;
    if (messageEl) messageEl.textContent = message;
    
    // Auto hide
    setTimeout(() => {
        hideToast();
    }, duration);
}

/**
 * Hide toast notification
 */
function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('show');
    }
}

/**
 * Format date to locale string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format relative time (e.g., "hace 2 días")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
function formatRelativeTime(date) {
    if (!date) return '';
    
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffSecs < 60) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 30) return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    if (diffMonths < 12) return `Hace ${diffMonths} mes${diffMonths !== 1 ? 'es' : ''}`;
    return `Hace ${diffYears} año${diffYears !== 1 ? 's' : ''}`;
}

/**
 * Generate star rating HTML
 * @param {number} rating - Rating value (1-5)
 * @param {number} maxStars - Maximum number of stars
 * @returns {string} HTML string with stars
 */
function generateStars(rating, maxStars = 5) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
    
    let html = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        html += '⭐';
    }
    
    // Half star
    if (hasHalfStar) {
        html += '⭐'; // Using full star for simplicity
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        html += '☆';
    }
    
    return html;
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
function validatePassword(password) {
    if (!password || password.length < CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
        return {
            isValid: false,
            message: `La contraseña debe tener al menos ${CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} caracteres`
        };
    }
    
    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            message: 'La contraseña debe contener al menos una letra mayúscula'
        };
    }
    
    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            message: 'La contraseña debe contener al menos una letra minúscula'
        };
    }
    
    if (!/[0-9]/.test(password)) {
        return {
            isValid: false,
            message: 'La contraseña debe contener al menos un número'
        };
    }
    
    return { isValid: true, message: 'Contraseña válida' };
}

/**
 * Get query parameters from URL
 * @returns {object} Object with query parameters
 */
function getQueryParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    
    for (const [key, value] of searchParams) {
        params[key] = value;
    }
    
    return params;
}

/**
 * Update URL with query parameters without reloading
 * @param {object} params - Parameters to add to URL
 */
function updateQueryParams(params) {
    const url = new URL(window.location);
    
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    
    window.history.pushState({}, '', url);
}

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Scroll to element smoothly
 * @param {string} elementId - ID of element to scroll to
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Get category icon
 * @param {string} categoryName - Name of category
 * @returns {string} Icon emoji
 */
function getCategoryIcon(categoryName) {
    return CONFIG.CATEGORY_ICONS[categoryName] || CONFIG.CATEGORY_ICONS.default;
}

/**
 * Format number with locale
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    if (!num) return '0';
    return new Intl.NumberFormat('es-CO').format(num);
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
function sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copiado al portapapeles', 'success');
    } catch (err) {
        showToast('Error al copiar', 'error');
    }
}

/**
 * Check if user is mobile
 * @returns {boolean} True if mobile device
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Generate random ID
 * @returns {string} Random ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Initialize tooltips (if you add tooltip library later)
 */
function initTooltips() {
    // Placeholder for tooltip initialization
    console.log('Tooltips initialized');
}

/**
 * Lazy load images
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Add event listener with delegation
 * @param {string} selector - CSS selector
 * @param {string} event - Event name
 * @param {function} handler - Event handler
 */
function delegateEvent(selector, event, handler) {
    document.addEventListener(event, (e) => {
        const target = e.target.closest(selector);
        if (target) {
            handler.call(target, e);
        }
    });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1 }
    );
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Handle form submission with validation
 * @param {string} formId - Form ID
 * @param {function} onSubmit - Submit handler
 */
function handleFormSubmit(formId, onSubmit) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Procesando...';
        }
        
        try {
            await onSubmit(data);
        } catch (error) {
            showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar';
            }
        }
    });
}

/**
 * Add smooth scroll to header on page scroll
 */
function initHeaderScroll() {
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
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
    return new Promise((resolve, reject) => {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            reject(new Error('El archivo debe ser una imagen'));
            return;
        }
        
        // Validar tamaño (maxSizeMB en MB)
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            reject(new Error(`La imagen es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        
        reader.onerror = () => {
            reject(new Error('Error al leer el archivo'));
        };
        
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
    const file = event.target.files[0];
    if (!file) return;
    
    const previewElement = document.getElementById(previewId);
    const previewContainer = previewElement?.parentElement;
    const removeBtn = document.getElementById(inputId + 'Remove') || previewContainer?.querySelector('.image-remove-btn');
    const base64Input = document.getElementById(inputId + 'Base64');
    
    if (!previewElement || !previewContainer) {
        console.error('Elementos de preview no encontrados');
        return;
    }
    
    try {
        // Mostrar loading
        previewElement.innerHTML = '<div class="loader"></div><p>Procesando imagen...</p>';
        
        // Convertir a Base64
        const base64String = await convertImageToBase64(file, 2);
        
        // Guardar Base64 en input hidden
        if (base64Input) {
            base64Input.value = base64String;
        }
        
        // Mostrar preview
        previewElement.innerHTML = `<img src="${base64String}" alt="Preview">`;
        previewElement.style.padding = '0';
        
        // Mostrar botón de eliminar
        if (removeBtn) {
            removeBtn.style.display = 'flex';
        }
        
        // Permitir click en preview para cambiar imagen
        previewElement.style.cursor = 'pointer';
        previewElement.onclick = () => document.getElementById(inputId).click();
        
    } catch (error) {
        console.error('Error al procesar imagen:', error);
        showToast(error.message || 'Error al procesar la imagen', 'error');
        
        // Restaurar placeholder
        previewElement.innerHTML = `
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p>Haz clic para subir una imagen</p>
            <p class="image-hint">Formatos: JPG, PNG, WEBP (máx. 2MB)</p>
        `;
        previewElement.style.padding = '2rem';
        
        // Limpiar input
        event.target.value = '';
        if (base64Input) {
            base64Input.value = '';
        }
    }
}

/**
 * Elimina la imagen seleccionada
 * @param {string} inputId - ID del input file
 * @param {string} previewId - ID del elemento de preview
 */
function removeImage(inputId, previewId) {
    const input = document.getElementById(inputId);
    const previewElement = document.getElementById(previewId);
    const previewContainer = previewElement?.parentElement;
    const removeBtn = document.getElementById(inputId + 'Remove') || previewContainer?.querySelector('.image-remove-btn');
    const base64Input = document.getElementById(inputId + 'Base64');
    
    if (input) input.value = '';
    if (base64Input) base64Input.value = '';
    
    if (previewElement) {
        previewElement.innerHTML = `
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p>Haz clic para subir una imagen</p>
            <p class="image-hint">Formatos: JPG, PNG, WEBP (máx. 2MB)</p>
        `;
        previewElement.style.padding = '2rem';
        previewElement.style.cursor = 'pointer';
        previewElement.onclick = () => document.getElementById(inputId).click();
    }
    
    if (removeBtn) {
        removeBtn.style.display = 'none';
    }
}

// Exportar funciones globalmente
window.handleImageUpload = handleImageUpload;
window.removeImage = removeImage;
window.convertImageToBase64 = convertImageToBase64;

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initHeaderScroll();
        lazyLoadImages();
    });
} else {
    initHeaderScroll();
    lazyLoadImages();
}