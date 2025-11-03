/**
 * FoodieRank - API Client
 * Handles all API requests to the backend
 */

// Función auxiliar para obtener CONFIG de manera segura
// Helper function to safely get CONFIG
function getConfig() {
    // Verifica si estamos en un navegador (window existe) y CONFIG está en window
    if (typeof window !== 'undefined' && window.CONFIG) {
        // Retorna CONFIG desde el objeto window
        return window.CONFIG;
    }
    // Si CONFIG está definido globalmente (no en window)
    if (typeof CONFIG !== 'undefined') {
        // Retorna CONFIG directamente
        return CONFIG;
    }
    // Si CONFIG no está disponible, lanza un error
    throw new Error('CONFIG no está definido. Asegúrate de cargar config.js antes de api.js');
}

// Clase que encapsula todas las operaciones de API
class APIClient {
    // Constructor de la clase APIClient
    constructor(baseURL) {
        // Asigna la URL base del API a la propiedad de la instancia
        this.baseURL = baseURL;
    }

    /**
     * Obtiene los headers de autorización
     * Crea los headers HTTP necesarios incluyendo el token de autenticación si existe
     * @returns {object} Headers con token si está disponible
     */
    getHeaders() {
        // Crea un objeto de headers básico con Content-Type JSON
        const headers = {
            'Content-Type': 'application/json'
        };

        // Obtiene la configuración usando la función auxiliar
        const config = getConfig();
        // Obtiene el token de autenticación del almacenamiento local
        const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
        // Si existe un token
        if (token) {
            // Agrega el header de autorización con el formato Bearer token
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Retorna los headers configurados
        return headers;
    }

    /**
     * Make HTTP request
     * @param {string} endpoint - API endpoint
     * @param {object} options - Fetch options
     * @returns {Promise} Response data
     */
    /**
     * Realiza una petición HTTP
     * Método base que maneja todas las peticiones al backend con manejo de errores
     * @param {string} endpoint - Endpoint del API
     * @param {object} options - Opciones de fetch (method, body, headers, etc.)
     * @returns {Promise} Datos de la respuesta
     */
    async request(endpoint, options = {}) {
        // Construye la URL completa combinando la URL base con el endpoint
        const url = `${this.baseURL}${endpoint}`;
        // Crea la configuración de fetch combinando opciones por defecto con las proporcionadas
        const config = {
            // Copia todas las opciones proporcionadas
            ...options,
            // Combina los headers por defecto (con token) con los headers proporcionados
            headers: {
                // Primero los headers por defecto (incluye autorización si hay token)
                ...this.getHeaders(),
                // Luego los headers personalizados (sobrescriben los por defecto si hay conflicto)
                ...options.headers
            }
        };

        try {
            // Realiza la petición HTTP usando fetch con la URL y configuración
            const response = await fetch(url, config);
            
            // Verificar si la respuesta tiene contenido antes de parsear JSON
            // Obtiene el tipo de contenido de los headers de la respuesta
            const contentType = response.headers.get('content-type');
            // Verifica si el contenido es JSON
            const hasJsonContent = contentType && contentType.includes('application/json');
            // Verifica si hay cuerpo en la respuesta (204 y 304 no tienen cuerpo)
            const hasBody = response.status !== 204 && response.status !== 304;
            
            // Variable para almacenar los datos parseados
            let data = null;
            
            // Solo intentar parsear JSON si hay contenido y es tipo JSON
            if (hasBody && hasJsonContent) {
                try {
                    // Obtiene el texto de la respuesta
                    const text = await response.text();
                    // Si el texto no está vacío, parsea como JSON
                    if (text.trim()) {
                        data = JSON.parse(text);
                    }
                } catch (parseError) {
                    // Si falla el parsing, pero el status es ok, devolver un objeto vacío
                    if (response.ok) {
                        data = { success: true };
                    } else {
                        // Si hay error y no se puede parsear, crear un objeto de error
                        throw new Error('Respuesta del servidor no válida');
                    }
                }
            } else if (response.ok && response.status === 204) {
                // Respuesta 204 (No Content) - éxito sin contenido
                data = { success: true, message: 'Operación exitosa' };
            }

            // Si la respuesta no fue exitosa
            if (!response.ok) {
                // Manejar casos específicos de error
                const config = getConfig();
                // Si el error es 401 (No autorizado)
                if (response.status === 401) {
                    // No autorizado - limpia autenticación y redirige
                    // Elimina el token del almacenamiento local
                    localStorage.removeItem(config.STORAGE_KEYS.TOKEN);
                    // Elimina los datos del usuario del almacenamiento local
                    localStorage.removeItem(config.STORAGE_KEYS.USER);
                    
                    // Obtiene la ruta actual del navegador
                    const currentPath = window.location.pathname;
                    // Si no estamos en la página de autenticación o inicio
                    if (!currentPath.includes('/auth.html') && !currentPath.includes('/index.html')) {
                        // Muestra un mensaje de error indicando que la sesión expiró
                        showToast(config.MESSAGES.ERROR.SESSION_EXPIRED, 'error');
                        
                        // Determina la ruta correcta a auth.html basada en la ubicación actual
                        const authUrl = currentPath.includes('/html/') 
                            ? './auth.html' 
                            : 'html/auth.html';
                        
                        // Espera 2 segundos antes de redirigir
                        setTimeout(() => {
                            // Redirige a la página de autenticación
                            window.location.href = authUrl;
                        }, 2000);
                    }
                }

                // Construye el mensaje de error desde diferentes fuentes posibles
                const errorMessage = data?.message || data?.error || 
                    // Si es 404, mensaje específico
                    (response.status === 404 ? 'Recurso no encontrado' : null) ||
                    // Si no hay mensaje específico, usa el mensaje genérico de error
                    config.MESSAGES.ERROR.GENERIC;
                // Lanza un error con el mensaje determinado
                throw new Error(errorMessage);
            }

            // Si no hay data pero la respuesta es exitosa, devolver un objeto de éxito
            if (!data && response.ok) {
                data = { success: true };
            }

            // Retorna los datos parseados o el objeto de éxito
            return data;
        } catch (error) {
            // Si el error es de red (fallo al hacer fetch)
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                // Obtiene la configuración
                const config = getConfig();
                // Lanza un error con el mensaje de error de red configurado
                throw new Error(config.MESSAGES.ERROR.NETWORK);
            }
            // Si es otro tipo de error, lo relanza
            throw error;
        }
    }

