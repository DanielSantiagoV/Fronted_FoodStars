/**
 * FoodieRank - Restaurants Page Logic
 * Handles restaurant listing, filtering, and search
 */

// Page state
let currentPage = 1;
let totalPages = 1;
let currentView = 'grid';
let filters = {
    search: '',
    category: '',
    rating: 0,
    ordenarPor: 'ranking',
    orden: 'desc'
};
let categories = [];
let restaurants = [];

/**
 * Initialize page
 */
async function initPage() {
    // Load initial data
    await loadCategories();
    
    // Parse URL parameters
    parseURLParameters();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load restaurants
    await loadRestaurants();
}

/**
 * Parse URL parameters
 */
function parseURLParameters() {
    const params = getQueryParams();
    
    if (params.search) {
        filters.search = params.search;
        document.getElementById('searchInput').value = params.search;
        showClearButton();
    }
    
    if (params.category) {
        filters.category = params.category;
    }
    
    if (params.rating) {
        filters.rating = parseInt(params.rating);
    }
    
    // Backend usa ordenarPor y orden
    if (params.ordenarPor) {
        filters.ordenarPor = params.ordenarPor;
        filters.orden = params.orden || 'desc';
        document.getElementById('sortFilter').value = `${params.ordenarPor}-${params.orden || 'desc'}`;
    } else if (params.sort) {
        // Compatibilidad con formato anterior
        const parts = params.sort.split('-');
        if (parts.length === 2) {
            filters.ordenarPor = parts[0];
            filters.orden = parts[1];
        }
        document.getElementById('sortFilter').value = params.sort;
    }
    
    if (params.page) {
        currentPage = parseInt(params.page);
    } else if (params.saltar !== undefined) {
        // Calcular página desde saltar si se proporciona
        currentPage = Math.floor(params.saltar / CONFIG.PAGINATION.DEFAULT_LIMIT) + 1;
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(handleSearch, 500));
    
    // Clear search
    const clearSearch = document.getElementById('clearSearch');
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        filters.search = '';
        hideClearButton();
        updateURLAndReload();
    });
    
    // Filter toggle
    const filterToggle = document.getElementById('filterToggle');
    const sidebarFilters = document.getElementById('sidebarFilters');
    filterToggle.addEventListener('click', () => {
        sidebarFilters.classList.toggle('active');
    });
    
    // Clear all filters
    const clearFilters = document.getElementById('clearFilters');
    clearFilters.addEventListener('click', () => {
        resetFilters();
    });
    
    // Sort filter
    const sortFilter = document.getElementById('sortFilter');
    sortFilter.addEventListener('change', (e) => {
        // Parsear valor del formato "ordenarPor-orden"
        const value = e.target.value;
        if (value.includes('-')) {
            const [ordenarPor, orden] = value.split('-');
            filters.ordenarPor = ordenarPor;
            filters.orden = orden;
        } else {
            // Fallback para formato anterior
            filters.ordenarPor = 'ranking';
            filters.orden = 'desc';
        }
        currentPage = 1;
        updateURLAndReload();
    });
    
    // View toggle
    document.getElementById('gridView').addEventListener('click', () => setView('grid'));
    document.getElementById('listView').addEventListener('click', () => setView('list'));
    
    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => changePage(currentPage - 1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(currentPage + 1));
}

/**
 * Load categories
 */
