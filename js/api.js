/**
 * FoodieRank - API Client
 * Handles all API requests to the backend
 */

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

        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
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
            const data = await response.json();

            if (!response.ok) {
                // Handle specific error cases
                if (response.status === 401) {
                    // Unauthorized - clear auth and redirect
                    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
                    
                    if (window.location.pathname !== '/auth.html' && window.location.pathname !== '/index.html') {
                        showToast(CONFIG.MESSAGES.ERROR.SESSION_EXPIRED, 'error');
                        setTimeout(() => {
                            window.location.href = 'auth.html';
                        }, 2000);
                    }
                }

                throw new Error(data.message || data.error || CONFIG.MESSAGES.ERROR.GENERIC);
            }

            return data;
        } catch (error) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error(CONFIG.MESSAGES.ERROR.NETWORK);
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
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    /**
     * Login user
     * @param {object} credentials - Login credentials
     */
    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    /**
     * Get current user profile
     */
    async getProfile() {
        return this.request('/auth/profile');
    }

    /**
     * Update user profile
     * @param {object} userData - Updated user data
     */
    async updateProfile(userData) {
        return this.request('/auth/profile', {
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
        return this.request(`/restaurants${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Get restaurant by ID
     * @param {string} id - Restaurant ID
     */
    async getRestaurant(id) {
        return this.request(`/restaurants/${id}`);
    }

    /**
     * Create new restaurant
     * @param {object} restaurantData - Restaurant data
     */
    async createRestaurant(restaurantData) {
        return this.request('/restaurants', {
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
        return this.request(`/restaurants/${id}`, {
            method: 'PUT',
            body: JSON.stringify(restaurantData)
        });
    }

    /**
     * Delete restaurant
     * @param {string} id - Restaurant ID
     */
    async deleteRestaurant(id) {
        return this.request(`/restaurants/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Get restaurant dishes
     * @param {string} restaurantId - Restaurant ID
     */
    async getRestaurantDishes(restaurantId) {
        return this.request(`/restaurants/${restaurantId}/dishes`);
    }

    // ==================== DISHES ENDPOINTS ====================

    /**
     * Get all dishes
     * @param {object} params - Query parameters
     */
    async getDishes(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/dishes${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Get dish by ID
     * @param {string} id - Dish ID
     */
    async getDish(id) {
        return this.request(`/dishes/${id}`);
    }

    /**
     * Create new dish
     * @param {object} dishData - Dish data
     */
    async createDish(dishData) {
        return this.request('/dishes', {
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
        return this.request(`/dishes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dishData)
        });
    }

    /**
     * Delete dish
     * @param {string} id - Dish ID
     */
    async deleteDish(id) {
        return this.request(`/dishes/${id}`, {
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
        return this.request(`/reviews${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Get review by ID
     * @param {string} id - Review ID
     */
    async getReview(id) {
        return this.request(`/reviews/${id}`);
    }

    /**
     * Get restaurant reviews
     * @param {string} restaurantId - Restaurant ID
     */
    async getRestaurantReviews(restaurantId) {
        return this.request(`/restaurants/${restaurantId}/reviews`);
    }

    /**
     * Create new review
     * @param {object} reviewData - Review data
     */
    async createReview(reviewData) {
        return this.request('/reviews', {
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
        return this.request(`/reviews/${id}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData)
        });
    }

    /**
     * Delete review
     * @param {string} id - Review ID
     */
    async deleteReview(id) {
        return this.request(`/reviews/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Like a review
     * @param {string} id - Review ID
     */
    async likeReview(id) {
        return this.request(`/reviews/${id}/like`, {
            method: 'POST'
        });
    }

    /**
     * Dislike a review
     * @param {string} id - Review ID
     */
    async dislikeReview(id) {
        return this.request(`/reviews/${id}/dislike`, {
            method: 'POST'
        });
    }

    /**
     * Remove like/dislike from review
     * @param {string} id - Review ID
     */
    async removeLikeDislike(id) {
        return this.request(`/reviews/${id}/like`, {
            method: 'DELETE'
        });
    }

    // ==================== CATEGORIES ENDPOINTS ====================

    /**
     * Get all categories
     */
    async getCategories() {
        return this.request('/categories');
    }

    /**
     * Get category by ID
     * @param {string} id - Category ID
     */
    async getCategory(id) {
        return this.request(`/categories/${id}`);
    }

    /**
     * Create new category (Admin only)
     * @param {object} categoryData - Category data
     */
    async createCategory(categoryData) {
        return this.request('/categories', {
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
        return this.request(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData)
        });
    }

    /**
     * Delete category (Admin only)
     * @param {string} id - Category ID
     */
    async deleteCategory(id) {
        return this.request(`/categories/${id}`, {
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
        return this.request(`/rankings${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Get top restaurants
     * @param {number} limit - Number of restaurants to return
     */
    async getTopRestaurants(limit = 10) {
        return this.request(`/rankings/top?limit=${limit}`);
    }

    // ==================== SEARCH ENDPOINTS ====================

    /**
     * Search restaurants
     * @param {string} query - Search query
     * @param {object} filters - Additional filters
     */
    async searchRestaurants(query, filters = {}) {
        const params = { q: query, ...filters };
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/search/restaurants?${queryString}`);
    }

    /**
     * Search dishes
     * @param {string} query - Search query
     */
    async searchDishes(query) {
        return this.request(`/search/dishes?q=${encodeURIComponent(query)}`);
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * Get all users (Admin only)
     */
    async getUsers() {
        return this.request('/admin/users');
    }

    /**
     * Update user role (Admin only)
     * @param {string} userId - User ID
     * @param {string} role - New role
     */
    async updateUserRole(userId, role) {
        return this.request(`/admin/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role })
        });
    }

    /**
     * Delete user (Admin only)
     * @param {string} userId - User ID
     */
    async deleteUser(userId) {
        return this.request(`/admin/users/${userId}`, {
            method: 'DELETE'
        });
    }

    /**
     * Approve restaurant (Admin only)
     * @param {string} restaurantId - Restaurant ID
     */
    async approveRestaurant(restaurantId) {
        return this.request(`/admin/restaurants/${restaurantId}/approve`, {
            method: 'POST'
        });
    }

    /**
     * Get pending approvals (Admin only)
     */
    async getPendingApprovals() {
        return this.request('/admin/approvals');
    }

    /**
     * Get dashboard stats (Admin only)
     */
    async getDashboardStats() {
        return this.request('/admin/stats');
    }
}

// Create global API instance
const api = new APIClient(CONFIG.API_URL);

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}