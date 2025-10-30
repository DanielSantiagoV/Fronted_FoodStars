/**
 * FoodieRank - Admin Panel Logic
 * Handles admin dashboard and CRUD operations
 */

// Page state
let currentSection = 'dashboard';
let currentEditId = null;
let currentDeleteType = null;
let currentDeleteId = null;
let categories = [];
let restaurants = [];
let reviews = [];
let users = [];

/**
 * Initialize admin panel
 */
async function initAdminPanel() {
    // Check admin permissions
    if (!requireAdmin()) return;
    
    // Setup navigation
    setupNavigation();
    
    // Load initial data
    await loadDashboardData();
    
    // Setup event listeners
    setupEventListeners();
}

/**
 * Setup navigation
 */
function setupNavigation() {
    const links = document.querySelectorAll('.sidebar-link');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
        });
    });
}

/**
 * Switch section
 */
function switchSection(section) {
    // Update nav
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Update sections
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');
    
    currentSection = section;
    
    // Load section data
    loadSectionData(section);
}

/**
 * Load section data
 */
async function loadSectionData(section) {
    switch (section) {
        case 'dashboard':
            await loadDashboardData();
            break;
        case 'restaurants':
            await loadRestaurantsData();
            break;
        case 'categories':
            await loadCategoriesData();
            break;
        case 'reviews':
            await loadReviewsData();
            break;
        case 'users':
            await loadUsersData();
            break;
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Restaurant form
    const restaurantForm = document.getElementById('restaurantForm');
    if (restaurantForm) {
        restaurantForm.addEventListener('submit', handleRestaurantSubmit);
    }
    
    // Category form
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', handleCategorySubmit);
    }
    
    // Character counter for restaurant description
    const restaurantDesc = document.getElementById('restaurantDescription');
    if (restaurantDesc) {
        restaurantDesc.addEventListener('input', (e) => {
            const count = e.target.value.length;
            const counter = document.getElementById('descCharCount');
            if (counter) {
                counter.textContent = count;
                
                // Change color if approaching limit
                if (count > 450) {
                    counter.style.color = 'var(--danger)';
                } else if (count > 400) {
                    counter.style.color = 'var(--warning)';
                } else {
                    counter.style.color = 'var(--gray-700)';
                }
            }
        });
        
        // Limit to 500 characters
        restaurantDesc.setAttribute('maxlength', '500');
    }
    
    // Character counter for category description
    const categoryDesc = document.getElementById('categoryDescription');
    if (categoryDesc) {
        categoryDesc.addEventListener('input', (e) => {
            const count = e.target.value.length;
            const counter = document.getElementById('catDescCharCount');
            if (counter) {
                counter.textContent = count;
                
                // Change color if approaching limit
                if (count > 180) {
                    counter.style.color = 'var(--danger)';
                } else if (count > 160) {
                    counter.style.color = 'var(--warning)';
                } else {
                    counter.style.color = 'var(--gray-700)';
                }
            }
        });
    }
}

/**
 * Load dashboard data
 */
async function loadDashboardData() {
    try {
        // Load stats (this depends on your API having a stats endpoint)
        // For now, we'll load individual resources and count them
        const [restaurantsRes, reviewsRes, categoriesRes] = await Promise.all([
            api.getRestaurants({ limit: 1000 }),
            api.getReviews({ limit: 1000 }),
            api.getCategories()
        ]);
        
        // Update stats
        document.getElementById('statRestaurants').textContent = restaurantsRes.data?.length || 0;
        document.getElementById('statReviews').textContent = reviewsRes.data?.length || 0;
        document.getElementById('statCategories').textContent = categoriesRes.data?.length || 0;
        document.getElementById('statUsers').textContent = '---'; // Requires users endpoint
        
        // Load recent activity
        loadRecentActivity();
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Error al cargar estadísticas', 'error');
    }
}

/**
 * Load recent activity
 */
