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
    sort: '-promedioCalificacion'
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
    
    if (params.sort) {
        filters.sort = params.sort;
        document.getElementById('sortFilter').value = params.sort;
    }
    
    if (params.page) {
        currentPage = parseInt(params.page);
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
        filters.sort = e.target.value;
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
        sort: '-promedioCalificacion'
    };
    
    document.getElementById('searchInput').value = '';
    document.getElementById('sortFilter').value = '-promedioCalificacion';
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
    if (filters.category) params.category = filters.category;
    if (filters.rating) params.rating = filters.rating;
    if (filters.sort !== '-promedioCalificacion') params.sort = filters.sort;
    if (currentPage > 1) params.page = currentPage;
    
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
            page: currentPage,
            limit: CONFIG.PAGINATION.DEFAULT_LIMIT,
            sort: filters.sort
        };
        
        if (filters.search) params.search = filters.search;
        if (filters.category) params.categoria = filters.category;
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