    // ==================== AUTH ENDPOINTS ====================
    // Endpoints relacionados con autenticación de usuarios

    /**
     * Registra un nuevo usuario
     * @param {object} userData - Datos de registro del usuario
     */
    async register(userData) {
        // Realiza una petición POST al endpoint de registro
        return this.request('/usuarios/registro', {
            method: 'POST',
            // Convierte los datos del usuario a JSON para enviarlos en el cuerpo
            body: JSON.stringify(userData)
        });
    }

    /**
     * Inicia sesión de usuario
     * @param {object} credentials - Credenciales de login (email y password)
     */
    async login(credentials) {
        // Realiza una petición POST al endpoint de login
        return this.request('/usuarios/login', {
            method: 'POST',
            // Convierte las credenciales a JSON para enviarlas en el cuerpo
            body: JSON.stringify(credentials)
        });
    }

    /**
     * Obtiene el perfil del usuario actual
     * Requiere que el usuario esté autenticado
     */
    async getProfile() {
        // Realiza una petición GET al endpoint de perfil (usa headers de autorización)
        return this.request('/usuarios/perfil');
    }

    /**
     * Actualiza el perfil del usuario
     * @param {object} userData - Datos actualizados del usuario
     */
    async updateProfile(userData) {
        // Realiza una petición PUT al endpoint de perfil para actualizar
        return this.request('/usuarios/perfil', {
            method: 'PUT',
            // Convierte los datos actualizados a JSON para enviarlos en el cuerpo
            body: JSON.stringify(userData)
        });
    }

    // ==================== RESTAURANTS ENDPOINTS ====================