async function loadCategories() {
    const container = document.getElementById('categoryFilters');
    container.innerHTML = '<div class="loading-state"><div class="loader"></div></div>';
    
    try {
        const response = await api.getCategories();
        
        if (response.success && response.data) {
            categories = response.data;
            displayCategoryFilters(categories);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        container.innerHTML = '<p style="color: var(--danger); text-align: center; font-size: 0.9rem;">Error al cargar categorías</p>';
    }
}

/**
 * Display category filters
 * @param {array} categoriesToDisplay - Categories to display
 */
function displayCategoryFilters(categoriesToDisplay) {
    const container = document.getElementById('categoryFilters');
    
    container.innerHTML = categoriesToDisplay.map(category => `
        <div class="filter-checkbox">
            <input 
                type="checkbox" 
                id="cat-${category._id}" 
                value="${category.nombre}"
                ${filters.category === category.nombre ? 'checked' : ''}
                onchange="handleCategoryChange('${category.nombre}')"
            >
            <label for="cat-${category._id}">
                <span>${getCategoryIcon(category.nombre)} ${category.nombre}</span>
            </label>
        </div>
    `).join('');
}

/**
 * Handle category change
 * @param {string} categoryName - Category name
 */
function handleCategoryChange(categoryName) {
    // Uncheck all other categories
    document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(cb => {
        if (cb.value !== categoryName) cb.checked = false;
    });
    
    const checkbox = document.querySelector(`#categoryFilters input[value="${categoryName}"]`);
    filters.category = checkbox.checked ? categoryName : '';
    currentPage = 1;
    updateURLAndReload();
}

/**
 * Setup rating filter
 */
function setupRatingFilter() {
    const ratingButtons = document.querySelectorAll('.star-btn');
    
    ratingButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const rating = parseInt(btn.dataset.rating);
            
            // Toggle rating
            if (filters.rating === rating) {
                filters.rating = 0;
                ratingButtons.forEach(b => b.classList.remove('active'));
            } else {
                filters.rating = rating;
                ratingButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
            
            currentPage = 1;
            updateURLAndReload();
        });
    });
    
    // Set initial active state
    if (filters.rating > 0) {
        const activeBtn = document.querySelector(`.star-btn[data-rating="${filters.rating}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }
}

/**
 * Handle search
 * @param {Event} e - Input event
 */
function handleSearch(e) {
    filters.search = e.target.value.trim();
    
    if (filters.search) {
        showClearButton();
    } else {
        hideClearButton();
    }
    
    currentPage = 1;
    updateURLAndReload();
}

/**
 * Show clear search button
 */
function showClearButton() {
    document.getElementById('clearSearch').style.display = 'flex';
}

/**
 * Hide clear search button
 */
function hideClearButton() {
    document.getElementById('clearSearch').style.display = 'none';
}

/**
 * Reset all filters
 */
function resetFilters() {
    filters = {
        search: '',
        category: '',
        rating: 0,
        ordenarPor: 'ranking',
        orden: 'desc'
    };
    
    document.getElementById('searchInput').value = '';
    document.getElementById('sortFilter').value = 'ranking-desc';
    document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('active'));
    
    hideClearButton();
    currentPage = 1;
    updateURLAndReload();
}

/**
 * Update URL and reload restaurants
 */
function updateURLAndReload() {
    const params = {};
    
    if (filters.search) params.search = filters.search;
    // category se maneja arriba con categoriaId
    if (filters.rating) params.minRating = filters.rating;
    // Backend usa ordenarPor y orden en lugar de sort
    if (filters.ordenarPor) params.ordenarPor = filters.ordenarPor;
    if (filters.orden) params.orden = filters.orden;
    if (currentPage > 1) params.pagina = currentPage; // Usar 'pagina' o 'saltar' según el backend
    
    updateQueryParams(params);
    loadRestaurants();
    updateActiveFilters();
    updateFilterCount();
}

/**
 * Update active filters display
 */
function updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    const chipsContainer = document.getElementById('filterChips');
    
    const activeFilters = [];
    
    if (filters.search) {
        activeFilters.push({
            type: 'search',
            label: `Búsqueda: "${filters.search}"`,
            value: filters.search
        });
    }
    
    if (filters.category) {
        activeFilters.push({
            type: 'category',
            label: `Categoría: ${filters.category}`,
            value: filters.category
        });
    }
    
    if (filters.rating) {
        activeFilters.push({
            type: 'rating',
            label: `Mínimo ${filters.rating} estrellas`,
            value: filters.rating
        });
    }
    
    if (activeFilters.length > 0) {
        container.style.display = 'block';
        chipsContainer.innerHTML = activeFilters.map(filter => `
            <div class="filter-chip">
                <span>${filter.label}</span>
                <button onclick="removeFilter('${filter.type}')">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `).join('');
    } else {
        container.style.display = 'none';
    }
}

/**
 * Remove filter
 * @param {string} type - Filter type
 */
function removeFilter(type) {
    switch (type) {
        case 'search':
            filters.search = '';
            document.getElementById('searchInput').value = '';
            hideClearButton();
            break;
        case 'category':
            filters.category = '';
            document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(cb => cb.checked = false);
            break;
        case 'rating':
            filters.rating = 0;
            document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('active'));
            break;
    }
    
    currentPage = 1;
    updateURLAndReload();
}

/**
 * Update filter count badge
 */
function updateFilterCount() {
    const badge = document.getElementById('filterCount');
    let count = 0;
    
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.rating) count++;
    
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

/**
 * Load restaurants
 */
async function loadRestaurants() {
    const grid = document.getElementById('restaurantsGrid');
    grid.innerHTML = '<div class="loading-state"><div class="loader"></div><p>Cargando restaurantes...</p></div>';
    
    try {
        const params = {
            saltar: (currentPage - 1) * CONFIG.PAGINATION.DEFAULT_LIMIT,  // Backend usa 'saltar' para paginación
            limite: CONFIG.PAGINATION.DEFAULT_LIMIT,  // Backend usa 'limite' no 'limit'
            ordenarPor: filters.ordenarPor || 'ranking',
            orden: filters.orden || 'desc'
        };
        
        if (filters.search) params.search = filters.search;
        // El backend filtra por categoriaId, pero podemos filtrar por nombre si el backend lo soporta
        // Por ahora enviar categoriaId si tenemos la categoría seleccionada
        if (filters.category) {
            // Buscar el ID de la categoría
            const category = categories.find(c => c.nombre === filters.category);
            if (category && category._id) {
                params.categoriaId = category._id;
            } else {
                // Fallback: usar el nombre si no tenemos el ID
                params.categoria = filters.category;
            }
        }
        if (filters.rating) params.minRating = filters.rating;
        
        const response = await api.getRestaurants(params);
        
        if (response.success && response.data) {
            restaurants = response.data;
            totalPages = response.pagination?.totalPages || 1;
            
            displayRestaurants(restaurants);
            updateResultsInfo(response.pagination?.total || restaurants.length);
            updatePagination();
        } else {
            throw new Error('Error al cargar restaurantes');
        }
    } catch (error) {
        console.error('Error loading restaurants:', error);
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">😞</div>
                <h3>Error al cargar restaurantes</h3>
                <p>Por favor intenta nuevamente</p>
                <button class="btn-primary" onclick="loadRestaurants()">Reintentar</button>
            </div>
        `;
    }
}

