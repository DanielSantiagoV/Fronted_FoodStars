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
        case 'dishes':
            await loadDishesData();
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
    
    // Dish form
    const dishForm = document.getElementById('dishForm');
    if (dishForm) {
        dishForm.addEventListener('submit', handleDishSubmit);
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
        
        // Initialize counter on load
        const counter = document.getElementById('catDescCharCount');
        if (counter && categoryDesc.value) {
            counter.textContent = categoryDesc.value.length;
        }
    }
    
    // Character counter for dish description
    const dishDesc = document.getElementById('dishDescription');
    if (dishDesc) {
        dishDesc.addEventListener('input', (e) => {
            const count = e.target.value.length;
            const counter = document.getElementById('dishDescCharCount');
            if (counter) {
                counter.textContent = count;
                
                // Change color if approaching limit
                if (count > 270) {
                    counter.style.color = 'var(--danger)';
                } else if (count > 240) {
                    counter.style.color = 'var(--warning)';
                } else {
                    counter.style.color = 'var(--gray-700)';
                }
            }
        });
        
        // Initialize counter on load
        const counter = document.getElementById('dishDescCharCount');
        if (counter && dishDesc.value) {
            counter.textContent = dishDesc.value.length;
        }
    }
}

/**
 * Load dashboard data
 */
