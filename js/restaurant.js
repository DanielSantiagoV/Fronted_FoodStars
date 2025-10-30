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

