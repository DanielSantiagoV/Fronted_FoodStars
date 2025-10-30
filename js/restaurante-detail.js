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

/**
 * Display reviews
 */
function displayReviews(reviewsToDisplay) {
    const list = document.getElementById('reviewsList');
    const currentUser = getCurrentUser();
    
    if (!reviewsToDisplay || reviewsToDisplay.length === 0) {
        list.innerHTML = '<p style="color: var(--gray-600); text-align: center; padding: 2rem;">No hay reseñas aún. ¡Sé el primero en escribir una!</p>';
        return;
    }
    
    list.innerHTML = reviewsToDisplay.map(review => {
        const isOwner = currentUser && review.usuario && (review.usuario._id === currentUser._id || review.usuario === currentUser._id);
        const userName = review.usuario?.nombre || review.usuario?.email || 'Usuario';
        const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const stars = generateStars(review.calificacion);
        
        return `
            <div class="review-card" data-review-id="${review._id}">
                <div class="review-header">
                    <div class="review-user">
                        <div class="review-avatar">${userInitials}</div>
                        <div class="review-user-info">
                            <h4>${sanitizeHTML(userName)}</h4>
                            <div class="review-date">${formatRelativeTime(review.fechaCreacion)}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        <span class="review-stars">${stars}</span>
                        <span>${review.calificacion}</span>
                    </div>
                </div>
                
                <div class="review-content">
                    <p>${sanitizeHTML(review.comentario)}</p>
                </div>
                
                <div class="review-actions">
                    ${isAuthenticated() && !isOwner ? `
                        <button class="review-action-btn ${review.userReaction === 'like' ? 'liked' : ''}" onclick="handleLike('${review._id}')">
                            <svg width="20" height="20" fill="${review.userReaction === 'like' ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                            </svg>
                            <span>${review.likes || 0}</span>
                        </button>
                        <button class="review-action-btn ${review.userReaction === 'dislike' ? 'disliked' : ''}" onclick="handleDislike('${review._id}')">
                            <svg width="20" height="20" fill="${review.userReaction === 'dislike' ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"/>
                            </svg>
                            <span>${review.dislikes || 0}</span>
                        </button>
                    ` : `
                        <div style="display: flex; gap: 1rem;">
                            <span style="color: var(--gray-600); font-size: 0.9rem;">👍 ${review.likes || 0}</span>
                            <span style="color: var(--gray-600); font-size: 0.9rem;">👎 ${review.dislikes || 0}</span>
                        </div>
                    `}
                    
                    ${isOwner ? `
                        <div class="review-menu">
                            <button class="review-menu-btn" onclick="toggleReviewMenu('${review._id}')">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                                </svg>
                            </button>
                            <div class="review-dropdown" id="menu-${review._id}">
                                <button onclick="editReview('${review._id}')">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                    Editar
                                </button>
                                <button class="danger" onclick="confirmDeleteReview('${review._id}')">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Check if user already has a review
 */
function checkUserReview() {
    if (!isAuthenticated()) {
        document.getElementById('writeReviewBtn').style.display = 'none';
        return;
    }
    
    const currentUser = getCurrentUser();
    userReview = reviews.find(r => r.usuario && (r.usuario._id === currentUser._id || r.usuario === currentUser._id));
    
    const writeBtn = document.getElementById('writeReviewBtn');
    if (userReview) {
        writeBtn.style.display = 'none';
    } else {
        writeBtn.style.display = 'flex';
    }
}

/**
 * Setup star rating
 */
function setupStarRating(containerId, inputId) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    
    if (!container || !input) return;
    
    const stars = container.querySelectorAll('.star-btn');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            input.value = rating;
            
            // Update star display
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.textContent = '★';
                    s.classList.add('active');
                } else {
                    s.textContent = '☆';
                    s.classList.remove('active');
                }
            });
        });
    });
}

/**
 * Show review form
 */
function showReviewForm() {
    if (!requireAuth()) return;
    
    const container = document.getElementById('reviewFormContainer');
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    document.getElementById('writeReviewBtn').style.display = 'none';
}

/**
 * Cancel review
 */
function cancelReview() {
    document.getElementById('reviewFormContainer').style.display = 'none';
    document.getElementById('reviewForm').reset();
    document.getElementById('ratingInput').value = '';
    document.querySelectorAll('#starRating .star-btn').forEach(s => {
        s.textContent = '☆';
        s.classList.remove('active');
    });
    document.getElementById('charCount').textContent = '0';
    
    if (!userReview) {
        document.getElementById('writeReviewBtn').style.display = 'flex';
    }
}

/**
 * Handle review submit
 */
