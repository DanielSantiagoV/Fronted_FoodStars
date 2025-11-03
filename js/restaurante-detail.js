/**
 * FoodieRank - Restaurant Detail Page Logic
 * Handles restaurant details, dishes, and reviews
 */

// Estado de la página - Variables globales para almacenar el estado de la página
// Page state
// ID del restaurante actual obtenido de la URL
let restaurantId = null;
// Objeto con los datos del restaurante actual
let restaurant = null;
// Array que almacena todas las reseñas del restaurante
let reviews = [];
// Reseña del usuario actual si existe (null si no ha escrito reseña)
let userReview = null;
// ID de la reseña que se está editando actualmente (null si no hay edición)
let currentEditReviewId = null;
// Página actual de reseñas en la paginación (inicia en 1)
let reviewsPage = 1;
// Indica si hay más reseñas para cargar (true si hay más páginas)
let hasMoreReviews = false;
// Array que almacena todas las categorías para mapear categoriaId a nombre
let categories = [];  // Para mapear categoriaId a nombre

/**
 * Inicializa la página
 * Obtiene el ID del restaurante de la URL, carga las categorías y los datos del restaurante
 */
async function initPage() {
    // Obtiene el ID del restaurante desde la URL
    // Obtiene todos los parámetros de consulta de la URL actual
    const params = getQueryParams();
    // Extrae el ID del restaurante del parámetro 'id'
    restaurantId = params.id;
    
    // Si no hay ID de restaurante en la URL
    if (!restaurantId) {
        // Muestra un mensaje de error indicando que el ID no es válido
        showToast('ID de restaurante no válido', 'error');
        // Espera 2 segundos y redirige a la página de restaurantes
        setTimeout(() => window.location.href = 'restaurants.html', 2000);
        // Termina la ejecución
        return;
    }
    
    // Carga las categorías primero para mapear IDs a nombres
    try {
        // Realiza una petición al API para obtener todas las categorías
        const categoriesRes = await api.getCategories();
        // Verifica si la respuesta fue exitosa y tiene datos
        if (categoriesRes.success && categoriesRes.data) {
            // Guarda las categorías en la variable global
            categories = categoriesRes.data;
        }
    } catch (error) {
        // Si hay un error al cargar las categorías, lo registra en la consola
        console.error('Error loading categories:', error);
    }
    
    // Carga los datos
    // Usa Promise.all para cargar restaurante, reseñas y platos en paralelo
    await Promise.all([
        loadRestaurant(),
        loadReviews(),
        loadDishes()
    ]);
    
    // Configura los event listeners
    // Agrega todos los listeners necesarios para interactividad
    setupEventListeners();
}

/**
 * Configura los event listeners
 * Agrega todos los listeners necesarios para la interactividad de la página
 */
