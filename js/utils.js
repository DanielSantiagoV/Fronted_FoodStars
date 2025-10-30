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