function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    
    // Mock data - replace with real API data
    const activities = [
        { type: 'restaurant', text: 'Nuevo restaurante agregado', time: 'Hace 2 horas' },
        { type: 'review', text: 'Nueva reseña publicada', time: 'Hace 3 horas' },
        { type: 'user', text: 'Nuevo usuario registrado', time: 'Hace 5 horas' },
        { type: 'category', text: 'Categoría actualizada', time: 'Hace 1 día' }
    ];
    
    const iconMap = {
        restaurant: `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>`,
        review: `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
        </svg>`,
        user: `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>`,
        category: `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>`
    };
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                ${iconMap[activity.type]}
            </div>
            <div class="activity-content">
                <p>${activity.text}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Load restaurants data
 */
async function loadRestaurantsData() {
    const tbody = document.getElementById('restaurantsTableBody');
    tbody.innerHTML = '<tr><td colspan="6"><div class="loading-state"><div class="loader"></div></div></td></tr>';
    
    try {
        const response = await api.getRestaurants({ limit: 100 });
        
        if (response.success && response.data) {
            restaurants = response.data;
            displayRestaurantsTable(restaurants);
        }
    } catch (error) {
        console.error('Error loading restaurants:', error);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--danger);">Error al cargar restaurantes</td></tr>';
    }
}

/**
 * Display restaurants table
 */
function displayRestaurantsTable(data) {
    const tbody = document.getElementById('restaurantsTableBody');
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--gray-600);">No hay restaurantes</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map(restaurant => {
        const rating = restaurant.promedioCalificacion || 0;
        const stars = generateStars(rating);
        
        return `
            <tr>
                <td>
                    <div class="table-user">
                        <div class="table-avatar">🍽️</div>
                        <div class="table-user-info">
                            <h4>${sanitizeHTML(restaurant.nombre)}</h4>
                        </div>
                    </div>
                </td>
                <td>${restaurant.categoria || 'N/A'}</td>
                <td>${truncateText(restaurant.ubicacion || 'N/A', 30)}</td>
                <td>
                    <div class="table-rating">
                        <span class="stars">${stars}</span>
                        <span>${rating.toFixed(1)}</span>
                    </div>
                </td>
                <td>${restaurant.totalReseñas || 0}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-icon-btn edit" onclick="editRestaurant('${restaurant._id}')" title="Editar">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                        </button>
                        <button class="action-icon-btn delete" onclick="confirmDelete('restaurant', '${restaurant._id}', '${sanitizeHTML(restaurant.nombre)}')" title="Eliminar">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Load categories data
 */
async function loadCategoriesData() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = '<div class="loading-state"><div class="loader"></div></div>';
    
    try {
        const response = await api.getCategories();
        
        if (response.success && response.data) {
            categories = response.data;
            displayCategoriesGrid(categories);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--danger);">Error al cargar categorías</p>';
    }
}

/**
 * Display categories grid
 */
function displayCategoriesGrid(data) {
    const grid = document.getElementById('categoriesGrid');
    
    if (!data || data.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--gray-600);">No hay categorías</p>';
        return;
    }
    
    grid.innerHTML = data.map(category => `
        <div class="category-admin-card">
            <h3>${getCategoryIcon(category.nombre)} ${sanitizeHTML(category.nombre)}</h3>
            <p>${sanitizeHTML(category.descripcion || 'Sin descripción')}</p>
            <div class="category-actions">
                <button class="btn-outline btn-small" onclick="editCategory('${category._id}')">
                    Editar
                </button>
                <button class="btn-danger btn-small" onclick="confirmDelete('category', '${category._id}', '${sanitizeHTML(category.nombre)}')">
                    Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Load reviews data
 */