function setupEventListeners() {
    // Botón para escribir reseña
    // Obtiene el elemento del botón para escribir reseña
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    // Si el botón existe
    if (writeReviewBtn) {
        // Agrega un listener al evento 'click' que muestra el formulario de reseña
        writeReviewBtn.addEventListener('click', showReviewForm);
    }
    
    // Formulario de reseña
    // Obtiene el elemento del formulario de reseña
    const reviewForm = document.getElementById('reviewForm');
    // Si el formulario existe
    if (reviewForm) {
        // Agrega un listener al evento 'submit' que maneja el envío del formulario
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
    
    // Contador de caracteres
    // Obtiene el elemento del textarea de comentario
    const reviewComment = document.getElementById('reviewComment');
    // Si el elemento existe
    if (reviewComment) {
        // Agrega un listener al evento 'input' que actualiza el contador de caracteres
        reviewComment.addEventListener('input', updateCharCount);
    }
    
    // Contador de caracteres del formulario de edición
    // Obtiene el elemento del textarea de comentario de edición
    const editReviewComment = document.getElementById('editReviewComment');
    // Si el elemento existe
    if (editReviewComment) {
        // Agrega un listener al evento 'input' que actualiza el contador de caracteres de edición
        editReviewComment.addEventListener('input', updateEditCharCount);
    }
    
    // Calificación por estrellas
    // Configura el sistema de estrellas para el formulario de nueva reseña
    setupStarRating('starRating', 'ratingInput');
    // Configura el sistema de estrellas para el formulario de edición
    setupStarRating('editStarRating', 'editRatingInput');
    
    // Formulario de edición
    // Obtiene el elemento del formulario de edición de reseña
    const editReviewForm = document.getElementById('editReviewForm');
    // Si el formulario existe
    if (editReviewForm) {
        // Agrega un listener al evento 'submit' que maneja el envío del formulario de edición
        editReviewForm.addEventListener('submit', handleEditReviewSubmit);
    }
    
    // Botón para cargar más reseñas
    // Obtiene el elemento del botón para cargar más reseñas
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    // Si el botón existe
    if (loadMoreBtn) {
        // Agrega un listener al evento 'click' que carga más reseñas
        loadMoreBtn.addEventListener('click', loadMoreReviews);
    }
    
    // Botón de compartir
    // Obtiene el elemento del botón para compartir
    const shareBtn = document.getElementById('shareBtn');
    // Si el botón existe
    if (shareBtn) {
        // Agrega un listener al evento 'click' que maneja la acción de compartir
        shareBtn.addEventListener('click', handleShare);
    }
    
    // Botón de direcciones
    // Obtiene el elemento del botón para obtener direcciones
    const directionsBtn = document.getElementById('directionsBtn');
    // Si el botón existe
    if (directionsBtn) {
        // Agrega un listener al evento 'click' que abre Google Maps con la ubicación
        directionsBtn.addEventListener('click', handleDirections);
    }
}

/**
 * Carga los datos del restaurante desde el servidor
 * Realiza una petición al API y muestra toda la información del restaurante
 */
async function loadRestaurant() {
    try {
        // Realiza una petición al API para obtener el restaurante por su ID
        const response = await api.getRestaurant(restaurantId);
        
        // Verifica si la respuesta fue exitosa y tiene datos
        if (response.success && response.data) {
            // Guarda los datos del restaurante en la variable global
            restaurant = response.data;
            // Muestra la sección hero del restaurante (imagen de fondo, título, rating)
            displayRestaurantHero(restaurant);
            // Muestra la información detallada del restaurante
            displayRestaurantInfo(restaurant);
            // Muestra el desglose de calificaciones (barras por estrellas)
            displayRatingBreakdown(restaurant);
            // Muestra la ubicación del restaurante
            displayLocation(restaurant);
            // Cargar restaurantes similares por categoría
            // Si el restaurante tiene categoriaId
            if (restaurant.categoriaId) {
                // Si tenemos categoriaId, buscar el nombre de la categoría para filtrar
                // Por ahora usar categoriaId directamente
                loadSimilarRestaurants(null, restaurant.categoriaId);
            } else if (restaurant.categoria) {
                // Si solo tenemos el nombre de la categoría, usarlo directamente
                loadSimilarRestaurants(restaurant.categoria);
            }
        } else {
            // Si la respuesta no fue exitosa, lanza un error
            throw new Error('Restaurante no encontrado');
        }
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading restaurant:', error);
        // Muestra un mensaje de error al usuario
        showToast('Error al cargar el restaurante', 'error');
        // Espera 2 segundos y redirige a la página de restaurantes
        setTimeout(() => window.location.href = 'restaurants.html', 2000);
    }
}

/**
 * Muestra la sección hero del restaurante
 * Crea el header principal con imagen de fondo, título, rating e información básica
 * @param {object} rest - Datos del restaurante
 */
function displayRestaurantHero(rest) {
    // Obtiene el elemento del hero del restaurante
    const hero = document.getElementById('restaurantHero');
    // Backend retorna calificacionPromedio
    // Obtiene la calificación promedio del restaurante (puede venir como 'calificacionPromedio' o 'promedioCalificacion')
    const rating = rest.calificacionPromedio || rest.promedioCalificacion || 0;
    // Genera el HTML de las estrellas basándose en la calificación
    const stars = generateStars(rating);
    // Obtiene el total de reseñas del restaurante, o 0 si no existe
    const reviewCount = rest.totalReseñas || 0;
    
    // Determinar si hay imagen (Base64 o URL)
    // Verifica si existe imagen y si es Base64 (empieza con 'data:image') o URL (empieza con 'http')
    const hasImage = rest.imagen && (rest.imagen.startsWith('data:image') || rest.imagen.startsWith('http'));
    // Si hay imagen
    if (hasImage) {
        // Establece la imagen como fondo del hero
        hero.style.backgroundImage = `url('${rest.imagen}')`;
        // Establece el tamaño del fondo para cubrir todo el contenedor
        hero.style.backgroundSize = 'cover';
        // Establece la posición del fondo en el centro
        hero.style.backgroundPosition = 'center';
    } else {
        // Si no hay imagen, limpia el fondo
        hero.style.backgroundImage = '';
    }
    
    // Establece el HTML interno del hero con toda la información del restaurante
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
                        <span>${getCategoryName(rest) || 'General'}</span>
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
    
    // Actualiza el título de la página
    // Establece el título del documento HTML con el nombre del restaurante
    document.title = `${rest.nombre} - FoodieRank`;
}

/**
 * Muestra la información del restaurante
 * Actualiza la tarjeta de información con la descripción y etiquetas
 * @param {object} rest - Datos del restaurante
 */
function displayRestaurantInfo(rest) {
    // Obtiene el elemento de la tarjeta de información
    const infoCard = document.getElementById('infoCard');
    
    // Establece el HTML interno con la descripción y etiquetas
    infoCard.innerHTML = `
        <p class="restaurant-description">${sanitizeHTML(rest.descripcion || 'Sin descripción disponible.')}</p>
        <div class="info-tags">
            <span class="info-tag">${getCategoryIcon(getCategoryName(rest))} ${getCategoryName(rest) || 'General'}</span>
            ${rest.popularidad > 70 ? '<span class="info-tag">⭐ Popular</span>' : ''}
        </div>
    `;
}

/**
 * Carga los platos del restaurante desde el servidor
 * Realiza una petición al API y muestra los platos disponibles
 */
async function loadDishes() {
    // Obtiene el elemento del grid donde se mostrarán los platos
    const grid = document.getElementById('dishesGrid');
    
    try {
        // Realiza una petición al API para obtener los platos del restaurante
        const response = await api.getRestaurantDishes(restaurantId);
        
        // Verifica si la respuesta fue exitosa y tiene datos
        if (response.success && response.data && response.data.length > 0) {
            // Muestra solo los primeros 4 platos
            displayDishes(response.data.slice(0, 4)); // Show only 4
        } else {
            // Si no hay platos, muestra un mensaje indicando que no hay platos disponibles
            grid.innerHTML = '<p style="color: var(--gray-600); text-align: center;">No hay platos disponibles</p>';
        }
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading dishes:', error);
        // Muestra un mensaje indicando que no hay platos disponibles
        grid.innerHTML = '<p style="color: var(--gray-600); text-align: center;">No hay platos disponibles</p>';
    }
}

/**
 * Muestra los platos en el grid
 * Crea tarjetas para cada plato con su información
 * @param {array} dishes - Array de platos a mostrar
 */
function displayDishes(dishes) {
    // Obtiene el elemento del grid donde se mostrarán los platos
    const grid = document.getElementById('dishesGrid');
    
    // Crea HTML para cada plato y lo concatena
    grid.innerHTML = dishes.map(dish => {
        // Determinar si hay imagen (Base64 o URL)
        // Verifica si existe imagen y si es Base64 (empieza con 'data:image') o URL (empieza con 'http')
        const hasImage = dish.imagen && (dish.imagen.startsWith('data:image') || dish.imagen.startsWith('http'));
        // Si hay imagen, usa la imagen del plato, sino usa cadena vacía
        const imageSrc = hasImage ? dish.imagen : '';
        
        // Retorna el HTML de la tarjeta del plato
        return `
        <div class="dish-card">
            ${imageSrc 
                ? `<div class="dish-image" style="background-image: url('${imageSrc}'); background-size: cover; background-position: center; width: 100%; height: 200px; border-radius: 12px; margin-bottom: 1rem;"></div>`
                : `<span class="dish-icon">🍽️</span>`
            }
            <h4>${sanitizeHTML(dish.nombre)}</h4>
            <p>${truncateText(sanitizeHTML(dish.descripcion || ''), 80)}</p>
            ${dish.precio ? `<div class="dish-price">$${formatNumber(dish.precio)}</div>` : ''}
        </div>
        `;
    }).join('');
}

/**
 * Carga las reseñas del restaurante desde el servidor
 * Realiza una petición al API y muestra todas las reseñas
 */
async function loadReviews() {
    // Obtiene el elemento de la lista donde se mostrarán las reseñas
    const list = document.getElementById('reviewsList');
    // Si el elemento no existe
    if (!list) {
        // Registra un error en la consola
        console.error('Elemento reviewsList no encontrado');
        // Termina la ejecución
        return;
    }
    
    // Muestra un estado de carga mientras se obtienen las reseñas
    list.innerHTML = '<div class="loading-state"><div class="loader"></div></div>';
    
    try {
        // Realiza una petición al API para obtener las reseñas del restaurante
        const response = await api.getRestaurantReviews(restaurantId);
        
        // Verifica si la respuesta fue exitosa
        if (response.success) {
            // response.data puede ser un array vacío o null
            // Guarda las reseñas en la variable global, asegurándose de que sea un array
            reviews = Array.isArray(response.data) ? response.data : [];
            // Muestra las reseñas en la lista
            displayReviews(reviews);
            // Verifica si el usuario actual ya tiene una reseña
            checkUserReview();
            // Actualizar botón de cargar más si hay información de paginación
            // Si hay información de paginación
            if (response.pagination) {
                // Actualiza el botón de cargar más con la información de paginación
                updateLoadMoreButton(response.pagination);
            } else {
                // Si no hay paginación, actualiza el botón con null (ocultarlo)
                updateLoadMoreButton(null);
            }
        } else {
            // Si la respuesta no fue exitosa, lanza un error
            throw new Error(response.message || 'Error al cargar reseñas');
        }
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading reviews:', error);
        // Muestra un mensaje de error con opción de reintentar
        list.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--danger);">
                <p style="margin-bottom: 1rem;">Error al cargar reseñas</p>
                <p style="font-size: 0.9rem; color: var(--gray-600);">${error.message || 'Por favor intenta nuevamente'}</p>
                <button class="btn-outline" onclick="loadReviews()" style="margin-top: 1rem;">Reintentar</button>
            </div>
        `;
    }
}

/**
 * Muestra las reseñas en la lista
 * Crea tarjetas para cada reseña con toda su información y acciones disponibles
 * @param {array} reviewsToDisplay - Array de reseñas a mostrar
 */
function displayReviews(reviewsToDisplay) {
    // Obtiene el elemento de la lista donde se mostrarán las reseñas
    const list = document.getElementById('reviewsList');
    // Obtiene el usuario actual autenticado
    const currentUser = getCurrentUser();
    
    // Verifica si hay reseñas para mostrar
    if (!reviewsToDisplay || reviewsToDisplay.length === 0) {
        // Si no hay reseñas, muestra un mensaje invitando a escribir la primera
        list.innerHTML = '<p style="color: var(--gray-600); text-align: center; padding: 2rem;">No hay reseñas aún. ¡Sé el primero en escribir una!</p>';
        // Termina la ejecución
        return;
    }
    
    // Crea HTML para cada reseña y lo concatena
    list.innerHTML = reviewsToDisplay.map(review => {
        // Determina si el usuario actual es el dueño de esta reseña
        const isOwner = currentUser && review.usuario && (review.usuario._id === currentUser._id || review.usuario === currentUser._id);
        // Obtiene el nombre del usuario (nombre completo, email o 'Usuario' por defecto)
        const userName = review.usuario?.nombre || review.usuario?.email || 'Usuario';
        // Genera las iniciales del usuario (primeras letras de cada palabra, máximo 2)
        const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        // Genera el HTML de las estrellas basándose en la calificación
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
 * Verifica si el usuario actual ya tiene una reseña
 * Oculta o muestra el botón de escribir reseña según si el usuario ya escribió una
 */
function checkUserReview() {
    // Si el usuario no está autenticado
    if (!isAuthenticated()) {
        // Oculta el botón de escribir reseña
        document.getElementById('writeReviewBtn').style.display = 'none';
        // Termina la ejecución
        return;
    }
    
    // Obtiene el usuario actual autenticado
    const currentUser = getCurrentUser();
    // Busca la reseña del usuario actual en el array de reseñas
    userReview = reviews.find(r => r.usuario && (r.usuario._id === currentUser._id || r.usuario === currentUser._id));
    
    // Obtiene el botón de escribir reseña
    const writeBtn = document.getElementById('writeReviewBtn');
    // Si el usuario ya tiene una reseña
    if (userReview) {
        // Oculta el botón de escribir reseña
        writeBtn.style.display = 'none';
    } else {
        // Si no tiene reseña, muestra el botón
        writeBtn.style.display = 'flex';
    }
}

/**
 * Configura el sistema de calificación por estrellas
 * Agrega listeners a los botones de estrellas para seleccionar la calificación
 * @param {string} containerId - ID del contenedor con las estrellas
 * @param {string} inputId - ID del input oculto que almacena la calificación
 */
function setupStarRating(containerId, inputId) {
    // Obtiene el contenedor de las estrellas
    const container = document.getElementById(containerId);
    // Obtiene el input oculto que almacenará la calificación
    const input = document.getElementById(inputId);
    
    // Si alguno de los elementos no existe, termina la ejecución
    if (!container || !input) return;
    
    // Obtiene todos los botones de estrellas del contenedor
    const stars = container.querySelectorAll('.star-btn');
    
    // Itera sobre cada botón de estrella
    stars.forEach((star, index) => {
        // Agrega un listener al evento 'click' de cada estrella
        star.addEventListener('click', () => {
            // Calcula la calificación (índice + 1, ya que index es 0-based)
            const rating = index + 1;
            // Establece el valor del input oculto con la calificación seleccionada
            input.value = rating;
            
            // Actualiza la visualización de las estrellas
            // Itera sobre todas las estrellas para actualizar su apariencia
            stars.forEach((s, i) => {
                // Si el índice es menor que la calificación seleccionada
                if (i < rating) {
                    // Muestra la estrella completa
                    s.textContent = '★';
                    // Agrega la clase 'active' para resaltarla
                    s.classList.add('active');
                } else {
                    // Si el índice es mayor o igual, muestra la estrella vacía
                    s.textContent = '☆';
                    // Remueve la clase 'active'
                    s.classList.remove('active');
                }
            });
        });
    });
}

/**
 * Muestra el formulario de reseña
 * Hace visible el formulario y oculta el botón de escribir reseña
 */
function showReviewForm() {
    // Verifica que el usuario esté autenticado, si no, termina la ejecución
    if (!requireAuth()) return;
    
    // Obtiene el contenedor del formulario de reseña
    const container = document.getElementById('reviewFormContainer');
    // Muestra el contenedor del formulario
    container.style.display = 'block';
    // Hace scroll suave hacia el formulario para que sea visible
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // Oculta el botón de escribir reseña
    document.getElementById('writeReviewBtn').style.display = 'none';
}

/**
 * Cancela la escritura de reseña
 * Oculta el formulario y resetea todos los campos
 */
function cancelReview() {
    // Oculta el contenedor del formulario de reseña
    document.getElementById('reviewFormContainer').style.display = 'none';
    // Resetea el formulario (limpia todos los campos)
    document.getElementById('reviewForm').reset();
    // Limpia el valor del input oculto de calificación
    document.getElementById('ratingInput').value = '';
    // Resetea todas las estrellas a estado vacío
    document.querySelectorAll('#starRating .star-btn').forEach(s => {
        // Establece cada estrella como vacía
        s.textContent = '☆';
        // Remueve la clase 'active' de cada estrella
        s.classList.remove('active');
    });
    // Resetea el contador de caracteres a 0
    document.getElementById('charCount').textContent = '0';
    
    // Si el usuario no tiene una reseña
    if (!userReview) {
        // Muestra nuevamente el botón de escribir reseña
        document.getElementById('writeReviewBtn').style.display = 'flex';
    }
}

/**
 * Maneja el envío del formulario de reseña
 * Valida los datos y crea la reseña en el servidor
 * @param {Event} e - Evento de envío del formulario
 */
async function handleReviewSubmit(e) {
    // Previene el comportamiento por defecto del formulario (recargar la página)
    e.preventDefault();
    
    // Obtiene el formulario que disparó el evento
    const form = e.target;
    // Obtiene el botón de envío del formulario
    const submitBtn = form.querySelector('button[type="submit"]');
    // Obtiene el valor de la calificación desde el input oculto
    const rating = document.getElementById('ratingInput').value;
    // Obtiene el comentario del textarea y elimina espacios al inicio y final
    const comment = document.getElementById('reviewComment').value.trim();
    
    // Valida que se haya seleccionado una calificación
    if (!rating) {
        // Muestra un mensaje de advertencia indicando que debe seleccionar una calificación
        showToast('Por favor selecciona una calificación', 'warning');
        // Termina la ejecución
        return;
    }
    
    // Valida que el comentario tenga al menos 10 caracteres
    if (comment.length < 10) {
        // Muestra un mensaje de advertencia indicando la longitud mínima requerida
        showToast('La reseña debe tener al menos 10 caracteres', 'warning');
        // Termina la ejecución
        return;
    }
    
    // Deshabilita el botón de envío para evitar múltiples envíos
    submitBtn.disabled = true;
    // Guarda el texto original del botón para restaurarlo después
    const originalText = submitBtn.textContent;
    // Cambia el texto del botón a 'Publicando...' para indicar que está procesando
    submitBtn.textContent = 'Publicando...';
    
    try {
        // Realiza una petición al API para crear la reseña
        const response = await api.createReview({
            restauranteId: restaurantId,  // Backend espera restauranteId
            // Convierte la calificación a número entero
            calificacion: parseInt(rating),
            // Envía el comentario
            comentario: comment
        });
        
        // Verifica si la respuesta fue exitosa
        if (response.success) {
            // Muestra un mensaje de éxito
            showToast(CONFIG.MESSAGES.SUCCESS.REVIEW_CREATED, 'success');
            // Cancela el formulario (lo oculta y limpia)
            cancelReview();
            // Recarga las reseñas para mostrar la nueva
            await loadReviews();
            // Recarga el restaurante para actualizar el rating promedio
            await loadRestaurant(); // Refresh rating
        } else {
            // Si la respuesta no fue exitosa, lanza un error
            throw new Error(response.message || 'Error al crear reseña');
        }
    } catch (error) {
        // Si hay un error durante la creación
        // Registra el error en la consola para depuración
        console.error('Error creating review:', error);
        // Muestra un mensaje de error al usuario
        showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
    } finally {
        // Independientemente del resultado, rehabilita el botón
        submitBtn.disabled = false;
        // Restaura el texto original del botón
        submitBtn.textContent = originalText;
    }
}

/**
 * Actualiza el contador de caracteres
 * Muestra la cantidad de caracteres escritos en el comentario
 * @param {Event} e - Evento de input del textarea
 */
function updateCharCount(e) {
    // Obtiene la longitud del texto del textarea
    const count = e.target.value.length;
    // Actualiza el texto del contador con la cantidad de caracteres
    document.getElementById('charCount').textContent = count;
}

/**
 * Actualiza el contador de caracteres del formulario de edición
 * Muestra la cantidad de caracteres escritos en el comentario de edición
 * @param {Event} e - Evento de input del textarea de edición
 */
function updateEditCharCount(e) {
    // Obtiene la longitud del texto del textarea de edición
    const count = e.target.value.length;
    // Actualiza el texto del contador de edición con la cantidad de caracteres
    document.getElementById('editCharCount').textContent = count;
}

/**
 * Alterna el menú desplegable de una reseña
 * Muestra u oculta el menú de opciones de una reseña específica
 * @param {string} reviewId - ID de la reseña
 */
function toggleReviewMenu(reviewId) {
    // Obtiene el menú desplegable de la reseña específica
    const menu = document.getElementById(`menu-${reviewId}`);
    // Obtiene todos los menús desplegables de reseñas
    const allMenus = document.querySelectorAll('.review-dropdown');
    
    // Cierra todos los demás menús (solo uno puede estar abierto a la vez)
    allMenus.forEach(m => {
        // Si no es el menú actual, lo cierra removiendo la clase 'active'
        if (m !== menu) m.classList.remove('active');
    });
    
    // Alterna la clase 'active' del menú actual (lo muestra u oculta)
    menu.classList.toggle('active');
}

/**
 * Abre el formulario de edición de reseña
 * Carga los datos de la reseña en el formulario de edición
 * @param {string} reviewId - ID de la reseña a editar
 */
function editReview(reviewId) {
    // Busca la reseña en el array de reseñas por su ID
    const review = reviews.find(r => r._id === reviewId);
    // Si no se encuentra la reseña, termina la ejecución
    if (!review) return;
    
    // Guarda el ID de la reseña que se está editando
    currentEditReviewId = reviewId;
    
    // Establece los valores del formulario
    // Establece la calificación en el input oculto
    document.getElementById('editRatingInput').value = review.calificacion;
    // Establece el comentario en el textarea
    document.getElementById('editReviewComment').value = review.comentario;
    // Establece el contador de caracteres con la longitud del comentario
    document.getElementById('editCharCount').textContent = review.comentario.length;
    
    // Establece las estrellas visuales
    // Obtiene todos los botones de estrellas del formulario de edición
    const stars = document.querySelectorAll('#editStarRating .star-btn');
    // Itera sobre cada estrella
    stars.forEach((star, index) => {
        // Si el índice es menor que la calificación de la reseña
        if (index < review.calificacion) {
            // Muestra la estrella completa
            star.textContent = '★';
            // Agrega la clase 'active' para resaltarla
            star.classList.add('active');
        } else {
            // Si el índice es mayor o igual, muestra la estrella vacía
            star.textContent = '☆';
            // Remueve la clase 'active'
            star.classList.remove('active');
        }
    });
    
    // Muestra el modal de edición
    // Agrega la clase 'active' al modal para hacerlo visible
    document.getElementById('editReviewModal').classList.add('active');
    
    // Cierra el menú desplegable
    // Oculta el menú de opciones de la reseña
    toggleReviewMenu(reviewId);
}

/**
 * Cierra el modal de edición
 * Oculta el modal y limpia el ID de edición actual
 */
function closeEditModal() {
    // Remueve la clase 'active' del modal para ocultarlo
    document.getElementById('editReviewModal').classList.remove('active');
    // Limpia el ID de la reseña que se estaba editando
    currentEditReviewId = null;
}

/**
 * Maneja el envío del formulario de edición de reseña
 * Valida los datos y actualiza la reseña en el servidor
 * @param {Event} e - Evento de envío del formulario
 */
async function handleEditReviewSubmit(e) {
    // Previene el comportamiento por defecto del formulario (recargar la página)
    e.preventDefault();
    
    // Si no hay una reseña siendo editada, termina la ejecución
    if (!currentEditReviewId) return;
    
    // Obtiene el formulario que disparó el evento
    const form = e.target;
    // Obtiene el botón de envío del formulario
    const submitBtn = form.querySelector('button[type="submit"]');
    // Obtiene el valor de la calificación desde el input oculto
    const rating = document.getElementById('editRatingInput').value;
    // Obtiene el comentario del textarea y elimina espacios al inicio y final
    const comment = document.getElementById('editReviewComment').value.trim();
    
    // Valida que se haya seleccionado una calificación y que el comentario tenga al menos 10 caracteres
    if (!rating || comment.length < 10) {
        // Muestra un mensaje de advertencia indicando que debe completar todos los campos correctamente
        showToast('Por favor completa todos los campos correctamente', 'warning');
        // Termina la ejecución
        return;
    }
    
    // Deshabilita el botón de envío para evitar múltiples envíos
    submitBtn.disabled = true;
    // Guarda el texto original del botón para restaurarlo después
    const originalText = submitBtn.textContent;
    // Cambia el texto del botón a 'Actualizando...' para indicar que está procesando
    submitBtn.textContent = 'Actualizando...';
    
    try {
        // Realiza una petición al API para actualizar la reseña
        const response = await api.updateReview(currentEditReviewId, {
            // Convierte la calificación a número entero
            calificacion: parseInt(rating),
            // Envía el comentario actualizado
            comentario: comment
        });
        
        // Verifica si la respuesta fue exitosa
        if (response.success) {
            // Muestra un mensaje de éxito
            showToast(CONFIG.MESSAGES.SUCCESS.REVIEW_UPDATED, 'success');
            // Cierra el modal de edición
            closeEditModal();
            // Recarga las reseñas para mostrar la actualizada
            await loadReviews();
            // Recarga el restaurante para actualizar el rating promedio
            await loadRestaurant();
        } else {
            // Si la respuesta no fue exitosa, lanza un error
            throw new Error(response.message || 'Error al actualizar reseña');
        }
    } catch (error) {
        // Si hay un error durante la actualización
        // Registra el error en la consola para depuración
        console.error('Error updating review:', error);
        // Muestra un mensaje de error al usuario
        showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
    } finally {
        // Independientemente del resultado, rehabilita el botón
        submitBtn.disabled = false;
        // Restaura el texto original del botón
        submitBtn.textContent = originalText;
    }
}

/**
 * Confirma la eliminación de una reseña
 * Abre el modal de confirmación para eliminar una reseña
 * @param {string} reviewId - ID de la reseña a eliminar
 */
function confirmDeleteReview(reviewId) {
    // Guarda el ID de la reseña que se va a eliminar
    currentEditReviewId = reviewId;
    // Muestra el modal de confirmación de eliminación agregando la clase 'active'
    document.getElementById('deleteModal').classList.add('active');
    // Cierra el menú desplegable de la reseña
    toggleReviewMenu(reviewId);
    
    // Obtiene el botón de confirmación de eliminación
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    // Configura el onclick del botón para ejecutar la eliminación
    confirmBtn.onclick = () => deleteReview(reviewId);
}

/**
 * Cierra el modal de confirmación de eliminación
 * Oculta el modal y limpia el ID de eliminación actual
 */
function closeDeleteModal() {
    // Remueve la clase 'active' del modal para ocultarlo
    document.getElementById('deleteModal').classList.remove('active');
    // Limpia el ID de la reseña que se estaba eliminando
    currentEditReviewId = null;
}

/**
 * Elimina una reseña
 * Realiza la eliminación de la reseña en el servidor
 * @param {string} reviewId - ID de la reseña a eliminar
 */
async function deleteReview(reviewId) {
    // Obtiene el botón de confirmación de eliminación
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    // Deshabilita el botón para evitar múltiples clics
    confirmBtn.disabled = true;
    // Guarda el texto original del botón para restaurarlo después
    const originalText = confirmBtn.textContent;
    // Cambia el texto del botón a 'Eliminando...' para indicar que está procesando
    confirmBtn.textContent = 'Eliminando...';
    
    try {
        // Realiza una petición al API para eliminar la reseña
        const response = await api.deleteReview(reviewId);
        
        // Verifica si la respuesta fue exitosa
        if (response.success) {
            // Muestra un mensaje de éxito
            showToast(CONFIG.MESSAGES.SUCCESS.REVIEW_DELETED, 'success');
            // Cierra el modal de confirmación
            closeDeleteModal();
            // Recarga las reseñas para reflejar la eliminación
            await loadReviews();
            // Recarga el restaurante para actualizar el rating promedio
            await loadRestaurant();
        } else {
            // Si la respuesta no fue exitosa, lanza un error
            throw new Error(response.message || 'Error al eliminar reseña');
        }
    } catch (error) {
        // Si hay un error durante la eliminación
        // Registra el error en la consola para depuración
        console.error('Error deleting review:', error);
        // Muestra un mensaje de error al usuario
        showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
    } finally {
        // Independientemente del resultado, rehabilita el botón
        confirmBtn.disabled = false;
        // Restaura el texto original del botón
        confirmBtn.textContent = originalText;
    }
}

/**
 * Maneja el like de una reseña
 * Envía la acción de like al servidor y recarga las reseñas
 * @param {string} reviewId - ID de la reseña a la cual dar like
 */
async function handleLike(reviewId) {
    // Verifica que el usuario esté autenticado, si no, termina la ejecución
    if (!requireAuth()) return;
    
    try {
        // Realiza una petición al API para dar like a la reseña
        await api.likeReview(reviewId);
        // Recarga las reseñas para reflejar el cambio
        await loadReviews();
    } catch (error) {
        // Si hay un error durante el like
        // Registra el error en la consola para depuración
        console.error('Error liking review:', error);
        // Muestra un mensaje de error al usuario
        showToast('Error al dar like', 'error');
    }
}

/**
 * Maneja el dislike de una reseña
 * Envía la acción de dislike al servidor y recarga las reseñas
 * @param {string} reviewId - ID de la reseña a la cual dar dislike
 */
async function handleDislike(reviewId) {
    // Verifica que el usuario esté autenticado, si no, termina la ejecución
    if (!requireAuth()) return;
    
    try {
        // Realiza una petición al API para dar dislike a la reseña
        await api.dislikeReview(reviewId);
        // Recarga las reseñas para reflejar el cambio
        await loadReviews();
    } catch (error) {
        // Si hay un error durante el dislike
        // Registra el error en la consola para depuración
        console.error('Error disliking review:', error);
        // Muestra un mensaje de error al usuario
        showToast('Error al dar dislike', 'error');
    }
}

/**
 * Muestra el desglose de calificaciones
 * Crea barras de progreso mostrando la distribución de calificaciones por estrellas
 * @param {object} rest - Datos del restaurante
 */
function displayRatingBreakdown(rest) {
    // Obtiene el contenedor donde se mostrarán las barras de calificación
    const container = document.getElementById('ratingBars');
    
    // Datos simulados - ajustar según tu API
    // Crea un array con la distribución estimada de calificaciones por estrellas
    const breakdown = [
        // 50% de las reseñas son de 5 estrellas
        { stars: 5, count: Math.floor((rest.totalReseñas || 0) * 0.5) },
        // 25% de las reseñas son de 4 estrellas
        { stars: 4, count: Math.floor((rest.totalReseñas || 0) * 0.25) },
        // 15% de las reseñas son de 3 estrellas
        { stars: 3, count: Math.floor((rest.totalReseñas || 0) * 0.15) },
        // 7% de las reseñas son de 2 estrellas
        { stars: 2, count: Math.floor((rest.totalReseñas || 0) * 0.07) },
        // 3% de las reseñas son de 1 estrella
        { stars: 1, count: Math.floor((rest.totalReseñas || 0) * 0.03) }
    ];
    
    // Obtiene el total de reseñas (usa 1 como mínimo para evitar división por cero)
    const total = rest.totalReseñas || 1;
    
    // Crea HTML para cada barra de calificación y lo concatena
    container.innerHTML = breakdown.map(item => {
        // Calcula el porcentaje que representa esta calificación del total
        const percentage = (item.count / total) * 100;
        // Retorna el HTML de la barra de calificación
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
 * Muestra la ubicación del restaurante
 * Actualiza el texto con la ubicación del restaurante
 * @param {object} rest - Datos del restaurante
 */
function displayLocation(rest) {
    // Obtiene el elemento del texto de ubicación
    const locationText = document.getElementById('locationText');
    // Establece el texto con la ubicación del restaurante o un mensaje por defecto
    locationText.textContent = rest.ubicacion || 'Ubicación no especificada';
}

/**
 * Obtiene el nombre de la categoría del restaurante (por categoriaId o categoria)
 * Busca el nombre de la categoría basándose en el ID o el nombre directo
 * @param {object} restaurant - Objeto del restaurante
 * @returns {string|null} Nombre de la categoría o null si no se encuentra
 */
function getCategoryName(restaurant) {
    // Si el restaurante no existe, retorna null
    if (!restaurant) return null;
    
    // Si tiene categoriaId, buscar el nombre en las categorías cargadas
    // Verifica si el restaurante tiene categoriaId
    if (restaurant.categoriaId) {
        // Busca la categoría que coincida con el ID del restaurante
        const category = categories.find(c => 
            // Compara el ID directamente o como string
            c._id === restaurant.categoriaId || 
            c._id.toString() === restaurant.categoriaId.toString()
        );
        // Si se encuentra la categoría, retorna su nombre
        if (category) return category.nombre;
    }
    
    // Fallback: usar categoria si está disponible
    // Si no se encontró por ID, intenta usar el campo categoria directamente
    return restaurant.categoria || null;
}

/**
 * Carga restaurantes similares
 * Busca y muestra restaurantes de la misma categoría
 * @param {string} category - Nombre de la categoría
 * @param {string} categoriaId - ID de la categoría (opcional)
 */
async function loadSimilarRestaurants(category, categoriaId = null) {
    // Obtiene el contenedor donde se mostrarán los restaurantes similares
    const container = document.getElementById('similarList');
    
    try {
        // Crea un objeto con los parámetros para la petición (limita a 3)
        const params = { limite: 3 };
        // Si se proporciona categoriaId
        if (categoriaId) {
            // Usa el ID de la categoría para filtrar
            params.categoriaId = categoriaId;
        } else if (category) {
            // Si solo tenemos el nombre, intentar buscar la categoría
            // Usa el nombre de la categoría para filtrar
            params.categoria = category;
        }
        
        // Realiza una petición al API para obtener restaurantes con los parámetros
        const response = await api.getRestaurants(params);
        
        // Verifica si la respuesta fue exitosa y tiene datos
        if (response.success && response.data && response.data.length > 0) {
            // Filtra los restaurantes excluyendo el actual y toma solo los primeros 3
            const filtered = response.data.filter(r => r._id !== restaurantId).slice(0, 3);
            // Muestra los restaurantes similares filtrados
            displaySimilarRestaurants(filtered);
        } else {
            // Si no hay restaurantes similares, muestra un mensaje
            container.innerHTML = '<p style="color: var(--gray-600); font-size: 0.9rem;">No hay restaurantes similares</p>';
        }
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading similar restaurants:', error);
        // Muestra un mensaje indicando que no hay restaurantes similares
        container.innerHTML = '<p style="color: var(--gray-600); font-size: 0.9rem;">No hay restaurantes similares</p>';
    }
}

/**
 * Muestra los restaurantes similares
 * Crea elementos HTML para cada restaurante similar con su información
 * @param {array} restaurants - Array de restaurantes similares a mostrar
 */
function displaySimilarRestaurants(restaurants) {
    // Obtiene el contenedor donde se mostrarán los restaurantes similares
    const container = document.getElementById('similarList');
    
    // Crea HTML para cada restaurante similar y lo concatena
    container.innerHTML = restaurants.map(rest => `
        <div class="similar-item" onclick="window.location.href='restaurant-detail.html?id=${rest._id}'">
            <div class="similar-icon">🍽️</div>
            <div class="similar-info">
                <h4>${sanitizeHTML(rest.nombre)}</h4>
                <p>⭐ ${(rest.calificacionPromedio || rest.promedioCalificacion || 0).toFixed(1)} • ${rest.totalReseñas || 0} reseñas</p>
            </div>
        </div>
    `).join('');
}

/**
 * Actualiza el botón de cargar más reseñas
 * Muestra u oculta el botón según si hay más reseñas disponibles
 * @param {object|null} pagination - Información de paginación o null
 */
function updateLoadMoreButton(pagination) {
    // Obtiene el contenedor del botón de cargar más
    const container = document.getElementById('loadMoreContainer');
    // Obtiene el botón de cargar más
    const btn = document.getElementById('loadMoreBtn');
    
    // Si hay información de paginación y hay más páginas disponibles
    if (pagination && pagination.page < pagination.totalPages) {
        // Indica que hay más reseñas para cargar
        hasMoreReviews = true;
        // Muestra el contenedor del botón
        container.style.display = 'block';
    } else {
        // Si no hay más páginas
        // Indica que no hay más reseñas para cargar
        hasMoreReviews = false;
        // Oculta el contenedor del botón
        container.style.display = 'none';
    }
}

/**
 * Carga más reseñas
 * Incrementa la página y carga la siguiente página de reseñas (función placeholder)
 */
async function loadMoreReviews() {
    // Incrementa el número de página de reseñas
    reviewsPage++;
    // La implementación depende de la paginación de tu API
    // Muestra un mensaje indicando que la función está próxima
    showToast('Función próximamente disponible', 'info');
}

/**
 * Maneja la acción de compartir el restaurante
 * Usa la API nativa de compartir si está disponible, sino copia el enlace al portapapeles
 */
function handleShare() {
    // Si el navegador soporta la API de compartir
    if (navigator.share) {
        // Usa la API nativa de compartir
        navigator.share({
            // Título del contenido a compartir
            title: restaurant.nombre,
            // Texto descriptivo
            text: `Mira este restaurante en FoodieRank: ${restaurant.nombre}`,
            // URL a compartir
            url: window.location.href
        }).catch(() => {
            // Si falla o el usuario cancela, copia el enlace al portapapeles
            copyToClipboard(window.location.href);
        });
    } else {
        // Si el navegador no soporta la API de compartir, copia el enlace al portapapeles
        copyToClipboard(window.location.href);
    }
}

/**
 * Maneja la acción de obtener direcciones
 * Abre Google Maps con la ubicación del restaurante
 */
function handleDirections() {
    // Verifica que el restaurante existe y tiene ubicación
    if (restaurant && restaurant.ubicacion) {
        // Codifica la ubicación para que pueda usarse en una URL
        const query = encodeURIComponent(restaurant.ubicacion);
        // Abre Google Maps en una nueva pestaña con la búsqueda de la ubicación
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    } else {
        // Si no hay ubicación disponible, muestra un mensaje de advertencia
        showToast('Ubicación no disponible', 'warning');
    }
}

// Inicializa la página cuando el DOM está listo
// Verifica si el documento está cargando
if (document.readyState === 'loading') {
    // Si está cargando, espera a que el evento 'DOMContentLoaded' se dispare
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    // Si el DOM ya está listo, ejecuta directamente la inicialización
    initPage();
}

// Exporta funciones para uso global
// Hace la función cancelReview disponible globalmente a través de window
window.cancelReview = cancelReview;
// Hace la función toggleReviewMenu disponible globalmente a través de window
window.toggleReviewMenu = toggleReviewMenu;
// Hace la función editReview disponible globalmente a través de window
window.editReview = editReview;
// Hace la función confirmDeleteReview disponible globalmente a través de window
window.confirmDeleteReview = confirmDeleteReview;
// Hace la función closeEditModal disponible globalmente a través de window
window.closeEditModal = closeEditModal;
// Hace la función closeDeleteModal disponible globalmente a través de window
window.closeDeleteModal = closeDeleteModal;
// Hace la función handleLike disponible globalmente a través de window
window.handleLike = handleLike;
// Hace la función handleDislike disponible globalmente a través de window
window.handleDislike = handleDislike;
// Hace la función loadReviews disponible globalmente a través de window
window.loadReviews = loadReviews;