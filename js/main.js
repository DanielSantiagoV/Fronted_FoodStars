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
    window.location.href = `./html/restaurants.html?category=${encodeURIComponent(categoryName)}`;
}

/**
 * Get category name from restaurant (maps categoriaId to nombre)
 */
function getRestaurantCategoryName(restaurant) {
    if (!restaurant) return null;
    
    // Si el restaurante tiene categoriaId, buscar el nombre en categories
    if (restaurant.categoriaId && categories.length > 0) {
        const category = categories.find(c => 
            c._id === restaurant.categoriaId || 
            c._id.toString() === restaurant.categoriaId.toString()
        );
        if (category) return category.nombre;
    }
    
    // Fallback: usar categoria si está disponible
    return restaurant.categoria || null;
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
            limite: 6,  // Backend usa 'limite' no 'limit'
            ordenarPor: 'ranking',
            orden: 'desc' // Sort by ranking descending
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
    
    // Backend retorna calificacionPromedio
    const rating = restaurant.calificacionPromedio || restaurant.promedioCalificacion || 0;
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
                <span class="category-tag">${getRestaurantCategoryName(restaurant) || 'General'}</span>
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
    window.location.href = `./html/restaurant-detail.html?id=${restaurantId}`;
}

/**
 * Search restaurants
 */
function searchRestaurants() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `./html/restaurants.html?search=${encodeURIComponent(query)}`;
    } else {
        showToast('Por favor ingresa un término de búsqueda', 'warning');
    }
}
/**
 * Search by tag
 * @param {string} tag - Tag to search
 */
function searchTag(tag) {
    window.location.href = `./html/restaurants.html?search=${encodeURIComponent(tag)}`;
}

/**
 * Load statistics (mock data for now)
 */
async function loadStatistics() {
    const statsRestaurants = document.getElementById('statsRestaurants');
    const statsReviews = document.getElementById('statsReviews');
    const statsUsers = document.getElementById('statsUsers');
    
    try {
        // Try to get real stats from API if endpoint exists
        // For now, use mock data with animation
        animateNumber(statsRestaurants, 0, 1234, 2000);
        animateNumber(statsReviews, 0, 15678, 2000);
        animateNumber(statsUsers, 0, 8945, 2000);
    } catch (error) {
        console.error('Error loading stats:', error);
        // Keep default values
    }
}

/**
 * Animate number counting
 * @param {HTMLElement} element - Element to animate
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Animation duration in ms
 */
function animateNumber(element, start, end, duration) {
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = formatNumber(end) + '+';
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current)) + '+';
        }
    }, 16);
}

/**
 * Setup search input enter key handler
 */
function setupSearchHandler() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchRestaurants();
            }
        });
    }
}

/**
 * Load footer categories
 */
function loadFooterCategories() {
    const footerCategories = document.getElementById('footerCategories');
    if (!footerCategories || categories.length === 0) return;
    
    // Take first 4 categories
    const topCategories = categories.slice(0, 4);
    
    footerCategories.innerHTML = topCategories.map(category => `
        <li>
            <a href="./html/restaurants.html?category=${encodeURIComponent(category.nombre)}">
                ${category.nombre}
            </a>
        </li>
    `).join('');
}

/**
 * Initialize page
 */
async function initPage() {
    try {
        // Load all data
        await Promise.all([
            loadCategories(),
            loadRestaurants(),
            loadStatistics()
        ]);
        
        // Setup handlers
        setupSearchHandler();
        
        // Load footer after categories are loaded
        setTimeout(loadFooterCategories, 500);
        
    } catch (error) {
        console.error('Error initializing page:', error);
        showToast('Error al cargar la página', 'error');
    }
}

/**
 * Setup intersection observer for animations
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards
    document.querySelectorAll('.category-card, .restaurant-card, .feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

/**
 * Handle hero CTA buttons based on auth state
 */
function updateHeroCTA() {
    if (isAuthenticated()) {
        const heroAuthBtn = document.querySelector('.hero .btn-secondary');
        if (heroAuthBtn) {
            heroAuthBtn.textContent = 'Mi Perfil';
            heroAuthBtn.href = '#profile';
        }
    }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initPage();
        setTimeout(setupScrollAnimations, 100);
        updateHeroCTA();
    });
} else {
    initPage();
    setTimeout(setupScrollAnimations, 100);
    updateHeroCTA();
}

// Export functions for global use
window.searchRestaurants = searchRestaurants;
window.searchTag = searchTag;
window.loadCategories = loadCategories;
window.loadRestaurants = loadRestaurants;