async function handleReviewSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const rating = document.getElementById('ratingInput').value;
    const comment = document.getElementById('reviewComment').value.trim();
    
    if (!rating) {
        showToast('Por favor selecciona una calificación', 'warning');
        return;
    }
    
    if (comment.length < 10) {
        showToast('La reseña debe tener al menos 10 caracteres', 'warning');
        return;
    }
    
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Publicando...';
    
    try {
        const response = await api.createReview({
            restaurante: restaurantId,
            calificacion: parseInt(rating),
            comentario: comment
        });
        
        if (response.success) {
            showToast(CONFIG.MESSAGES.SUCCESS.REVIEW_CREATED, 'success');
            cancelReview();
            await loadReviews();
            await loadRestaurant(); // Refresh rating
        } else {
            throw new Error(response.message || 'Error al crear reseña');
        }
    } catch (error) {
        console.error('Error creating review:', error);
        showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/**
 * Update character count
 */
function updateCharCount(e) {
    const count = e.target.value.length;
    document.getElementById('charCount').textContent = count;
}

/**
 * Update edit character count
 */
function updateEditCharCount(e) {
    const count = e.target.value.length;
    document.getElementById('editCharCount').textContent = count;
}

/**
 * Toggle review menu
 */
function toggleReviewMenu(reviewId) {
    const menu = document.getElementById(`menu-${reviewId}`);
    const allMenus = document.querySelectorAll('.review-dropdown');
    
    allMenus.forEach(m => {
        if (m !== menu) m.classList.remove('active');
    });
    
    menu.classList.toggle('active');
}

/**
 * Edit review
 */
function editReview(reviewId) {
    const review = reviews.find(r => r._id === reviewId);
    if (!review) return;
    
    currentEditReviewId = reviewId;
    
    // Set form values
    document.getElementById('editRatingInput').value = review.calificacion;
    document.getElementById('editReviewComment').value = review.comentario;
    document.getElementById('editCharCount').textContent = review.comentario.length;
    
    // Set stars
    const stars = document.querySelectorAll('#editStarRating .star-btn');
    stars.forEach((star, index) => {
        if (index < review.calificacion) {
            star.textContent = '★';
            star.classList.add('active');
        } else {
            star.textContent = '☆';
            star.classList.remove('active');
        }
    });
    
    // Show modal
    document.getElementById('editReviewModal').classList.add('active');
    
    // Close dropdown
    toggleReviewMenu(reviewId);
}

/**
 * Close edit modal
 */
function closeEditModal() {
    document.getElementById('editReviewModal').classList.remove('active');
    currentEditReviewId = null;
}

/**
 * Handle edit review submit
 */
async function handleEditReviewSubmit(e) {
    e.preventDefault();
    
    if (!currentEditReviewId) return;
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const rating = document.getElementById('editRatingInput').value;
    const comment = document.getElementById('editReviewComment').value.trim();
    
    if (!rating || comment.length < 10) {
        showToast('Por favor completa todos los campos correctamente', 'warning');
        return;
    }
    
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Actualizando...';
    
    try {
        const response = await api.updateReview(currentEditReviewId, {
            calificacion: parseInt(rating),
            comentario: comment
        });
        
        if (response.success) {
            showToast(CONFIG.MESSAGES.SUCCESS.REVIEW_UPDATED, 'success');
            closeEditModal();
            await loadReviews();
            await loadRestaurant();
        } else {
            throw new Error(response.message || 'Error al actualizar reseña');
        }
    } catch (error) {
        console.error('Error updating review:', error);
        showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/**
 * Confirm delete review
 */
function confirmDeleteReview(reviewId) {
    currentEditReviewId = reviewId;
    document.getElementById('deleteModal').classList.add('active');
    toggleReviewMenu(reviewId);
    
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.onclick = () => deleteReview(reviewId);
}

/**
 * Close delete modal
 */
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    currentEditReviewId = null;
}

/**
 * Delete review
 */
async function deleteReview(reviewId) {
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.disabled = true;
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = 'Eliminando...';
    
    try {
        const response = await api.deleteReview(reviewId);
        
        if (response.success) {
            showToast(CONFIG.MESSAGES.SUCCESS.REVIEW_DELETED, 'success');
            closeDeleteModal();
            await loadReviews();
            await loadRestaurant();
        } else {
            throw new Error(response.message || 'Error al eliminar reseña');
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = originalText;
    }
}

/**
 * Handle like
 */
async function handleLike(reviewId) {
    if (!requireAuth()) return;
    
    try {
        await api.likeReview(reviewId);
        await loadReviews();
    } catch (error) {
        console.error('Error liking review:', error);
        showToast('Error al dar like', 'error');
    }
}

/**
 * Handle dislike
 */
async function handleDislike(reviewId) {
    if (!requireAuth()) return;
    
    try {
        await api.dislikeReview(reviewId);
        await loadReviews();
    } catch (error) {
        console.error('Error disliking review:', error);
        showToast('Error al dar dislike', 'error');
    }
}

/**
 * Display rating breakdown
 */
function displayRatingBreakdown(rest) {
    const container = document.getElementById('ratingBars');
    
    // Mock data - adjust based on your API
    const breakdown = [
        { stars: 5, count: Math.floor((rest.totalReseñas || 0) * 0.5) },
        { stars: 4, count: Math.floor((rest.totalReseñas || 0) * 0.25) },
        { stars: 3, count: Math.floor((rest.totalReseñas || 0) * 0.15) },
        { stars: 2, count: Math.floor((rest.totalReseñas || 0) * 0.07) },
        { stars: 1, count: Math.floor((rest.totalReseñas || 0) * 0.03) }
    ];
    
    const total = rest.totalReseñas || 1;
    
    container.innerHTML = breakdown.map(item => {
        const percentage = (item.count / total) * 100;
        return `
            <div class="rating-bar-item">
                <div class="rating-bar-label">${item.stars} ⭐</div>
                <div class="rating-bar">
                    <div class="rating-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="rating-bar-count">${item.count}</div>
            </div>
        `;
    }).join('');
}

/**
 * Display location
 */
function displayLocation(rest) {
    const locationText = document.getElementById('locationText');
    locationText.textContent = rest.ubicacion || 'Ubicación no especificada';
}

/**
 * Load similar restaurants
 */
async function loadSimilarRestaurants(category) {
    const container = document.getElementById('similarList');
    
    try {
        const response = await api.getRestaurants({
            categoria: category,
            limit: 3
        });
        
        if (response.success && response.data && response.data.length > 0) {
            const filtered = response.data.filter(r => r._id !== restaurantId).slice(0, 3);
            displaySimilarRestaurants(filtered);
        } else {
            container.innerHTML = '<p style="color: var(--gray-600); font-size: 0.9rem;">No hay restaurantes similares</p>';
        }
    } catch (error) {
        console.error('Error loading similar restaurants:', error);
        container.innerHTML = '<p style="color: var(--gray-600); font-size: 0.9rem;">No hay restaurantes similares</p>';
    }
}

/**
 * Display similar restaurants
 */
function displaySimilarRestaurants(restaurants) {
    const container = document.getElementById('similarList');
    
    container.innerHTML = restaurants.map(rest => `
        <div class="similar-item" onclick="window.location.href='restaurant-detail.html?id=${rest._id}'">
            <div class="similar-icon">🍽️</div>
            <div class="similar-info">
                <h4>${sanitizeHTML(rest.nombre)}</h4>
                <p>⭐ ${(rest.promedioCalificacion || 0).toFixed(1)} • ${rest.totalReseñas || 0} reseñas</p>
            </div>
        </div>
    `).join('');
}

/**
 * Update load more button
 */
function updateLoadMoreButton(pagination) {
    const container = document.getElementById('loadMoreContainer');
    const btn = document.getElementById('loadMoreBtn');
    
    if (pagination && pagination.page < pagination.totalPages) {
        hasMoreReviews = true;
        container.style.display = 'block';
    } else {
        hasMoreReviews = false;
        container.style.display = 'none';
    }
}

/**
 * Load more reviews
 */
async function loadMoreReviews() {
    reviewsPage++;
    // Implementation depends on your API pagination
    showToast('Función próximamente disponible', 'info');
}

/**
 * Handle share
 */
function handleShare() {
    if (navigator.share) {
        navigator.share({
            title: restaurant.nombre,
            text: `Mira este restaurante en FoodieRank: ${restaurant.nombre}`,
            url: window.location.href
        }).catch(() => {
            copyToClipboard(window.location.href);
        });
    } else {
        copyToClipboard(window.location.href);
    }
}

/**
 * Handle directions
 */
function handleDirections() {
    if (restaurant && restaurant.ubicacion) {
        const query = encodeURIComponent(restaurant.ubicacion);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    } else {
        showToast('Ubicación no disponible', 'warning');
    }
}

// Initialize page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}

// Export functions for global use
window.cancelReview = cancelReview;
window.toggleReviewMenu = toggleReviewMenu;
window.editReview = editReview;
window.confirmDeleteReview = confirmDeleteReview;
window.closeEditModal = closeEditModal;
window.closeDeleteModal = closeDeleteModal;
window.handleLike = handleLike;
window.handleDislike = handleDislike;