async function loadDashboardData() {
    try {
        // Cargar datos para el dashboard
        // Nota: El backend limita 'limite' a máximo 100
        const [restaurantsRes, reviewsRes, categoriesRes] = await Promise.all([
            api.getRestaurants({ limite: 100, soloAprobados: 'false' }).catch(err => {
                console.error('Error loading restaurants:', err);
                return { success: false, data: [] };
            }),
            api.getReviews({ limite: 100 }).catch(err => {
                console.error('Error loading reviews:', err);
                return { success: false, data: [] };
            }),
            api.getCategories().catch(err => {
                console.error('Error loading categories:', err);
                return { success: false, data: [] };
            })
        ]);
        
        // Update stats - ajustar para formato del backend
        const restaurants = (restaurantsRes.success && Array.isArray(restaurantsRes.data)) 
            ? restaurantsRes.data 
            : [];
        const reviews = (reviewsRes.success && Array.isArray(reviewsRes.data))
            ? reviewsRes.data
            : [];
        const categories = (categoriesRes.success && Array.isArray(categoriesRes.data))
            ? categoriesRes.data
            : [];
        
        document.getElementById('statRestaurants').textContent = restaurants.length;
        document.getElementById('statReviews').textContent = reviews.length;
        document.getElementById('statCategories').textContent = categories.length;
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
    tbody.innerHTML = '<tr><td colspan="7"><div class="loading-state"><div class="loader"></div></div></td></tr>';
    
    try {
        // El backend limita 'limite' a máximo 100
        const response = await api.getRestaurants({ limite: 100, soloAprobados: 'false' });
        
        if (response.success && response.data) {
            restaurants = Array.isArray(response.data) ? response.data : [];
            displayRestaurantsTable(restaurants);
        } else {
            throw new Error(response.message || 'Error al cargar restaurantes');
        }
    } catch (error) {
        console.error('Error loading restaurants:', error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger);">${error.message || 'Error al cargar restaurantes'}</td></tr>`;
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
        // Backend retorna calificacionPromedio, no promedioCalificacion
        const rating = restaurant.calificacionPromedio || restaurant.promedioCalificacion || 0;
        const stars = generateStars(rating);
        
        // Obtener nombre de categoría si tenemos categoriaId
        let categoryName = restaurant.categoria || 'N/A';
        if (restaurant.categoriaId && categories.length > 0) {
            const category = categories.find(c => c._id === restaurant.categoriaId || c._id.toString() === restaurant.categoriaId.toString());
            if (category) {
                categoryName = category.nombre;
            }
        }
        
        // Estado de aprobación
        const aprobado = restaurant.aprobado !== undefined ? restaurant.aprobado : true;
        const estadoText = aprobado ? 'Aprobado' : 'Pendiente';
        const estadoClass = aprobado ? 'badge-success' : 'badge-warning';
        
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
                <td>${categoryName}</td>
                <td>${truncateText(restaurant.ubicacion || 'N/A', 30)}</td>
                <td>
                    <div class="table-rating">
                        <span class="stars">${stars}</span>
                        <span>${rating.toFixed(1)}</span>
                    </div>
                </td>
                <td>${restaurant.totalReseñas || 0}</td>
                <td>
                    <span class="table-badge ${estadoClass}">${estadoText}</span>
                </td>
                <td>
                    <div class="table-actions">
                        ${!aprobado ? `
                        <button class="action-icon-btn approve" onclick="approveRestaurant('${restaurant._id}')" title="Aprobar">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                        </button>
                        ` : ''}
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
        const response = await api.getReviews({ limite: 50 });
        
        if (response.success && response.data) {
            reviews = Array.isArray(response.data) ? response.data : [];
            displayReviewsList(reviews);
        } else {
            throw new Error(response.message || 'Error al cargar reseñas');
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        list.innerHTML = `<p style="text-align: center; color: var(--danger);">${error.message || 'Error al cargar reseñas'}</p>`;
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
        // El backend limita 'limite' a máximo 100
        const response = await api.getUsers({ limite: 100 });
        
        if (response.success && response.data) {
            users = Array.isArray(response.data) ? response.data : [];
            displayUsersTable(users);
        } else {
            throw new Error(response.message || 'Error al cargar usuarios');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger); padding: 2rem;">
            <div class="empty-admin-state">
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3>Error al cargar usuarios</h3>
                <p>${error.message || 'Error desconocido'}</p>
            </div>
        </td></tr>`;
        showToast(error.message || 'Error al cargar usuarios', 'error');
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
        const isAdmin = (user.role === CONFIG.ROLES.ADMIN || user.rol === CONFIG.ROLES.ADMIN);
        
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
                <td>${formatDate(user.fechaRegistro || user.fechaCreacion)}</td>
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
    
    // Initialize character counter
    const descCounter = document.getElementById('descCharCount');
    if (descCounter) {
        descCounter.textContent = '0';
    }
    
    // Load categories for select
    await loadCategoryOptions();
    
    document.getElementById('restaurantModal').classList.add('active');
    document.body.classList.add('modal-open');
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
    const descValue = restaurant.descripcion || '';
    document.getElementById('restaurantDescription').value = descValue;
    document.getElementById('restaurantLocation').value = restaurant.ubicacion || '';
    
    // Initialize character counter
    const descCounter = document.getElementById('descCharCount');
    if (descCounter) {
        descCounter.textContent = descValue.length;
    }
    
    // Cargar imagen existente si hay una
    const previewElement = document.getElementById('restaurantImagePreview');
    const removeBtn = document.getElementById('restaurantImageRemove');
    const base64Input = document.getElementById('restaurantImageBase64');
    
    if (restaurant.imagen) {
        // Si la imagen es Base64 (empieza con data:image) o URL
        if (restaurant.imagen.startsWith('data:image')) {
            // Es Base64, mostrar directamente
            previewElement.innerHTML = `<img src="${restaurant.imagen}" alt="Preview">`;
            previewElement.style.padding = '0';
            if (base64Input) base64Input.value = restaurant.imagen;
            if (removeBtn) removeBtn.style.display = 'flex';
        } else if (restaurant.imagen.startsWith('http')) {
            // Es URL, convertir a Base64 (opcional) o mostrar URL
            previewElement.innerHTML = `<img src="${restaurant.imagen}" alt="Preview">`;
            previewElement.style.padding = '0';
            if (removeBtn) removeBtn.style.display = 'flex';
        }
    } else {
        // No hay imagen, mostrar placeholder
        removeImage('restaurantImage', 'restaurantImagePreview');
    }
    
    // Load categories and set selected
    await loadCategoryOptions();
    // Buscar la categoría por ID o nombre
    if (restaurant.categoriaId) {
        const category = categories.find(c => c._id === restaurant.categoriaId);
        if (category) {
            document.getElementById('restaurantCategory').value = category.nombre;
        }
    } else if (restaurant.categoria) {
        document.getElementById('restaurantCategory').value = restaurant.categoria;
    }
    
    document.getElementById('restaurantModal').classList.add('active');
    document.body.classList.add('modal-open');
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
    document.getElementById('restaurantForm').reset();
    document.body.classList.remove('modal-open');
    
    // Limpiar imagen
    if (typeof removeImage === 'function') {
        removeImage('restaurantImage', 'restaurantImagePreview');
    }
    
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
        // Manejar imagen Base64
        const imagenBase64 = document.getElementById('restaurantImageBase64')?.value;
        if (imagenBase64) {
            data.imagen = imagenBase64; // El backend espera 'imagen' con Base64
        } else if (!currentEditId) {
            // Si es creación nueva y no hay imagen, dejar null
            data.imagen = null;
        }
        // Si es edición y no hay nueva imagen, no incluir el campo (mantener la existente)
        
        // Convertir nombre de categoría a categoriaId si se proporciona
        if (data.categoria || data.restaurantCategory) {
            const categoryName = data.categoria || data.restaurantCategory;
            if (categoryName) {
                // Cargar categorías si no están cargadas
                if (categories.length === 0) {
                    const categoriesRes = await api.getCategories();
                    if (categoriesRes.success && categoriesRes.data) {
                        categories = categoriesRes.data;
                    }
                }
                
                // Buscar la categoría por nombre para obtener su ID
                const category = categories.find(c => c.nombre === categoryName);
                if (category) {
                    data.categoriaId = category._id || category._id.toString();
                } else {
                    throw new Error('La categoría seleccionada no es válida');
                }
            }
            // Remover campos de categoría que no se usan
            delete data.categoria;
            delete data.restaurantCategory;
        }
        
        // Asegurar que aprobado sea false por defecto para nuevos restaurantes
        if (!currentEditId) {
            data.aprobado = false;
        }
        
        // Limpiar campos no necesarios
        delete data.imagenBase64;
        
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
    
    // Initialize character counter
    const descCounter = document.getElementById('catDescCharCount');
    if (descCounter) {
        descCounter.textContent = '0';
    }
    
    document.getElementById('categoryModal').classList.add('active');
    document.body.classList.add('modal-open');
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
    const descValue = category.descripcion || '';
    document.getElementById('categoryDescription').value = descValue;
    
    // Initialize character counter
    const descCounter = document.getElementById('catDescCharCount');
    if (descCounter) {
        descCounter.textContent = descValue.length;
    }
    
    document.getElementById('categoryModal').classList.add('active');
    document.body.classList.add('modal-open');
}

/**
 * Close category modal
 */
function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
    document.body.classList.remove('modal-open');
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
        dish: `¿Eliminar el plato "${name}"?`,
        review: `¿Eliminar ${name}?`,
        user: `¿Eliminar el usuario "${name}"?`
    };
    
    document.getElementById('deleteMessage').textContent = messages[type] || '¿Confirmar eliminación?';
    document.getElementById('deleteConfirmModal').classList.add('active');
    document.body.classList.add('modal-open');
    
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.onclick = () => executeDelete();
}

/**
 * Close delete modal
 */
function closeDeleteModal() {
    document.getElementById('deleteConfirmModal').classList.remove('active');
    document.body.classList.remove('modal-open');
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
            case 'dish':
                response = await api.deleteDish(currentDeleteId);
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
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize auth UI first (before checking permissions)
        if (typeof initAuthUI === 'function') {
            initAuthUI();
        }
        initAdminPanel();
    });
} else {
    // Initialize auth UI first (before checking permissions)
    if (typeof initAuthUI === 'function') {
        initAuthUI();
    }
    initAdminPanel();
}

// Export functions for global use
/**
 * Approve restaurant
 */
async function approveRestaurant(id) {
    try {
        const response = await api.approveRestaurant(id);
        
        if (response.success) {
            showToast('Restaurante aprobado exitosamente', 'success');
            await loadRestaurantsData();
        } else {
            throw new Error(response.message || 'Error al aprobar restaurante');
        }
    } catch (error) {
        console.error('Error approving restaurant:', error);
        showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
    }
}

// ==================== DISHES MANAGEMENT ====================
let dishes = [];

/**
 * Load dishes data
 */
async function loadDishesData() {
    const grid = document.getElementById('dishesAdminGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading-state"><div class="loader"></div></div>';
    
    // Clear any error messages
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
        const errorMsg = filterBar.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }
    
    try {
        // Load all restaurants first to get their dishes
        // Nota: El backend limita 'limite' a máximo 100, así que cargamos en lotes si es necesario
        const restaurantsRes = await api.getRestaurants({ limite: 100, soloAprobados: 'false' });
        
        if (restaurantsRes.success && Array.isArray(restaurantsRes.data)) {
            restaurants = restaurantsRes.data;
            
            // Load dishes for all restaurants
            const dishesPromises = restaurants.map(async (restaurant) => {
                try {
                    const dishesRes = await api.getRestaurantDishes(restaurant._id);
                    if (dishesRes.success && Array.isArray(dishesRes.data)) {
                        return dishesRes.data.map(dish => ({
                            ...dish,
                            restauranteNombre: restaurant.nombre,
                            restauranteId: restaurant._id
                        }));
                    }
                    return [];
                } catch (error) {
                    console.error(`Error loading dishes for restaurant ${restaurant._id}:`, error);
                    return [];
                }
            });
            
            const dishesArrays = await Promise.all(dishesPromises);
            dishes = dishesArrays.flat();
            
            displayDishesGrid(dishes);
            
            // Populate restaurant filter
            populateDishRestaurantFilter();
        } else {
            throw new Error(restaurantsRes.message || 'Error al cargar restaurantes');
        }
    } catch (error) {
        console.error('Error loading dishes:', error);
        const errorMessage = error.message || 'Error al cargar platos';
        
        // Show error in grid
        grid.innerHTML = `<div class="empty-admin-state">
            <svg width="100" height="100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3>Error al cargar platos</h3>
            <p>${errorMessage}</p>
        </div>`;
        
        // Show toast notification
        showToast(errorMessage, 'error');
    }
}

/**
 * Populate restaurant filter for dishes
 */
function populateDishRestaurantFilter() {
    const filter = document.getElementById('dishRestaurantFilter');
    if (!filter) return;
    
    try {
        filter.innerHTML = '<option value="">Todos los restaurantes</option>' +
            restaurants.map(r => `<option value="${r._id}">${sanitizeHTML(r.nombre)}</option>`).join('');
    } catch (error) {
        console.error('Error populating restaurant filter:', error);
        filter.innerHTML = '<option value="">Todos los restaurantes</option>';
    }
}

/**
 * Filter dishes by restaurant
 */
function filterDishesByRestaurant() {
    const filter = document.getElementById('dishRestaurantFilter');
    if (!filter) return;
    
    // Clear any error messages
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
        const errorMsg = filterBar.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }
    
    try {
        const restaurantId = filter.value;
        
        if (!restaurantId) {
            displayDishesGrid(dishes);
            return;
        }
        
        const filteredDishes = dishes.filter(d => {
            if (!d.restauranteId) return false;
            return d.restauranteId === restaurantId || d.restauranteId.toString() === restaurantId.toString();
        });
        
        displayDishesGrid(filteredDishes);
    } catch (error) {
        console.error('Error filtering dishes:', error);
        showToast('Error al filtrar platos', 'error');
        displayDishesGrid(dishes); // Show all dishes on error
    }
}

/**
 * Display dishes grid
 */
function displayDishesGrid(data) {
    const grid = document.getElementById('dishesAdminGrid');
    if (!grid) return;
    
    if (!data || data.length === 0) {
        grid.innerHTML = `<div class="empty-admin-state">
            <svg width="100" height="100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <h3>No hay platos disponibles</h3>
            <p>Agrega tu primer plato haciendo clic en el botón "Nuevo Plato"</p>
        </div>`;
        return;
    }
    
    try {
        grid.innerHTML = data.map(dish => `
            <div class="dish-admin-card">
                <div class="dish-image">
                    ${dish.imagen ? `<img src="${dish.imagen}" alt="${sanitizeHTML(dish.nombre)}">` : '<div class="no-image">🍽️</div>'}
                </div>
                <div class="dish-info">
                    <h3>${sanitizeHTML(dish.nombre)}</h3>
                    <p class="dish-restaurant">${sanitizeHTML(dish.restauranteNombre || 'Restaurante')}</p>
                    <p class="dish-description">${sanitizeHTML(dish.descripcion || 'Sin descripción')}</p>
                    ${dish.precio ? `<p class="dish-price">$${formatNumber(dish.precio)}</p>` : ''}
                </div>
                <div class="dish-actions">
                    <button class="btn-outline btn-small" onclick="editDish('${dish._id}')">
                        Editar
                    </button>
                    <button class="btn-danger btn-small" onclick="confirmDelete('dish', '${dish._id}', '${sanitizeHTML(dish.nombre)}')">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error displaying dishes:', error);
        grid.innerHTML = `<div class="empty-admin-state">
            <h3>Error al mostrar platos</h3>
            <p>${error.message || 'Error desconocido'}</p>
        </div>`;
    }
}

/**
 * Show create dish modal
 */
async function showCreateDishModal() {
    currentEditId = null;
    document.getElementById('dishModalTitle').textContent = 'Nuevo Plato';
    document.getElementById('dishForm').reset();
    
    // Initialize character counter
    const descCounter = document.getElementById('dishDescCharCount');
    if (descCounter) {
        descCounter.textContent = '0';
    }
    
    // Load restaurants for select
    await loadRestaurantOptions();
    
    document.getElementById('dishModal').classList.add('active');
    document.body.classList.add('modal-open');
}

/**
 * Edit dish
 */
async function editDish(id) {
    const dish = dishes.find(d => d._id === id);
    if (!dish) return;
    
    currentEditId = id;
    document.getElementById('dishModalTitle').textContent = 'Editar Plato';
    
    // Fill form
    document.getElementById('dishName').value = dish.nombre;
    const descValue = dish.descripcion || '';
    document.getElementById('dishDescription').value = descValue;
    document.getElementById('dishPrice').value = dish.precio || '';
    
    // Initialize character counter
    const descCounter = document.getElementById('dishDescCharCount');
    if (descCounter) {
        descCounter.textContent = descValue.length;
    }
    
    // Load restaurants and set selected
    await loadRestaurantOptions();
    if (dish.restauranteId) {
        document.getElementById('dishRestaurant').value = dish.restauranteId;
    }
    
    // Handle image
    const previewElement = document.getElementById('dishImagePreview');
    const removeBtn = document.getElementById('dishImageRemove');
    const base64Input = document.getElementById('dishImageBase64');
    
    if (dish.imagen) {
        if (dish.imagen.startsWith('data:image')) {
            previewElement.innerHTML = `<img src="${dish.imagen}" alt="Preview">`;
            previewElement.style.padding = '0';
            if (base64Input) base64Input.value = dish.imagen;
            if (removeBtn) removeBtn.style.display = 'flex';
        } else if (dish.imagen.startsWith('http')) {
            previewElement.innerHTML = `<img src="${dish.imagen}" alt="Preview">`;
            previewElement.style.padding = '0';
            if (removeBtn) removeBtn.style.display = 'flex';
        }
    } else {
        if (typeof removeImage === 'function') {
            removeImage('dishImage', 'dishImagePreview');
        }
    }
    
    document.getElementById('dishModal').classList.add('active');
    document.body.classList.add('modal-open');
}

/**
 * Load restaurant options
 */
async function loadRestaurantOptions() {
    const select = document.getElementById('dishRestaurant');
    if (!select) return;
    
    try {
        if (restaurants.length === 0) {
            // El backend limita 'limite' a máximo 100
            const response = await api.getRestaurants({ limite: 100, soloAprobados: 'false' });
            if (response.success) {
                restaurants = response.data;
            }
        }
        
        select.innerHTML = '<option value="">Seleccionar...</option>' + 
            restaurants.map(r => `<option value="${r._id}">${sanitizeHTML(r.nombre)}</option>`).join('');
            
    } catch (error) {
        console.error('Error loading restaurants:', error);
    }
}

/**
 * Close dish modal
 */
function closeDishModal() {
    document.getElementById('dishModal').classList.remove('active');
    document.getElementById('dishForm').reset();
    document.body.classList.remove('modal-open');
    
    // Limpiar imagen
    if (typeof removeImage === 'function') {
        removeImage('dishImage', 'dishImagePreview');
    }
    
    currentEditId = null;
}

/**
 * Handle dish submit
 */
async function handleDishSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Guardando...';
    
    try {
        // Handle image Base64
        const imagenBase64 = document.getElementById('dishImageBase64')?.value;
        if (imagenBase64) {
            data.imagen = imagenBase64;
        } else if (!currentEditId) {
            data.imagen = null;
        }
        
        // Convert price to number
        if (data.precio) {
            data.precio = parseFloat(data.precio);
        }
        
        // Ensure restauranteId is set
        if (!data.restaurante && !data.restauranteId) {
            throw new Error('Debe seleccionar un restaurante');
        }
        
        if (data.restaurante) {
            data.restauranteId = data.restaurante;
            delete data.restaurante;
        }
        
        // Clean up
        delete data.imagenBase64;
        
        let response;
        if (currentEditId) {
            response = await api.updateDish(currentEditId, data);
        } else {
            response = await api.createDish(data);
        }
        
        if (response.success) {
            showToast(currentEditId ? 'Plato actualizado exitosamente' : 'Plato creado exitosamente', 'success');
            closeDishModal();
            await loadDishesData();
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        console.error('Error saving dish:', error);
        showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Export functions to window for onclick handlers
window.showCreateRestaurantModal = showCreateRestaurantModal;
window.editRestaurant = editRestaurant;
window.closeRestaurantModal = closeRestaurantModal;
window.showCreateCategoryModal = showCreateCategoryModal;
window.editCategory = editCategory;
window.closeCategoryModal = closeCategoryModal;
window.showCreateDishModal = showCreateDishModal;
window.editDish = editDish;
window.closeDishModal = closeDishModal;
window.filterDishesByRestaurant = filterDishesByRestaurant;
window.confirmDelete = confirmDelete;
window.closeDeleteModal = closeDeleteModal;
window.approveRestaurant = approveRestaurant;