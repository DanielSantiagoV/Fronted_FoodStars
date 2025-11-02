/**
 * FoodieRank - Configuration
 * Global configuration and constants
 */

const CONFIG = {
    // API Configuration
    API_URL: 'http://localhost:3000/api/v1',
    API_TIMEOUT: 10000, // 10 seconds
    
    // Storage Keys
    STORAGE_KEYS: {
        TOKEN: 'foodierank_token',
        USER: 'foodierank_user',
        THEME: 'foodierank_theme'
    },
    
    // Pagination
    PAGINATION: {
        DEFAULT_LIMIT: 12,
        MAX_LIMIT: 50
    },
    
    // Validation Rules
    VALIDATION: {
        PASSWORD_MIN_LENGTH: 8,
        USERNAME_MIN_LENGTH: 3,
        REVIEW_MIN_LENGTH: 10,
        REVIEW_MAX_LENGTH: 1000
    },
    
    // Rating
    RATING: {
        MIN: 1,
        MAX: 5
    },
    
    // Toast Duration
    TOAST_DURATION: 5000, // 5 seconds
    
    // Category Icons Map
    CATEGORY_ICONS: {
        'Comida rápida': '🍔',
        'Gourmet': '🍷',
        'Vegetariano': '🥗',
        'Vegano': '🌱',
        'Sushi': '🍣',
        'Italiana': '🍕',
        'Mexicana': '🌮',
        'China': '🥡',
        'Japonesa': '🍱',
        'Mediterránea': '🫒',
        'Asiática': '🍜',
        'Americana': '🍔',
        'Francesa': '🥖',
        'India': '🍛',
        'Árabe': '🥙',
        'Peruana': '🍤',
        'Colombiana': '🫔',
        'Postres': '🍰',
        'Cafetería': '☕',
        'Panadería': '🥐',
        'Bar': '🍺',
        'Mariscos': '🦞',
        'Carnes': '🥩',
        'default': '🍽️'
    },
    
    // User Roles
    ROLES: {
        USER: 'usuario',
        ADMIN: 'admin'  // Cambiado para coincidir con backend
    },
    
    // Status Messages
    MESSAGES: {
        SUCCESS: {
            LOGIN: 'Inicio de sesión exitoso',
            LOGOUT: 'Sesión cerrada correctamente',
            REGISTER: 'Registro exitoso. ¡Bienvenido!',
            REVIEW_CREATED: 'Reseña publicada exitosamente',
            REVIEW_UPDATED: 'Reseña actualizada correctamente',
            REVIEW_DELETED: 'Reseña eliminada correctamente',
            RESTAURANT_CREATED: 'Restaurante creado exitosamente',
            RESTAURANT_UPDATED: 'Restaurante actualizado correctamente',
            RESTAURANT_DELETED: 'Restaurante eliminado correctamente',
            CATEGORY_CREATED: 'Categoría creada exitosamente',
            CATEGORY_UPDATED: 'Categoría actualizada correctamente',
            CATEGORY_DELETED: 'Categoría eliminada correctamente'
        },
        ERROR: {
            GENERIC: 'Ha ocurrido un error. Por favor intenta de nuevo.',
            NETWORK: 'Error de conexión. Verifica tu internet.',
            UNAUTHORIZED: 'No tienes autorización para esta acción.',
            NOT_FOUND: 'Recurso no encontrado.',
            VALIDATION: 'Por favor verifica los datos ingresados.',
            SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.'
        }
    }
};

// Make CONFIG globally accessible
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}