async function loadReviewsData() {
    const list = document.getElementById('adminReviewsList');
    list.innerHTML = '<div class="loading-state"><div class="loader"></div></div>';
    
    try {
        const response = await api.getReviews({ limit: 50 });
        
        if (response.success && response.data) {
            reviews = response.data;
            displayReviewsList(reviews);
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        list.innerHTML = '<p style="text-align: center; color: var(--danger);">Error al cargar reseñas</p>';
    }
}

/**
 * Display reviews list
 */
function displayReviewsList(data) {
    const list = document.getElementById('adminReviewsList');
    
    if (!data || data.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--gray-600); padding: 2rem;">No hay reseñas</p>';
        return;
    }
    
    list.innerHTML = data.map(review => {
        const userName = review.usuario?.nombre || review.usuario?.email || 'Usuario';
        const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const stars = generateStars(review.calificacion);
        const restaurantName = review.restaurante?.nombre || 'Restaurante';
        
        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-user">
                        <div class="review-avatar">${userInitials}</div>
                        <div class="review-user-info">
                            <h4>${sanitizeHTML(userName)}</h4>
                            <div class="review-date">
                                ${sanitizeHTML(restaurantName)} • ${formatRelativeTime(review.fechaCreacion)}
                            </div>
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
                    <span style="color: var(--gray-600); font-size: 0.9rem;">👍 ${review.likes || 0}</span>
                    <span style="color: var(--gray-600); font-size: 0.9rem;">👎 ${review.dislikes || 0}</span>
                    <button class="btn-danger btn-small" onclick="confirmDelete('review', '${review._id}', 'esta reseña')" style="margin-left: auto;">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Load users data
 */
async function loadUsersData() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '<tr><td colspan="6"><div class="loading-state"><div class="loader"></div></div></td></tr>';
    
    try {
        const response = await api.getUsers();
        
        if (response.success && response.data) {
            users = response.data;
            displayUsersTable(users);
        }
    } catch (error) {
        console.error('Error loading users:', error);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--danger);">Error al cargar usuarios</td></tr>';
    }
}

/**
 * Display users table
 */
function displayUsersTable(data) {
    const tbody = document.getElementById('usersTableBody');
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--gray-600);">No hay usuarios</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map(user => {
        const userName = user.nombre || user.email;
        const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const isAdmin = user.role === 'administrador';
        
        return `
            <tr>
                <td>
                    <div class="table-user">
                        <div class="table-avatar">${userInitials}</div>
                        <div class="table-user-info">
                            <h4>${sanitizeHTML(user.nombre || 'Usuario')}</h4>
                        </div>
                    </div>
                </td>
                <td>${sanitizeHTML(user.email)}</td>
                <td>
                    <span class="table-badge ${isAdmin ? 'badge-admin' : 'badge-user'}">
                        ${isAdmin ? 'Administrador' : 'Usuario'}
                    </span>
                </td>
                <td>${user.totalReseñas || 0}</td>
                <td>${formatDate(user.fechaRegistro)}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-icon-btn delete" onclick="confirmDelete('user', '${user._id}', '${sanitizeHTML(userName)}')" title="Eliminar">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Show create restaurant modal
 */
async function showCreateRestaurantModal() {
    currentEditId = null;
    document.getElementById('restaurantModalTitle').textContent = 'Nuevo Restaurante';
    document.getElementById('restaurantForm').reset();
    
    // Load categories for select
    await loadCategoryOptions();
    
    document.getElementById('restaurantModal').classList.add('active');
}

/**
 * Edit restaurant
 */
async function editRestaurant(id) {
    const restaurant = restaurants.find(r => r._id === id);
    if (!restaurant) return;
    
    currentEditId = id;
    document.getElementById('restaurantModalTitle').textContent = 'Editar Restaurante';
    
    // Fill form
    document.getElementById('restaurantName').value = restaurant.nombre;
    document.getElementById('restaurantDescription').value = restaurant.descripcion || '';
    document.getElementById('restaurantLocation').value = restaurant.ubicacion || '';
    
    // Load categories and set selected
    await loadCategoryOptions();
    document.getElementById('restaurantCategory').value = restaurant.categoria;
    
    document.getElementById('restaurantModal').classList.add('active');
}

/**
 * Load category options
 */
async function loadCategoryOptions() {
    const select = document.getElementById('restaurantCategory');
    
    try {
        if (categories.length === 0) {
            const response = await api.getCategories();
            if (response.success) {
                categories = response.data;
            }
        }
        
        select.innerHTML = '<option value="">Seleccionar...</option>' + 
            categories.map(cat => `<option value="${cat.nombre}">${cat.nombre}</option>`).join('');
            
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

/**
 * Close restaurant modal
 */
function closeRestaurantModal() {
    document.getElementById('restaurantModal').classList.remove('active');
    currentEditId = null;
}

/**
 * Handle restaurant submit
 */
async function handleRestaurantSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Guardando...';
    
    try {
        let response;
        if (currentEditId) {
            response = await api.updateRestaurant(currentEditId, data);
        } else {
            response = await api.createRestaurant(data);
        }
        
        if (response.success) {
            showToast(currentEditId ? CONFIG.MESSAGES.SUCCESS.RESTAURANT_UPDATED : CONFIG.MESSAGES.SUCCESS.RESTAURANT_CREATED, 'success');
            closeRestaurantModal();
            await loadRestaurantsData();
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        console.error('Error saving restaurant:', error);
        showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/**
 * Show create category modal
 */
function showCreateCategoryModal() {
    currentEditId = null;
    document.getElementById('categoryModalTitle').textContent = 'Nueva Categoría';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryModal').classList.add('active');
}

/**
 * Edit category
 */
function editCategory(id) {
    const category = categories.find(c => c._id === id);
    if (!category) return;
    
    currentEditId = id;
    document.getElementById('categoryModalTitle').textContent = 'Editar Categoría';
    document.getElementById('categoryName').value = category.nombre;
    document.getElementById('categoryDescription').value = category.descripcion || '';
    document.getElementById('categoryModal').classList.add('active');
}

/**
 * Close category modal
 */
function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
    currentEditId = null;
}

/**
 * Handle category submit
 */
async function handleCategorySubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Guardando...';
    
    try {
        let response;
        if (currentEditId) {
            response = await api.updateCategory(currentEditId, data);
        } else {
            response = await api.createCategory(data);
        }
        
        if (response.success) {
            showToast(currentEditId ? CONFIG.MESSAGES.SUCCESS.CATEGORY_UPDATED : CONFIG.MESSAGES.SUCCESS.CATEGORY_CREATED, 'success');
            closeCategoryModal();
            await loadCategoriesData();
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        console.error('Error saving category:', error);
        showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/**
 * Confirm delete
 */
function confirmDelete(type, id, name) {
    currentDeleteType = type;
    currentDeleteId = id;
    
    const messages = {
        restaurant: `¿Eliminar el restaurante "${name}"?`,
        category: `¿Eliminar la categoría "${name}"?`,
        review: `¿Eliminar ${name}?`,
        user: `¿Eliminar el usuario "${name}"?`
    };
    
    document.getElementById('deleteMessage').textContent = messages[type] || '¿Confirmar eliminación?';
    document.getElementById('deleteConfirmModal').classList.add('active');
    
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.onclick = () => executeDelete();
}

/**
 * Close delete modal
 */
function closeDeleteModal() {
    document.getElementById('deleteConfirmModal').classList.remove('active');
    currentDeleteType = null;
    currentDeleteId = null;
}

/**
 * Execute delete
 */
async function executeDelete() {
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.disabled = true;
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = 'Eliminando...';
    
    try {
        let response;
        
        switch (currentDeleteType) {
            case 'restaurant':
                response = await api.deleteRestaurant(currentDeleteId);
                break;
            case 'category':
                response = await api.deleteCategory(currentDeleteId);
                break;
            case 'review':
                response = await api.deleteReview(currentDeleteId);
                break;
            case 'user':
                response = await api.deleteUser(currentDeleteId);
                break;
        }
        
        if (response.success) {
            showToast('Eliminado correctamente', 'success');
            closeDeleteModal();
            await loadSectionData(currentSection);
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        console.error('Error deleting:', error);
        showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = originalText;
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPanel);
} else {
    initAdminPanel();
}

// Export functions for global use
window.showCreateRestaurantModal = showCreateRestaurantModal;
window.editRestaurant = editRestaurant;
window.closeRestaurantModal = closeRestaurantModal;
window.showCreateCategoryModal = showCreateCategoryModal;
window.editCategory = editCategory;
window.closeCategoryModal = closeCategoryModal;
window.confirmDelete = confirmDelete;
window.closeDeleteModal = closeDeleteModal;