    /**
     * Get all restaurants with filters
     * @param {object} params - Query parameters
     */
    /**
     * Obtiene todos los restaurantes con filtros
     * @param {object} params - Parámetros de consulta (búsqueda, filtros, paginación)
     */
    async getRestaurants(params = {}) {
        // Convierte los parámetros a una cadena de consulta URL
        const queryString = new URLSearchParams(params).toString();
        // Realiza una petición GET al endpoint de restaurantes con los parámetros de consulta
        return this.request(`/restaurantes${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Obtiene un restaurante por su ID
     * @param {string} id - ID del restaurante
     */
    async getRestaurant(id) {
        // Realiza una petición GET al endpoint específico del restaurante
        return this.request(`/restaurantes/${id}`);
    }

    /**
     * Crea un nuevo restaurante
     * @param {object} restaurantData - Datos del restaurante a crear
     */
    async createRestaurant(restaurantData) {
        // Realiza una petición POST al endpoint de restaurantes
        return this.request('/restaurantes', {
            method: 'POST',
            // Convierte los datos del restaurante a JSON para enviarlos en el cuerpo
            body: JSON.stringify(restaurantData)
        });
    }

    /**
     * Actualiza un restaurante existente
     * @param {string} id - ID del restaurante a actualizar
     * @param {object} restaurantData - Datos actualizados del restaurante
     */
    async updateRestaurant(id, restaurantData) {
        // Realiza una petición PUT al endpoint específico del restaurante
        return this.request(`/restaurantes/${id}`, {
            method: 'PUT',
            // Convierte los datos actualizados a JSON para enviarlos en el cuerpo
            body: JSON.stringify(restaurantData)
        });
    }

    /**
     * Elimina un restaurante
     * @param {string} id - ID del restaurante a eliminar
     */
    async deleteRestaurant(id) {
        // Realiza una petición DELETE al endpoint específico del restaurante
        return this.request(`/restaurantes/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Aprueba un restaurante (solo administradores)
     * @param {string} id - ID del restaurante a aprobar
     */
    async approveRestaurant(id) {
        // Realiza una petición PATCH al endpoint de aprobación del restaurante
        return this.request(`/restaurantes/${id}/aprobar`, {
            method: 'PATCH'
        });
    }

    /**
     * Obtiene los platos de un restaurante
     * @param {string} restaurantId - ID del restaurante
     */
    async getRestaurantDishes(restaurantId) {
        // Realiza una petición GET al endpoint de platos filtrado por restaurante
        return this.request(`/platos/restaurante/${restaurantId}`);
    }

    // ==================== DISHES ENDPOINTS ====================
    // Endpoints relacionados con platos/comidas

    /**
     * Obtiene todos los platos
     * @param {object} params - Parámetros de consulta (filtros, paginación)
     */
    async getDishes(params = {}) {
        // Convierte los parámetros a una cadena de consulta URL
        const queryString = new URLSearchParams(params).toString();
        // Realiza una petición GET al endpoint de platos con los parámetros de consulta
        return this.request(`/platos${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Obtiene un plato por su ID
     * @param {string} id - ID del plato
     */
    async getDish(id) {
        // Realiza una petición GET al endpoint específico del plato
        return this.request(`/platos/${id}`);
    }

    /**
     * Crea un nuevo plato
     * @param {object} dishData - Datos del plato a crear
     */
    async createDish(dishData) {
        // Realiza una petición POST al endpoint de platos
        return this.request('/platos', {
            method: 'POST',
            // Convierte los datos del plato a JSON para enviarlos en el cuerpo
            body: JSON.stringify(dishData)
        });
    }

    /**
     * Actualiza un plato existente
     * @param {string} id - ID del plato a actualizar
     * @param {object} dishData - Datos actualizados del plato
     */
    async updateDish(id, dishData) {
        // Realiza una petición PUT al endpoint específico del plato
        return this.request(`/platos/${id}`, {
            method: 'PUT',
            // Convierte los datos actualizados a JSON para enviarlos en el cuerpo
            body: JSON.stringify(dishData)
        });
    }

    /**
     * Elimina un plato
     * @param {string} id - ID del plato a eliminar
     */
    async deleteDish(id) {
        // Realiza una petición DELETE al endpoint específico del plato
        return this.request(`/platos/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== REVIEWS ENDPOINTS ====================
    // Endpoints relacionados con reseñas/calificaciones

    /**
     * Obtiene todas las reseñas
     * @param {object} params - Parámetros de consulta (filtros, paginación)
     */
    async getReviews(params = {}) {
        // Convierte los parámetros a una cadena de consulta URL
        const queryString = new URLSearchParams(params).toString();
        // Realiza una petición GET al endpoint de reseñas con los parámetros de consulta
        return this.request(`/resenas${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Obtiene una reseña por su ID
     * @param {string} id - ID de la reseña
     */
    async getReview(id) {
        // Realiza una petición GET al endpoint específico de la reseña
        return this.request(`/resenas/${id}`);
    }

    /**
     * Obtiene las reseñas de un restaurante
     * @param {string} restaurantId - ID del restaurante
     */
    async getRestaurantReviews(restaurantId) {
        // Realiza una petición GET al endpoint de reseñas filtrado por restaurante
        return this.request(`/resenas/restaurante/${restaurantId}`);
    }

    /**
     * Crea una nueva reseña
     * @param {object} reviewData - Datos de la reseña a crear
     */
    async createReview(reviewData) {
        // Realiza una petición POST al endpoint de reseñas
        return this.request('/resenas', {
            method: 'POST',
            // Convierte los datos de la reseña a JSON para enviarlos en el cuerpo
            body: JSON.stringify(reviewData)
        });
    }

    /**
     * Actualiza una reseña existente
     * @param {string} id - ID de la reseña a actualizar
     * @param {object} reviewData - Datos actualizados de la reseña
     */
    async updateReview(id, reviewData) {
        // Realiza una petición PUT al endpoint específico de la reseña
        return this.request(`/resenas/${id}`, {
            method: 'PUT',
            // Convierte los datos actualizados a JSON para enviarlos en el cuerpo
            body: JSON.stringify(reviewData)
        });
    }

    /**
     * Elimina una reseña
     * @param {string} id - ID de la reseña a eliminar
     */
    async deleteReview(id) {
        // Realiza una petición DELETE al endpoint específico de la reseña
        return this.request(`/resenas/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Da like a una reseña (toggle - si ya tiene like, lo remueve)
     * @param {string} id - ID de la reseña
     */
    async likeReview(id) {
        // Realiza una petición POST al endpoint de like de la reseña
        return this.request(`/resenas/${id}/like`, {
            method: 'POST'
        });
    }

    /**
     * Da dislike a una reseña (toggle - si ya tiene dislike, lo remueve)
     * @param {string} id - ID de la reseña
     */
    async dislikeReview(id) {
        // Realiza una petición POST al endpoint de dislike de la reseña
        return this.request(`/resenas/${id}/dislike`, {
            method: 'POST'
        });
    }

    // ==================== CATEGORIES ENDPOINTS ====================
    // Endpoints relacionados con categorías de restaurantes

    /**
     * Obtiene todas las categorías
     */
    async getCategories() {
        // Realiza una petición GET al endpoint de categorías
        return this.request('/categorias');
    }

    /**
     * Obtiene una categoría por su ID
     * @param {string} id - ID de la categoría
     */
    async getCategory(id) {
        // Realiza una petición GET al endpoint específico de la categoría
        return this.request(`/categorias/${id}`);
    }

    /**
     * Crea una nueva categoría (solo administradores)
     * @param {object} categoryData - Datos de la categoría a crear
     */
    async createCategory(categoryData) {
        // Realiza una petición POST al endpoint de categorías
        return this.request('/categorias', {
            method: 'POST',
            // Convierte los datos de la categoría a JSON para enviarlos en el cuerpo
            body: JSON.stringify(categoryData)
        });
    }

    /**
     * Actualiza una categoría existente (solo administradores)
     * @param {string} id - ID de la categoría a actualizar
     * @param {object} categoryData - Datos actualizados de la categoría
     */
    async updateCategory(id, categoryData) {
        // Realiza una petición PUT al endpoint específico de la categoría
        return this.request(`/categorias/${id}`, {
            method: 'PUT',
            // Convierte los datos actualizados a JSON para enviarlos en el cuerpo
            body: JSON.stringify(categoryData)
        });
    }

    /**
     * Elimina una categoría (solo administradores)
     * @param {string} id - ID de la categoría a eliminar
     */
    async deleteCategory(id) {
        // Realiza una petición DELETE al endpoint específico de la categoría
        return this.request(`/categorias/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== RANKINGS ENDPOINTS ====================
    // Endpoints relacionados con rankings y clasificaciones

    /**
     * Obtiene el ranking de restaurantes
     * @param {object} params - Parámetros de consulta (límite, orden, etc.)
     */
    async getRankings(params = {}) {
        // Convierte los parámetros a una cadena de consulta URL
        const queryString = new URLSearchParams(params).toString();
        // Realiza una petición GET al endpoint de ranking con los parámetros de consulta
        return this.request(`/ranking/restaurantes${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Obtiene los mejores restaurantes (alias para getRankings con límite)
     * @param {number} limit - Número de restaurantes a retornar
     */
    async getTopRestaurants(limit = 10) {
        // Realiza una petición GET al endpoint de ranking con parámetros predefinidos
        return this.request(`/ranking/restaurantes?limite=${limit}&ordenarPor=ranking&orden=desc`);
    }

    // ==================== SEARCH ENDPOINTS ====================
    // NOTA: Los endpoints de búsqueda no están implementados en el backend
    // Usar getRestaurants con filtros como alternativa

    /**
     * Busca restaurantes (usando endpoint de restaurantes con filtros)
     * @param {string} query - Consulta de búsqueda
     * @param {object} filters - Filtros adicionales
     */
    async searchRestaurants(query, filters = {}) {
        // Usar endpoint de restaurantes con parámetros de filtro
        // El backend puede filtrar por nombre si se implementa
        return this.getRestaurants(filters);
    }

    /**
     * Busca platos (usando endpoint de platos)
     * @param {string} query - Consulta de búsqueda
     */
    async searchDishes(query) {
        // Usar endpoint de platos
        return this.getDishes();
    }

    // ==================== ADMIN ENDPOINTS ====================
    // NOTA: Algunos endpoints de admin no están implementados en el backend
    // Endpoints relacionados con funciones administrativas

    /**
     * Obtiene todos los usuarios (solo administradores)
     * @param {object} params - Parámetros de consulta (paginación, filtros)
     */
    async getUsers(params = {}) {
        // Convierte los parámetros a una cadena de consulta URL
        const queryString = new URLSearchParams(params).toString();
        // Intentar primero con /admin/usuarios, si falla, usar /usuarios como fallback
        try {
            // Intenta hacer la petición al endpoint de admin de usuarios
            return await this.request(`/admin/usuarios${queryString ? '?' + queryString : ''}`);
        } catch (error) {
            // Si el endpoint /admin/usuarios no existe, intentar con /usuarios
            if (error.message.includes('404') || error.message.includes('no encontrado')) {
                // Usa el endpoint alternativo de usuarios
                return this.request(`/usuarios${queryString ? '?' + queryString : ''}`);
            }
            // Si es otro tipo de error, lo relanza
            throw error;
        }
    }

    /**
     * Actualiza el rol de un usuario (solo administradores)
     * NOTA: Endpoint no implementado en backend - retorna error
     * @param {string} userId - ID del usuario
     * @param {string} role - Nuevo rol del usuario
     */
    async updateUserRole(userId, role) {
        // Lanza un error indicando que el endpoint no está implementado
        throw new Error('Endpoint no implementado en el backend');
    }

    /**
     * Elimina un usuario (solo administradores)
     * NOTA: Endpoint no implementado en backend - retorna error
     * @param {string} userId - ID del usuario a eliminar
     */
    async deleteUser(userId) {
        // Lanza un error indicando que el endpoint no está implementado
        throw new Error('Endpoint no implementado en el backend');
    }

    /**
     * Aprueba un restaurante (solo administradores)
     * Usa el endpoint de restaurantes con PATCH
     */
    // Ya está implementado arriba en approveRestaurant()

    /**
     * Obtiene las aprobaciones pendientes (solo administradores)
     * NOTA: Endpoint no implementado - usar getRestaurants con filtro aprobado=false
     */
    async getPendingApprovals() {
        // Usa getRestaurants con filtro para obtener solo los no aprobados
        return this.getRestaurants({ soloAprobados: 'false' });
    }

    /**
     * Obtiene las estadísticas del dashboard (solo administradores)
     * NOTA: Endpoint no implementado en backend - retorna error
     */
    async getDashboardStats() {
        // Lanza un error indicando que el endpoint no está implementado
        throw new Error('Endpoint no implementado en el backend');
    }
}

// Crear instancia global de API
// Obtiene CONFIG usando la función auxiliar
let api;
try {
    // Obtiene la configuración
    const config = getConfig();
    // Crea una nueva instancia de APIClient con la URL base del API desde la configuración
    api = new APIClient(config.API_URL);
} catch (error) {
    // Si hay un error al inicializar (por ejemplo, CONFIG no está disponible)
    // Registra el error en la consola
    console.error('Error al inicializar API Client:', error);
    // Crea una instancia dummy de API para prevenir más errores
    api = {
        // Método request que siempre rechaza con el error
        request: () => Promise.reject(error),
        // Método getHeaders que retorna headers básicos
        getHeaders: () => ({ 'Content-Type': 'application/json' })
    };
}

// Hacerla accesible globalmente
// Si estamos en un navegador (window existe)
if (typeof window !== 'undefined') {
    // Asigna la instancia de API al objeto window para uso global
    window.api = api;
}

// Exportar para uso en módulos
// Si estamos en Node.js (module.exports existe)
if (typeof module !== 'undefined' && module.exports) {
    // Exporta la instancia de API como módulo
    module.exports = api;
}