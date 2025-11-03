/**
 * FoodieRank - Configuration
 * Global configuration and constants
 */

// Define el objeto de configuración global con todas las constantes y valores por defecto de la aplicación
const CONFIG = {
    // Configuración de la API - Define la URL base y timeout para las peticiones
    // URL base donde se encuentra el servidor backend
    API_URL: 'http://localhost:3000/api/v1',
    // Tiempo máximo de espera para las peticiones API en milisegundos (10 segundos)
    API_TIMEOUT: 10000, // 10 seconds
    
    // Claves de almacenamiento local - Nombres de las claves usadas en localStorage
    STORAGE_KEYS: {
        // Clave para almacenar el token de autenticación del usuario
        TOKEN: 'foodierank_token',
        // Clave para almacenar los datos del usuario autenticado
        USER: 'foodierank_user',
        // Clave para almacenar el tema preferido del usuario (claro/oscuro)
        THEME: 'foodierank_theme'
    },
    
    // Configuración de paginación - Valores por defecto para paginar resultados
    PAGINATION: {
        // Número por defecto de elementos a mostrar por página
        DEFAULT_LIMIT: 12,
        // Número máximo permitido de elementos por página
        MAX_LIMIT: 50
    },
    
    // Reglas de validación - Longitudes mínimas y máximas para diferentes campos
    VALIDATION: {
        // Longitud mínima requerida para contraseñas
        PASSWORD_MIN_LENGTH: 8,
        // Longitud mínima requerida para nombres de usuario
        USERNAME_MIN_LENGTH: 3,
        // Longitud mínima requerida para comentarios en reseñas
        REVIEW_MIN_LENGTH: 10,
        // Longitud máxima permitida para comentarios en reseñas
        REVIEW_MAX_LENGTH: 1000
    },
    
    // Configuración de calificaciones - Rango válido para las estrellas
    RATING: {
        // Valor mínimo de calificación (1 estrella)
        MIN: 1,
        // Valor máximo de calificación (5 estrellas)
        MAX: 5
    },
    
    // Duración de las notificaciones toast - Tiempo que se muestran las notificaciones
    TOAST_DURATION: 5000, // 5 seconds
    
    // Mapa de iconos por categoría - Asocia cada nombre de categoría con un emoji
    CATEGORY_ICONS: {
        // Icono para la categoría de comida rápida
        'Comida rápida': '🍔',
        // Icono para la categoría gourmet
        'Gourmet': '🍷',
        // Icono para la categoría vegetariana
        'Vegetariano': '🥗',
        // Icono para la categoría vegana
        'Vegano': '🌱',
        // Icono para la categoría de sushi
        'Sushi': '🍣',
        // Icono para la categoría italiana
        'Italiana': '🍕',
        // Icono para la categoría mexicana
        'Mexicana': '🌮',
        // Icono para la categoría china
        'China': '🥡',
        // Icono para la categoría japonesa
        'Japonesa': '🍱',
        // Icono para la categoría mediterránea
        'Mediterránea': '🫒',
        // Icono para la categoría asiática
        'Asiática': '🍜',
        // Icono para la categoría americana
        'Americana': '🍔',
        // Icono para la categoría francesa
        'Francesa': '🥖',
        // Icono para la categoría india
        'India': '🍛',
        // Icono para la categoría árabe
        'Árabe': '🥙',
        // Icono para la categoría peruana
        'Peruana': '🍤',
        // Icono para la categoría colombiana
        'Colombiana': '🫔',
        // Icono para la categoría de postres
        'Postres': '🍰',
        // Icono para la categoría de cafetería
        'Cafetería': '☕',
        // Icono para la categoría de panadería
        'Panadería': '🥐',
        // Icono para la categoría de bar
        'Bar': '🍺',
        // Icono para la categoría de mariscos
        'Mariscos': '🦞',
        // Icono para la categoría de carnes
        'Carnes': '🥩',
        // Icono por defecto cuando no se encuentra una categoría específica
        'default': '🍽️'
    },
    
    // Roles de usuario - Tipos de usuarios en el sistema
    ROLES: {
        // Rol de usuario normal
        USER: 'usuario',
        // Rol de administrador - Cambiado para coincidir con backend
        ADMIN: 'admin'  // Cambiado para coincidir con backend
    },
    
    // Mensajes del sistema - Textos que se muestran al usuario en diferentes situaciones
    MESSAGES: {
        // Mensajes de éxito - Se muestran cuando una operación se completa correctamente
        SUCCESS: {
            // Mensaje cuando el login es exitoso
            LOGIN: 'Inicio de sesión exitoso',
            // Mensaje cuando el logout es exitoso
            LOGOUT: 'Sesión cerrada correctamente',
            // Mensaje cuando el registro de nuevo usuario es exitoso
            REGISTER: 'Registro exitoso. ¡Bienvenido!',
            // Mensaje cuando se crea una reseña exitosamente
            REVIEW_CREATED: 'Reseña publicada exitosamente',
            // Mensaje cuando se actualiza una reseña exitosamente
            REVIEW_UPDATED: 'Reseña actualizada correctamente',
            // Mensaje cuando se elimina una reseña exitosamente
            REVIEW_DELETED: 'Reseña eliminada correctamente',
            // Mensaje cuando se crea un restaurante exitosamente
            RESTAURANT_CREATED: 'Restaurante creado exitosamente',
            // Mensaje cuando se actualiza un restaurante exitosamente
            RESTAURANT_UPDATED: 'Restaurante actualizado correctamente',
            // Mensaje cuando se elimina un restaurante exitosamente
            RESTAURANT_DELETED: 'Restaurante eliminado correctamente',
            // Mensaje cuando se crea una categoría exitosamente
            CATEGORY_CREATED: 'Categoría creada exitosamente',
            // Mensaje cuando se actualiza una categoría exitosamente
            CATEGORY_UPDATED: 'Categoría actualizada correctamente',
            // Mensaje cuando se elimina una categoría exitosamente
            CATEGORY_DELETED: 'Categoría eliminada correctamente'
        },
        // Mensajes de error - Se muestran cuando ocurre un error
        ERROR: {
            // Mensaje genérico para errores no especificados
            GENERIC: 'Ha ocurrido un error. Por favor intenta de nuevo.',
            // Mensaje cuando hay problemas de conexión a internet
            NETWORK: 'Error de conexión. Verifica tu internet.',
            // Mensaje cuando el usuario no tiene permisos para realizar una acción
            UNAUTHORIZED: 'No tienes autorización para esta acción.',
            // Mensaje cuando no se encuentra un recurso solicitado
            NOT_FOUND: 'Recurso no encontrado.',
            // Mensaje cuando los datos ingresados no son válidos
            VALIDATION: 'Por favor verifica los datos ingresados.',
            // Mensaje cuando la sesión del usuario ha expirado
            SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.'
        }
    }
};

// Hacer CONFIG accesible globalmente - Disponible en el objeto window si estamos en un navegador
// Make CONFIG globally accessible
if (typeof window !== 'undefined') {
    // Asigna CONFIG al objeto window para que esté disponible globalmente en el navegador
    window.CONFIG = CONFIG;
}

// Exportar la configuración - Disponible en Node.js si se requiere como módulo
// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    // Exporta CONFIG como módulo para uso en Node.js
    module.exports = CONFIG;
}