/**
 * Display restaurants
 * @param {array} restaurantsToDisplay - Restaurants to display
 */
function displayRestaurants(restaurantsToDisplay) {
    const grid = document.getElementById('restaurantsGrid');
    
    if (!restaurantsToDisplay || restaurantsToDisplay.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No se encontraron restaurantes</h3>
                <p>Intenta ajustar tus filtros de búsqueda</p>
                <button class="btn-primary" onclick="resetFilters()">Limpiar Filtros</button>
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
 * Create restaurant card
 * @param {object} restaurant - Restaurant data
 * @returns {HTMLElement} Restaurant card
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
    
    // Determinar si hay imagen (Base64 o URL)
    const hasImage = restaurant.imagen && (restaurant.imagen.startsWith('data:image') || restaurant.imagen.startsWith('http'));
    const imageSrc = hasImage ? restaurant.imagen : '';
    
    card.innerHTML = `
        <div class="restaurant-image" ${imageSrc ? `style="background-image: url('${imageSrc}'); background-size: cover; background-position: center;"` : ''}>
            ${!imageSrc ? '' : ''}
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
 * Navigate to restaurant detail
 * @param {string} restaurantId - Restaurant ID
 */
function navigateToRestaurant(restaurantId) {
    window.location.href = `restaurant-detail.html?id=${restaurantId}`;
}

/**
 * Update results info
 * @param {number} total - Total results
 */
function updateResultsInfo(total) {
    const title = document.getElementById('resultsTitle');
    const count = document.getElementById('resultsCount');
    
    if (filters.search) {
        title.textContent = `Resultados para "${filters.search}"`;
    } else if (filters.category) {
        title.textContent = `Categoría: ${filters.category}`;
    } else {
        title.textContent = 'Todos los Restaurantes';
    }
    
    count.textContent = `${formatNumber(total)} restaurante${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
}

/**
 * Set view mode
 * @param {string} view - View mode ('grid' or 'list')
 */
function setView(view) {
    currentView = view;
    
    const grid = document.getElementById('restaurantsGrid');
    const gridBtn = document.getElementById('gridView');
    const listBtn = document.getElementById('listView');
    
    if (view === 'grid') {
        grid.classList.remove('list-view');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    } else {
        grid.classList.add('list-view');
        gridBtn.classList.remove('active');
        listBtn.classList.add('active');
    }
}

/**
 * Update pagination
 */
function updatePagination() {
    const pagination = document.getElementById('pagination');
    const pagesContainer = document.getElementById('paginationPages');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // Update prev/next buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Generate page buttons
    pagesContainer.innerHTML = '';
    
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage < maxPages - 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-btn';
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.onclick = () => changePage(i);
        pagesContainer.appendChild(btn);
    }
}

/**
 * Change page
 * @param {number} page - Page number
 */
function changePage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    currentPage = page;
    updateURLAndReload();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initPage();
        setupRatingFilter();
    });
} else {
    initPage();
    setupRatingFilter();
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

// Export functions for global use
window.handleCategoryChange = handleCategoryChange;
window.removeFilter = removeFilter;
window.resetFilters = resetFilters;
window.loadRestaurants = loadRestaurants;