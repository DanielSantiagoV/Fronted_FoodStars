/**
 * FoodieRank - Index Page Logic
 * Main page functionality
 */

// Page state
let categories = [];
let restaurants = [];

/**
 * Load and display categories
 */
async function loadCategories() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;
    
    // Show loading state
    grid.innerHTML = `
        <div class="loading-state">
            <div class="loader"></div>
            <p>Cargando categorías...</p>
        </div>
    `;
    
    try {
        const response = await api.getCategories();
        
        if (response.success && response.data) {
            categories = response.data;
            displayCategories(categories);
        } else {
            throw new Error('Error al cargar categorías');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        grid.innerHTML = `
            <div class="loading-state">
                <p style="color: var(--danger);">❌ Error al cargar categorías</p>
                <button class="btn-primary" onclick="loadCategories()">Reintentar</button>
            </div>
        `;
    }
}

/**
 * Display categories in grid
 * @param {array} categoriesToDisplay - Categories to display
 */
function displayCategories(categoriesToDisplay) {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;
    
    if (!categoriesToDisplay || categoriesToDisplay.length === 0) {
        grid.innerHTML = `
            <div class="loading-state">
                <p style="color: var(--gray-600);">No hay categorías disponibles</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    
    categoriesToDisplay.forEach(category => {
        const icon = getCategoryIcon(category.nombre);
        
        const card = document.createElement('div');
        card.className = 'category-card';
        card.onclick = () => navigateToCategory(category.nombre);
        
        card.innerHTML = `
            <span class="category-icon">${icon}</span>
            <h3>${category.nombre}</h3>
            <p>${category.descripcion || 'Explora esta categoría'}</p>
        `;
        
        grid.appendChild(card);
    });
}

/**
 * Navigate to category page
 * @param {string} categoryName - Category name
 */
function navigateToCategory(categoryName) {
    window.location.href = `restaurants.html?category=${encodeURIComponent(categoryName)}`;
}

/**
 * Load and display featured restaurants
 */
async function loadRestaurants() {
    const grid = document.getElementById('restaurantGrid');
    if (!grid) return;
    
    // Show loading state
    grid.innerHTML = `
        <div class="loading-state">
            <div class="loader"></div>
            <p>Cargando restaurantes...</p>
        </div>
    `;
    
    try {
        const response = await api.getRestaurants({
            limit: 6,
            sort: '-promedioCalificacion' // Sort by rating descending
        });
        
        if (response.success && response.data) {
            restaurants = response.data;
            displayRestaurants(restaurants);
        } else {
            throw new Error('Error al cargar restaurantes');
        }
    } catch (error) {
        console.error('Error loading restaurants:', error);
        grid.innerHTML = `
            <div class="loading-state">
                <p style="color: var(--danger);">❌ Error al cargar restaurantes</p>
                <button class="btn-primary" onclick="loadRestaurants()">Reintentar</button>
            </div>
        `;
    }
}

/**
 * Display restaurants in grid
 * @param {array} restaurantsToDisplay - Restaurants to display
 */
function displayRestaurants(restaurantsToDisplay) {
    const grid = document.getElementById('restaurantGrid');
    if (!grid) return;
    
    if (!restaurantsToDisplay || restaurantsToDisplay.length === 0) {
        grid.innerHTML = `
            <div class="loading-state">
                <p style="color: var(--gray-600);">No hay restaurantes disponibles</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    
    restaurantsToDisplay.forEach(restaurant => {
        const card = createRestaurantCard(restaurant);
        grid.appendChild(card);
    });
}

/**
 * Create restaurant card element
 * @param {object} restaurant - Restaurant data
 * @returns {HTMLElement} Restaurant card element
 */
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.onclick = () => navigateToRestaurant(restaurant._id);
    
    const rating = restaurant.promedioCalificacion || 0;
    const reviewCount = restaurant.totalReseñas || 0;
    const stars = generateStars(rating);
    const isPopular = restaurant.popularidad > 70 || reviewCount > 20;
    
    card.innerHTML = `
        <div class="restaurant-image">
            ${isPopular ? '<span class="restaurant-badge">⭐ Popular</span>' : ''}
        </div>
        <div class="restaurant-content">
            <div class="restaurant-header">
                <h3>${sanitizeHTML(restaurant.nombre)}</h3>
                <div class="rating">
                    <span class="stars">${stars}</span>
                    <span>${rating.toFixed(1)}</span>
                </div>
            </div>
            <p>${truncateText(sanitizeHTML(restaurant.descripcion || 'Descubre este increíble restaurante'), 120)}</p>
            <div class="restaurant-meta">
                <span class="category-tag">${restaurant.categoria || 'General'}</span>
                <span class="reviews-count">💬 ${formatNumber(reviewCount)} reseñas</span>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Navigate to restaurant detail page
 * @param {string} restaurantId - Restaurant ID
 */
function navigateToRestaurant(restaurantId) {
    window.location.href = `restaurant-detail.html?id=${restaurantId}`;
}

/**
 * Search restaurants
 */
function searchRestaurants() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `restaurants.html?search=${encodeURIComponent(query)}`;
    } else {
        showToast('Por favor ingresa un término de búsqueda', 'warning');
    }
}

