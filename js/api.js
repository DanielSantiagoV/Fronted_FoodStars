/**
 * FoodieRank - API Client
 * Handles all API requests to the backend
 */

// Helper function to safely get CONFIG
function getConfig() {
    if (typeof window !== 'undefined' && window.CONFIG) {
        return window.CONFIG;
    }
    if (typeof CONFIG !== 'undefined') {
        return CONFIG;
    }
    throw new Error('CONFIG no está definido. Asegúrate de cargar config.js antes de api.js');
}

class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    /**
     * Get authorization headers
     * @returns {object} Headers with token if available
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        const config = getConfig();
        const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Make HTTP request
     * @param {string} endpoint - API endpoint
     * @param {object} options - Fetch options
     * @returns {Promise} Response data
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            
            // Verificar si la respuesta tiene contenido antes de parsear JSON
            const contentType = response.headers.get('content-type');
            const hasJsonContent = contentType && contentType.includes('application/json');
            const hasBody = response.status !== 204 && response.status !== 304;
            
            let data = null;
            
            // Solo intentar parsear JSON si hay contenido y es tipo JSON
            if (hasBody && hasJsonContent) {
                try {
                    const text = await response.text();
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

            if (!response.ok) {
                // Handle specific error cases
                const config = getConfig();
                if (response.status === 401) {
                    // Unauthorized - clear auth and redirect
                    localStorage.removeItem(config.STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(config.STORAGE_KEYS.USER);
                    
                    const currentPath = window.location.pathname;
                    if (!currentPath.includes('/auth.html') && !currentPath.includes('/index.html')) {
                        showToast(config.MESSAGES.ERROR.SESSION_EXPIRED, 'error');
                        
                        // Determine correct path to auth.html based on current location
                        const authUrl = currentPath.includes('/html/') 
                            ? './auth.html' 
                            : 'html/auth.html';
                        
                        setTimeout(() => {
                            window.location.href = authUrl;
                        }, 2000);
                    }
                }

                const errorMessage = data?.message || data?.error || 
                    (response.status === 404 ? 'Recurso no encontrado' : null) ||
                    config.MESSAGES.ERROR.GENERIC;
                throw new Error(errorMessage);
            }

            // Si no hay data pero la respuesta es exitosa, devolver un objeto de éxito
            if (!data && response.ok) {
                data = { success: true };
            }

            return data;
        } catch (error) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                const config = getConfig();
                throw new Error(config.MESSAGES.ERROR.NETWORK);
            }
            throw error;
        }
    }

    // ==================== AUTH ENDPOINTS ====================

    /**
     * Register new user
     * @param {object} userData - User registration data
     */
    async register(userData) {
        return this.request('/usuarios/registro', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    /**
     * Login user
     * @param {object} credentials - Login credentials
     */
    async login(credentials) {
        return this.request('/usuarios/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    /**
     * Get current user profile
     */
    async getProfile() {
        return this.request('/usuarios/perfil');
    }

    /**
     * Update user profile
     * @param {object} userData - Updated user data
     */
    async updateProfile(userData) {
        return this.request('/usuarios/perfil', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    // ==================== RESTAURANTS ENDPOINTS ====================

    /**
     * Get all restaurants with filters
     * @param {object} params - Query parameters
     */
    async getRestaurants(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/restaurantes${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Get restaurant by ID
     * @param {string} id - Restaurant ID
     */
    async getRestaurant(id) {
        return this.request(`/restaurantes/${id}`);
    }

    /**
     * Create new restaurant
     * @param {object} restaurantData - Restaurant data
     */
    async createRestaurant(restaurantData) {
        return this.request('/restaurantes', {
            method: 'POST',
            body: JSON.stringify(restaurantData)
        });
    }

    /**
     * Update restaurant
     * @param {string} id - Restaurant ID
     * @param {object} restaurantData - Updated restaurant data
     */
    async updateRestaurant(id, restaurantData) {
        return this.request(`/restaurantes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(restaurantData)
        });
    }

    /**
     * Delete restaurant
     * @param {string} id - Restaurant ID
     */
    async deleteRestaurant(id) {
        return this.request(`/restaurantes/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Approve restaurant (Admin only)
     * @param {string} id - Restaurant ID
     */
    async approveRestaurant(id) {
        return this.request(`/restaurantes/${id}/aprobar`, {
            method: 'PATCH'
        });
    }

    /**
     * Get restaurant dishes
     * @param {string} restaurantId - Restaurant ID
     */
    async getRestaurantDishes(restaurantId) {
        return this.request(`/platos/restaurante/${restaurantId}`);
    }

    // ==================== DISHES ENDPOINTS ====================

    /**
     * Get all dishes
     * @param {object} params - Query parameters
     */
    async getDishes(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/platos${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Get dish by ID
     * @param {string} id - Dish ID
     */
    async getDish(id) {
        return this.request(`/platos/${id}`);
    }

    /**
     * Create new dish
     * @param {object} dishData - Dish data
     */
    async createDish(dishData) {
        return this.request('/platos', {
            method: 'POST',
            body: JSON.stringify(dishData)
        });
    }

    /**
     * Update dish
     * @param {string} id - Dish ID
     * @param {object} dishData - Updated dish data
     */
    async updateDish(id, dishData) {
        return this.request(`/platos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dishData)
        });
    }

    /**
     * Delete dish
     * @param {string} id - Dish ID
     */
    async deleteDish(id) {
        return this.request(`/platos/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== REVIEWS ENDPOINTS ====================

    /**
     * Get all reviews
     * @param {object} params - Query parameters
     */
    async getReviews(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/resenas${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Get review by ID
     * @param {string} id - Review ID
     */
    async getReview(id) {
        return this.request(`/resenas/${id}`);
    }

    /**
     * Get restaurant reviews
     * @param {string} restaurantId - Restaurant ID
     */
    async getRestaurantReviews(restaurantId) {
        return this.request(`/resenas/restaurante/${restaurantId}`);
    }

    /**
     * Create new review
     * @param {object} reviewData - Review data
     */
    async createReview(reviewData) {
        return this.request('/resenas', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    }

    /**
     * Update review
     * @param {string} id - Review ID
     * @param {object} reviewData - Updated review data
     */
    async updateReview(id, reviewData) {
        return this.request(`/resenas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData)
        });
    }

    /**
     * Delete review
     * @param {string} id - Review ID
     */
    async deleteReview(id) {
        return this.request(`/resenas/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Like a review (toggle - si ya tiene like, lo remueve)
     * @param {string} id - Review ID
     */
    async likeReview(id) {
        return this.request(`/resenas/${id}/like`, {
            method: 'POST'
        });
    }

    /**
     * Dislike a review (toggle - si ya tiene dislike, lo remueve)
     * @param {string} id - Review ID
     */
    async dislikeReview(id) {
        return this.request(`/resenas/${id}/dislike`, {
            method: 'POST'
        });
    }

    // ==================== CATEGORIES ENDPOINTS ====================

    /**
     * Get all categories
     */
    async getCategories() {
        return this.request('/categorias');
    }

    /**
     * Get category by ID
     * @param {string} id - Category ID
     */
    async getCategory(id) {
        return this.request(`/categorias/${id}`);
    }

    /**
     * Create new category (Admin only)
     * @param {object} categoryData - Category data
     */
    async createCategory(categoryData) {
        return this.request('/categorias', {
            method: 'POST',
            body: JSON.stringify(categoryData)
        });
    }

    /**
     * Update category (Admin only)
     * @param {string} id - Category ID
     * @param {object} categoryData - Updated category data
     */
    async updateCategory(id, categoryData) {
        return this.request(`/categorias/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData)
        });
    }

    /**
     * Delete category (Admin only)
     * @param {string} id - Category ID
     */
    async deleteCategory(id) {
        return this.request(`/categorias/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== RANKINGS ENDPOINTS ====================

    /**
     * Get restaurant rankings
     * @param {object} params - Query parameters
     */
    async getRankings(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/ranking/restaurantes${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Get top restaurants (alias para getRankings con límite)
     * @param {number} limit - Number of restaurants to return
     */
    async getTopRestaurants(limit = 10) {
        return this.request(`/ranking/restaurantes?limite=${limit}&ordenarPor=ranking&orden=desc`);
    }

    // ==================== SEARCH ENDPOINTS ====================
    // NOTA: Los endpoints de búsqueda no están implementados en el backend
    // Usar getRestaurants con filtros como alternativa

    /**
     * Search restaurants (usando endpoint de restaurantes con filtros)
     * @param {string} query - Search query
     * @param {object} filters - Additional filters
     */
    async searchRestaurants(query, filters = {}) {
        // Usar endpoint de restaurantes con parámetros de filtro
        // El backend puede filtrar por nombre si se implementa
        return this.getRestaurants(filters);
    }

    /**
     * Search dishes (usando endpoint de platos)
     * @param {string} query - Search query
     */
    async searchDishes(query) {
        // Usar endpoint de platos
        return this.getDishes();
    }

    // ==================== ADMIN ENDPOINTS ====================
    // NOTA: Algunos endpoints de admin no están implementados en el backend

    /**
     * Get all users (Admin only)
     * @param {object} params - Query parameters
     */
    async getUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        // Intentar primero con /admin/usuarios, si falla, usar /usuarios como fallback
        try {
            return await this.request(`/admin/usuarios${queryString ? '?' + queryString : ''}`);
        } catch (error) {
            // Si el endpoint /admin/usuarios no existe, intentar con /usuarios
            if (error.message.includes('404') || error.message.includes('no encontrado')) {
                return this.request(`/usuarios${queryString ? '?' + queryString : ''}`);
            }
            throw error;
        }
    }

    /**
     * Update user role (Admin only)
     * NOTA: Endpoint no implementado en backend - retorna error
     */
    async updateUserRole(userId, role) {
        throw new Error('Endpoint no implementado en el backend');
    }

    /**
     * Delete user (Admin only)
     * NOTA: Endpoint no implementado en backend - retorna error
     */
    async deleteUser(userId) {
        throw new Error('Endpoint no implementado en el backend');
    }

    /**
     * Approve restaurant (Admin only)
     * Usa el endpoint de restaurantes con PATCH
     */
    // Ya está implementado arriba en approveRestaurant()

    /**
     * Get pending approvals (Admin only)
     * NOTA: Endpoint no implementado - usar getRestaurants con filtro aprobado=false
     */
    async getPendingApprovals() {
        return this.getRestaurants({ soloAprobados: 'false' });
    }

    /**
     * Get dashboard stats (Admin only)
     * NOTA: Endpoint no implementado en backend - retorna error
     */
    async getDashboardStats() {
        throw new Error('Endpoint no implementado en el backend');
    }
}

// Create global API instance
// Get CONFIG using the helper function
let api;
try {
    const config = getConfig();
    api = new APIClient(config.API_URL);
} catch (error) {
    console.error('Error al inicializar API Client:', error);
    // Create a dummy API instance to prevent further errors
    api = {
        request: () => Promise.reject(error),
        getHeaders: () => ({ 'Content-Type': 'application/json' })
    };
}

// Make it globally accessible
if (typeof window !== 'undefined') {
    window.api = api;
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}