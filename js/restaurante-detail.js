/**
 * FoodieRank - Restaurant Detail Page Logic
 * Handles restaurant details, dishes, and reviews
 */

// Page state
let restaurantId = null;
let restaurant = null;
let reviews = [];
let userReview = null;
let currentEditReviewId = null;
let reviewsPage = 1;
let hasMoreReviews = false;

/**
 * Initialize page
 */
async function initPage() {
    // Get restaurant ID from URL
    const params = getQueryParams();
    restaurantId = params.id;
    
    if (!restaurantId) {
        showToast('ID de restaurante no válido', 'error');
        setTimeout(() => window.location.href = 'restaurants.html', 2000);
        return;
    }
    
    // Load data
    await Promise.all([
        loadRestaurant(),
        loadReviews(),
        loadDishes()
    ]);
    
    // Setup event listeners
    setupEventListeners();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Write review button
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', showReviewForm);
    }
    
    // Review form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
    
    // Character count
    const reviewComment = document.getElementById('reviewComment');
    if (reviewComment) {
        reviewComment.addEventListener('input', updateCharCount);
    }
    
    // Edit form character count
    const editReviewComment = document.getElementById('editReviewComment');
    if (editReviewComment) {
        editReviewComment.addEventListener('input', updateEditCharCount);
    }
    
    // Star rating
    setupStarRating('starRating', 'ratingInput');
    setupStarRating('editStarRating', 'editRatingInput');
    
    // Edit form
    const editReviewForm = document.getElementById('editReviewForm');
    if (editReviewForm) {
        editReviewForm.addEventListener('submit', handleEditReviewSubmit);
    }
    
    // Load more reviews
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreReviews);
    }
    
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
    }
    
    // Directions button
    const directionsBtn = document.getElementById('directionsBtn');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', handleDirections);
    }
}

/**
 * Load restaurant data
 */
async function loadRestaurant() {
    try {
        const response = await api.getRestaurant(restaurantId);
        
        if (response.success && response.data) {
            restaurant = response.data;
            displayRestaurantHero(restaurant);
            displayRestaurantInfo(restaurant);
            displayRatingBreakdown(restaurant);
            displayLocation(restaurant);
            loadSimilarRestaurants(restaurant.categoria);
        } else {
            throw new Error('Restaurante no encontrado');
        }
    } catch (error) {
        console.error('Error loading restaurant:', error);
        showToast('Error al cargar el restaurante', 'error');
        setTimeout(() => window.location.href = 'restaurants.html', 2000);
    }
}

/**
 * Display restaurant hero
 */
function displayRestaurantHero(rest) {
    const hero = document.getElementById('restaurantHero');
    const rating = rest.promedioCalificacion || 0;
    const stars = generateStars(rating);
    const reviewCount = rest.totalReseñas || 0;
    
    hero.innerHTML = `
        <div class="hero-content">
            <div class="hero-container">
                <div class="hero-breadcrumb">
                    <a href="index.html">Inicio</a>
                    <span>›</span>
                    <a href="restaurants.html">Restaurantes</a>
                    <span>›</span>
                    <span>${rest.nombre}</span>
                </div>
                
                <div class="hero-title">
                    <h1>${sanitizeHTML(rest.nombre)}</h1>
                    <div class="hero-rating">
                        <div class="hero-rating-score">${rating.toFixed(1)}</div>
                        <div class="hero-rating-stars">${stars}</div>
                        <div class="hero-rating-count">${formatNumber(reviewCount)} reseñas</div>
                    </div>
                </div>
                
                <div class="hero-meta">
                    <div class="hero-meta-item">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                        </svg>
                        <span>${rest.categoria || 'General'}</span>
                    </div>
                    <div class="hero-meta-item">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>${rest.ubicacion || 'Ubicación no especificada'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Update page title
    document.title = `${rest.nombre} - FoodieRank`;
}

/**
 * Display restaurant info
 */
function displayRestaurantInfo(rest) {
    const infoCard = document.getElementById('infoCard');
    
    infoCard.innerHTML = `
        <p class="restaurant-description">${sanitizeHTML(rest.descripcion || 'Sin descripción disponible.')}</p>
        <div class="info-tags">
            <span class="info-tag">${getCategoryIcon(rest.categoria)} ${rest.categoria || 'General'}</span>
            ${rest.popularidad > 70 ? '<span class="info-tag">⭐ Popular</span>' : ''}
        </div>
    `;
}

/**
 * Load dishes
 */
async function loadDishes() {
    const grid = document.getElementById('dishesGrid');
    
    try {
        const response = await api.getRestaurantDishes(restaurantId);
        
        if (response.success && response.data && response.data.length > 0) {
            displayDishes(response.data.slice(0, 4)); // Show only 4
        } else {
            grid.innerHTML = '<p style="color: var(--gray-600); text-align: center;">No hay platos disponibles</p>';
        }
    } catch (error) {
        console.error('Error loading dishes:', error);
        grid.innerHTML = '<p style="color: var(--gray-600); text-align: center;">No hay platos disponibles</p>';
    }
}

/**
 * Display dishes
 */
function displayDishes(dishes) {
    const grid = document.getElementById('dishesGrid');
    
    grid.innerHTML = dishes.map(dish => `
        <div class="dish-card">
            <span class="dish-icon">🍽️</span>
            <h4>${sanitizeHTML(dish.nombre)}</h4>
            <p>${truncateText(sanitizeHTML(dish.descripcion || ''), 80)}</p>
            ${dish.precio ? `<div class="dish-price">$${formatNumber(dish.precio)}</div>` : ''}
        </div>
    `).join('');
}

/**
 * Load reviews
 */
async function loadReviews() {
    const list = document.getElementById('reviewsList');
    list.innerHTML = '<div class="loading-state"><div class="loader"></div></div>';
    
    try {
        const response = await api.getRestaurantReviews(restaurantId);
        
        if (response.success && response.data) {
            reviews = response.data;
            displayReviews(reviews);
            checkUserReview();
            updateLoadMoreButton(response.pagination);
        } else {
            list.innerHTML = '<p style="color: var(--gray-600); text-align: center;">No hay reseñas aún</p>';
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        list.innerHTML = '<p style="color: var(--danger); text-align: center;">Error al cargar reseñas</p>';
    }
}
