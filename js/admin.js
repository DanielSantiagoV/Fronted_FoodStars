/**
 * FoodieRank - Admin Panel Logic
 * Handles admin dashboard and CRUD operations
 */

// Estado de la página - Variables globales para almacenar el estado del panel de administración
// Page state
// Sección actual del panel de administración (dashboard, restaurants, etc.)
let currentSection = 'dashboard';
// ID del elemento que se está editando actualmente (null si no hay edición)
let currentEditId = null;
// Tipo de elemento que se va a eliminar (restaurant, category, dish, etc.)
let currentDeleteType = null;
// ID del elemento que se va a eliminar
let currentDeleteId = null;
// Array que almacena todas las categorías
let categories = [];
// Array que almacena todos los restaurantes
let restaurants = [];
// Array que almacena todas las reseñas
let reviews = [];
// Array que almacena todos los usuarios
let users = [];

/**
 * Inicializa el panel de administración
 * Verifica permisos de administrador y configura el panel
 */
async function initAdminPanel() {
    // Verifica permisos de administrador
    // Si el usuario no es administrador, termina la ejecución (requireAdmin redirige)
    if (!requireAdmin()) return;
    
    // Configura la navegación
    // Agrega los listeners para los enlaces del sidebar
    setupNavigation();
    
    // Carga los datos iniciales
    // Carga los datos del dashboard
    await loadDashboardData();
    
    // Configura los event listeners
    // Agrega todos los listeners necesarios para los formularios y eventos
    setupEventListeners();
}

/**
 * Configura la navegación del sidebar
 * Agrega listeners a los enlaces del menú lateral
 */
function setupNavigation() {
    // Obtiene todos los enlaces del sidebar
    const links = document.querySelectorAll('.sidebar-link');
    
    // Itera sobre cada enlace
    links.forEach(link => {
        // Agrega un listener al evento 'click' de cada enlace
        link.addEventListener('click', (e) => {
            // Previene el comportamiento por defecto del enlace
            e.preventDefault();
            // Obtiene la sección del atributo data-section del enlace
            const section = link.dataset.section;
            // Cambia a la sección seleccionada
            switchSection(section);
        });
    });
}

/**
 * Cambia a una sección del panel
 * Actualiza la navegación y muestra la sección seleccionada
 * @param {string} section - Nombre de la sección a mostrar
 */
function switchSection(section) {
    // Actualiza la navegación
    // Remueve la clase 'active' de todos los enlaces del sidebar
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    // Agrega la clase 'active' al enlace de la sección seleccionada
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Actualiza las secciones
    // Oculta todas las secciones removiendo la clase 'active'
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    // Muestra la sección seleccionada agregando la clase 'active'
    document.getElementById(section).classList.add('active');
    
    // Actualiza la sección actual en la variable global
    currentSection = section;
    
    // Carga los datos de la sección
    // Carga los datos específicos de la sección seleccionada
    loadSectionData(section);
}

/**
 * Carga los datos de una sección específica
 * Ejecuta la función de carga correspondiente según la sección
 * @param {string} section - Nombre de la sección
 */
async function loadSectionData(section) {
    // Switch para determinar qué función de carga ejecutar según la sección
    switch (section) {
        // Si la sección es 'dashboard'
        case 'dashboard':
            // Carga los datos del dashboard
            await loadDashboardData();
            // Sale del switch
            break;
        // Si la sección es 'restaurants'
        case 'restaurants':
            // Carga los datos de restaurantes
            await loadRestaurantsData();
            // Sale del switch
            break;
        // Si la sección es 'dishes'
        case 'dishes':
            // Carga los datos de platos
            await loadDishesData();
            // Sale del switch
            break;
        // Si la sección es 'categories'
        case 'categories':
            // Carga los datos de categorías
            await loadCategoriesData();
            // Sale del switch
            break;
        // Si la sección es 'reviews'
        case 'reviews':
            // Carga los datos de reseñas
            await loadReviewsData();
            // Sale del switch
            break;
        // Si la sección es 'users'
        case 'users':
            // Carga los datos de usuarios
            await loadUsersData();
            // Sale del switch
            break;
    }
}

/**
 * Configura los event listeners
 * Agrega todos los listeners necesarios para formularios y contadores de caracteres
 */
function setupEventListeners() {
    // Formulario de restaurante
    // Obtiene el formulario de restaurante
    const restaurantForm = document.getElementById('restaurantForm');
    // Si el formulario existe
    if (restaurantForm) {
        // Agrega un listener al evento 'submit' que maneja el envío del formulario
        restaurantForm.addEventListener('submit', handleRestaurantSubmit);
    }
    
    // Formulario de categoría
    // Obtiene el formulario de categoría
    const categoryForm = document.getElementById('categoryForm');
    // Si el formulario existe
    if (categoryForm) {
        // Agrega un listener al evento 'submit' que maneja el envío del formulario
        categoryForm.addEventListener('submit', handleCategorySubmit);
    }
    
    // Formulario de plato
    // Obtiene el formulario de plato
    const dishForm = document.getElementById('dishForm');
    // Si el formulario existe
    if (dishForm) {
        // Agrega un listener al evento 'submit' que maneja el envío del formulario
        dishForm.addEventListener('submit', handleDishSubmit);
    }
    
    // Contador de caracteres para la descripción del restaurante
    // Obtiene el textarea de descripción del restaurante
    const restaurantDesc = document.getElementById('restaurantDescription');
    // Si el elemento existe
    if (restaurantDesc) {
        // Agrega un listener al evento 'input' para actualizar el contador
        restaurantDesc.addEventListener('input', (e) => {
            // Obtiene la longitud del texto ingresado
            const count = e.target.value.length;
            // Obtiene el elemento del contador de caracteres
            const counter = document.getElementById('descCharCount');
            // Si el contador existe
            if (counter) {
                // Actualiza el texto del contador con la cantidad de caracteres
                counter.textContent = count;
                
                // Cambia el color si se acerca al límite
                // Si la cantidad excede 450 caracteres, usa color de peligro (rojo)
                if (count > 450) {
                    counter.style.color = 'var(--danger)';
                // Si la cantidad excede 400 caracteres, usa color de advertencia (amarillo)
                } else if (count > 400) {
                    counter.style.color = 'var(--warning)';
                // Si está dentro del rango seguro, usa el color normal (gris)
                } else {
                    counter.style.color = 'var(--gray-700)';
                }
            }
        });
        
        // Limita a 500 caracteres
        // Establece el atributo maxlength para limitar la entrada
        restaurantDesc.setAttribute('maxlength', '500');
    }
    
    // Contador de caracteres para la descripción de la categoría
    // Obtiene el textarea de descripción de la categoría
    const categoryDesc = document.getElementById('categoryDescription');
    // Si el elemento existe
    if (categoryDesc) {
        // Agrega un listener al evento 'input' para actualizar el contador
        categoryDesc.addEventListener('input', (e) => {
            // Obtiene la longitud del texto ingresado
            const count = e.target.value.length;
            // Obtiene el elemento del contador de caracteres
            const counter = document.getElementById('catDescCharCount');
            // Si el contador existe
            if (counter) {
                // Actualiza el texto del contador con la cantidad de caracteres
                counter.textContent = count;
                
                // Cambia el color si se acerca al límite
                // Si la cantidad excede 180 caracteres, usa color de peligro (rojo)
                if (count > 180) {
                    counter.style.color = 'var(--danger)';
                // Si la cantidad excede 160 caracteres, usa color de advertencia (amarillo)
                } else if (count > 160) {
                    counter.style.color = 'var(--warning)';
                // Si está dentro del rango seguro, usa el color normal (gris)
                } else {
                    counter.style.color = 'var(--gray-700)';
                }
            }
        });
        
        // Inicializa el contador al cargar
        // Obtiene el elemento del contador
        const counter = document.getElementById('catDescCharCount');
        // Si el contador existe y hay un valor en el textarea
        if (counter && categoryDesc.value) {
            // Establece el contador con la longitud del valor existente
            counter.textContent = categoryDesc.value.length;
        }
    }
    
    // Contador de caracteres para la descripción del plato
    // Obtiene el textarea de descripción del plato
    const dishDesc = document.getElementById('dishDescription');
    // Si el elemento existe
    if (dishDesc) {
        // Agrega un listener al evento 'input' para actualizar el contador
        dishDesc.addEventListener('input', (e) => {
            // Obtiene la longitud del texto ingresado
            const count = e.target.value.length;
            // Obtiene el elemento del contador de caracteres
            const counter = document.getElementById('dishDescCharCount');
            // Si el contador existe
            if (counter) {
                // Actualiza el texto del contador con la cantidad de caracteres
                counter.textContent = count;
                
                // Cambia el color si se acerca al límite
                // Si la cantidad excede 270 caracteres, usa color de peligro (rojo)
                if (count > 270) {
                    counter.style.color = 'var(--danger)';
                // Si la cantidad excede 240 caracteres, usa color de advertencia (amarillo)
                } else if (count > 240) {
                    counter.style.color = 'var(--warning)';
                // Si está dentro del rango seguro, usa el color normal (gris)
                } else {
                    counter.style.color = 'var(--gray-700)';
                }
            }
        });
        
        // Inicializa el contador al cargar
        // Obtiene el elemento del contador
        const counter = document.getElementById('dishDescCharCount');
        // Si el contador existe y hay un valor en el textarea
        if (counter && dishDesc.value) {
            // Establece el contador con la longitud del valor existente
            counter.textContent = dishDesc.value.length;
        }
    }
}

/**
 * Carga los datos del dashboard
 * Obtiene estadísticas de restaurantes, reseñas, categorías y usuarios
 */
async function loadDashboardData() {
    try {
        // Cargar datos para el dashboard
        // Nota: El backend limita 'limite' a máximo 100
        // Usa Promise.all para cargar todos los datos en paralelo
        const [restaurantsRes, reviewsRes, categoriesRes] = await Promise.all([
            // Carga restaurantes (incluyendo no aprobados)
            api.getRestaurants({ limite: 100, soloAprobados: 'false' }).catch(err => {
                // Si hay error, lo registra y retorna un objeto vacío
                console.error('Error loading restaurants:', err);
                return { success: false, data: [] };
            }),
            // Carga reseñas (máximo 100)
            api.getReviews({ limite: 100 }).catch(err => {
                // Si hay error, lo registra y retorna un objeto vacío
                console.error('Error loading reviews:', err);
                return { success: false, data: [] };
            }),
            // Carga categorías
            api.getCategories().catch(err => {
                // Si hay error, lo registra y retorna un objeto vacío
                console.error('Error loading categories:', err);
                return { success: false, data: [] };
            })
        ]);
        
        // Actualiza las estadísticas - ajustar para formato del backend
        // Verifica si la respuesta de restaurantes fue exitosa y tiene datos
        const restaurants = (restaurantsRes.success && Array.isArray(restaurantsRes.data)) 
            ? restaurantsRes.data 
            : [];
        // Verifica si la respuesta de reseñas fue exitosa y tiene datos
        const reviews = (reviewsRes.success && Array.isArray(reviewsRes.data))
            ? reviewsRes.data
            : [];
        // Verifica si la respuesta de categorías fue exitosa y tiene datos
        const categories = (categoriesRes.success && Array.isArray(categoriesRes.data))
            ? categoriesRes.data
            : [];
        
        // Actualiza el contador de restaurantes en el DOM
        document.getElementById('statRestaurants').textContent = restaurants.length;
        // Actualiza el contador de reseñas en el DOM
        document.getElementById('statReviews').textContent = reviews.length;
        // Actualiza el contador de categorías en el DOM
        document.getElementById('statCategories').textContent = categories.length;
        // Actualiza el contador de usuarios (requiere endpoint de usuarios)
        document.getElementById('statUsers').textContent = '---'; // Requires users endpoint
        
        // Carga la actividad reciente
        // Muestra las actividades más recientes en el dashboard
        loadRecentActivity();
        
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading dashboard:', error);
        // Muestra un mensaje de error al usuario
        showToast('Error al cargar estadísticas', 'error');
    }
}

/**
 * Carga la actividad reciente
 * Muestra las actividades más recientes en el dashboard (datos mock, reemplazar con datos reales del API)
 */
function loadRecentActivity() {
    // Obtiene el elemento de la lista de actividades
    const activityList = document.getElementById('activityList');
    
    // Datos mock - reemplazar con datos reales del API
    // Array con las actividades recientes (simuladas)
    const activities = [
        { type: 'restaurant', text: 'Nuevo restaurante agregado', time: 'Hace 2 horas' },
        { type: 'review', text: 'Nueva reseña publicada', time: 'Hace 3 horas' },
        { type: 'user', text: 'Nuevo usuario registrado', time: 'Hace 5 horas' },
        { type: 'category', text: 'Categoría actualizada', time: 'Hace 1 día' }
    ];
    
    // Mapa de íconos SVG para cada tipo de actividad
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
    
    // Crea el HTML para cada actividad y lo concatena
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
 * Carga los datos de restaurantes
 * Obtiene todos los restaurantes desde el servidor y los muestra en la tabla
 */
async function loadRestaurantsData() {
    // Obtiene el elemento tbody de la tabla de restaurantes
    const tbody = document.getElementById('restaurantsTableBody');
    // Muestra un estado de carga mientras se obtienen los datos
    tbody.innerHTML = '<tr><td colspan="7"><div class="loading-state"><div class="loader"></div></div></td></tr>';
    
    try {
        // El backend limita 'limite' a máximo 100
        // Realiza una petición al API para obtener restaurantes (incluyendo no aprobados)
        const response = await api.getRestaurants({ limite: 100, soloAprobados: 'false' });
        
        // Verifica si la respuesta fue exitosa y tiene datos
        if (response.success && response.data) {
            // Guarda los restaurantes en la variable global, asegurándose de que sea un array
            restaurants = Array.isArray(response.data) ? response.data : [];
            // Muestra los restaurantes en la tabla
            displayRestaurantsTable(restaurants);
        } else {
            // Si la respuesta no fue exitosa, lanza un error
            throw new Error(response.message || 'Error al cargar restaurantes');
        }
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading restaurants:', error);
        // Muestra un mensaje de error en la tabla
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger);">${error.message || 'Error al cargar restaurantes'}</td></tr>`;
    }
}

/**
 * Muestra los restaurantes en la tabla
 * Crea filas de tabla para cada restaurante con su información y acciones
 * @param {array} data - Array de restaurantes a mostrar
 */
function displayRestaurantsTable(data) {
    // Obtiene el elemento tbody de la tabla de restaurantes
    const tbody = document.getElementById('restaurantsTableBody');
    
    // Verifica si hay datos para mostrar
    if (!data || data.length === 0) {
        // Si no hay datos, muestra un mensaje indicando que no hay restaurantes
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--gray-600);">No hay restaurantes</td></tr>';
        // Termina la ejecución
        return;
    }
    
    // Crea HTML para cada restaurante y lo concatena
    tbody.innerHTML = data.map(restaurant => {
        // Backend retorna calificacionPromedio, no promedioCalificacion
        // Obtiene la calificación promedio del restaurante (puede venir como 'calificacionPromedio' o 'promedioCalificacion')
        const rating = restaurant.calificacionPromedio || restaurant.promedioCalificacion || 0;
        // Genera el HTML de las estrellas basándose en la calificación
        const stars = generateStars(rating);
        
        // Obtener nombre de categoría si tenemos categoriaId
        // Inicializa el nombre de categoría con el campo categoria o 'N/A'
        let categoryName = restaurant.categoria || 'N/A';
        // Si el restaurante tiene categoriaId y hay categorías cargadas
        if (restaurant.categoriaId && categories.length > 0) {
            // Busca la categoría que coincida con el ID del restaurante
            const category = categories.find(c => c._id === restaurant.categoriaId || c._id.toString() === restaurant.categoriaId.toString());
            // Si se encuentra la categoría
            if (category) {
                // Usa el nombre de la categoría encontrada
                categoryName = category.nombre;
            }
        }
        
        // Estado de aprobación
        // Verifica si el restaurante tiene el campo aprobado, si no existe asume true (aprobado por defecto)
        const aprobado = restaurant.aprobado !== undefined ? restaurant.aprobado : true;
        // Establece el texto del estado según si está aprobado o no
        const estadoText = aprobado ? 'Aprobado' : 'Pendiente';
        // Establece la clase CSS del badge según el estado
        const estadoClass = aprobado ? 'badge-success' : 'badge-warning';
        
        // Retorna el HTML de la fila de la tabla
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
 * Carga los datos de categorías
 * Obtiene todas las categorías desde el servidor y las muestra en el grid
 */
async function loadCategoriesData() {
    // Obtiene el elemento del grid donde se mostrarán las categorías
    const grid = document.getElementById('categoriesGrid');
    // Muestra un estado de carga mientras se obtienen los datos
    grid.innerHTML = '<div class="loading-state"><div class="loader"></div></div>';
    
    try {
        // Realiza una petición al API para obtener todas las categorías
        const response = await api.getCategories();
        
        // Verifica si la respuesta fue exitosa y tiene datos
        if (response.success && response.data) {
            // Guarda las categorías en la variable global
            categories = response.data;
            // Muestra las categorías en el grid
            displayCategoriesGrid(categories);
        }
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading categories:', error);
        // Muestra un mensaje de error en el grid
        grid.innerHTML = '<p style="text-align: center; color: var(--danger);">Error al cargar categorías</p>';
    }
}

/**
 * Muestra las categorías en el grid
 * Crea tarjetas para cada categoría con su información y acciones
 * @param {array} data - Array de categorías a mostrar
 */
function displayCategoriesGrid(data) {
    // Obtiene el elemento del grid donde se mostrarán las categorías
    const grid = document.getElementById('categoriesGrid');
    
    // Verifica si hay datos para mostrar
    if (!data || data.length === 0) {
        // Si no hay datos, muestra un mensaje indicando que no hay categorías
        grid.innerHTML = '<p style="text-align: center; color: var(--gray-600);">No hay categorías</p>';
        // Termina la ejecución
        return;
    }
    
    // Crea HTML para cada categoría y lo concatena
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
 * Carga los datos de reseñas
 * Obtiene las reseñas desde el servidor y las muestra en la lista
 */
async function loadReviewsData() {
    // Obtiene el elemento de la lista donde se mostrarán las reseñas
    const list = document.getElementById('adminReviewsList');
    // Muestra un estado de carga mientras se obtienen los datos
    list.innerHTML = '<div class="loading-state"><div class="loader"></div></div>';
    
    try {
        // Realiza una petición al API para obtener reseñas (máximo 50)
        const response = await api.getReviews({ limite: 50 });
        
        // Verifica si la respuesta fue exitosa y tiene datos
        if (response.success && response.data) {
            // Guarda las reseñas en la variable global, asegurándose de que sea un array
            reviews = Array.isArray(response.data) ? response.data : [];
            // Muestra las reseñas en la lista
            displayReviewsList(reviews);
        } else {
            // Si la respuesta no fue exitosa, lanza un error
            throw new Error(response.message || 'Error al cargar reseñas');
        }
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading reviews:', error);
        // Muestra un mensaje de error en la lista
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
 * Carga los datos de usuarios
 * Obtiene todos los usuarios desde el servidor y los muestra en la tabla
 */
async function loadUsersData() {
    // Obtiene el elemento tbody de la tabla de usuarios
    const tbody = document.getElementById('usersTableBody');
    // Muestra un estado de carga mientras se obtienen los datos
    tbody.innerHTML = '<tr><td colspan="6"><div class="loading-state"><div class="loader"></div></div></td></tr>';
    
    try {
        // El backend limita 'limite' a máximo 100
        // Realiza una petición al API para obtener usuarios (máximo 100)
        const response = await api.getUsers({ limite: 100 });
        
        // Verifica si la respuesta existe y fue exitosa con datos
        if (response && response.success && response.data) {
            // Guarda los usuarios en la variable global, asegurándose de que sea un array
            users = Array.isArray(response.data) ? response.data : [];
            // Muestra los usuarios en la tabla
            displayUsersTable(users);
        } else if (response && !response.success) {
            // El backend devolvió un error
            // Extrae el mensaje de error de diferentes posibles propiedades
            const errorMsg = response.message || response.error || 'Error al cargar usuarios';
            // Lanza un error con el mensaje extraído
            throw new Error(errorMsg);
        } else {
            // Respuesta inesperada
            // Lanza un error indicando que el formato de respuesta no es el esperado
            throw new Error('Formato de respuesta inesperado del servidor');
        }
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading users:', error);
        
        // Determinar el mensaje de error más descriptivo
        // Inicializa el mensaje de error con un mensaje genérico
        let errorMessage = 'Error desconocido';
        // Si el error tiene un mensaje
        if (error.message) {
            // Usa el mensaje del error
            errorMessage = error.message;
        // Si el error es un TypeError relacionado con fetch
        } else if (error instanceof TypeError && error.message.includes('fetch')) {
            // Establece un mensaje específico para errores de conexión
            errorMessage = 'Error de conexión con el servidor. Verifica que el backend esté corriendo.';
        // Si el error indica que el recurso no fue encontrado (404)
        } else if (error.message && (error.message.includes('404') || error.message.includes('no encontrado'))) {
            // Establece un mensaje específico para endpoints no disponibles
            errorMessage = 'El endpoint de usuarios no está disponible. Verifica la configuración del backend.';
        }
        
        // Muestra un mensaje de error detallado en la tabla
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger); padding: 2rem;">
            <div class="empty-admin-state">
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3>Error al cargar usuarios</h3>
                <p>${sanitizeHTML(errorMessage)}</p>
                <p style="font-size: 0.875rem; color: var(--gray-600); margin-top: 0.5rem;">
                    Verifica que el endpoint <code>/admin/usuarios</code> o <code>/usuarios</code> esté disponible en el backend.
                </p>
            </div>
        </td></tr>`;
        // Muestra un toast con el mensaje de error
        showToast(errorMessage, 'error');
    }
}

/**
 * Muestra los usuarios en la tabla
 * Crea filas de tabla para cada usuario con su información y acciones
 * @param {array} data - Array de usuarios a mostrar
 */
function displayUsersTable(data) {
    // Obtiene el elemento tbody de la tabla de usuarios
    const tbody = document.getElementById('usersTableBody');
    
    // Verifica si hay datos para mostrar
    if (!data || data.length === 0) {
        // Si no hay datos, muestra un mensaje indicando que no hay usuarios
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--gray-600);">No hay usuarios</td></tr>';
        // Termina la ejecución
        return;
    }
    
    // Crea HTML para cada usuario y lo concatena
    tbody.innerHTML = data.map(user => {
        // Obtiene el nombre del usuario (nombre completo o email)
        const userName = user.nombre || user.email;
        // Genera las iniciales del usuario (primeras letras de cada palabra, máximo 2)
        const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        // Verifica si el usuario es administrador (puede venir como 'role' o 'rol')
        const isAdmin = (user.role === CONFIG.ROLES.ADMIN || user.rol === CONFIG.ROLES.ADMIN);
        
        // Retorna el HTML de la fila de la tabla
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
 * Muestra el modal para crear un nuevo restaurante
 * Resetea el formulario y carga las categorías disponibles
 */
async function showCreateRestaurantModal() {
    // Limpia el ID de edición (indica que es una creación nueva)
    currentEditId = null;
    // Establece el título del modal a "Nuevo Restaurante"
    document.getElementById('restaurantModalTitle').textContent = 'Nuevo Restaurante';
    // Resetea el formulario (limpia todos los campos)
    document.getElementById('restaurantForm').reset();
    
    // Inicializa el contador de caracteres
    // Obtiene el elemento del contador de caracteres
    const descCounter = document.getElementById('descCharCount');
    // Si el contador existe
    if (descCounter) {
        // Establece el contador a 0
        descCounter.textContent = '0';
    }
    
    // Carga categorías para el select
    // Carga todas las categorías disponibles para el selector
    await loadCategoryOptions();
    
    // Muestra el modal agregando la clase 'active'
    document.getElementById('restaurantModal').classList.add('active');
    // Agrega la clase 'modal-open' al body para prevenir scroll
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
 * Carga las opciones de categorías para el selector
 * Obtiene todas las categorías y las agrega al select
 */
async function loadCategoryOptions() {
    // Obtiene el elemento select de categorías
    const select = document.getElementById('restaurantCategory');
    
    try {
        // Si no hay categorías cargadas
        if (categories.length === 0) {
            // Realiza una petición al API para obtener todas las categorías
            const response = await api.getCategories();
            // Si la respuesta fue exitosa
            if (response.success) {
                // Guarda las categorías en la variable global
                categories = response.data;
            }
        }
        
        // Establece el HTML del select con la opción por defecto y todas las categorías
        select.innerHTML = '<option value="">Seleccionar...</option>' + 
            categories.map(cat => `<option value="${cat.nombre}">${cat.nombre}</option>`).join('');
            
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading categories:', error);
    }
}

/**
 * Cierra el modal de restaurante
 * Oculta el modal, resetea el formulario y limpia el estado
 */
function closeRestaurantModal() {
    // Oculta el modal removiendo la clase 'active'
    document.getElementById('restaurantModal').classList.remove('active');
    // Resetea el formulario (limpia todos los campos)
    document.getElementById('restaurantForm').reset();
    // Remueve la clase 'modal-open' del body para permitir scroll
    document.body.classList.remove('modal-open');
    
    // Limpiar imagen
    // Si la función removeImage existe
    if (typeof removeImage === 'function') {
        // Restaura el placeholder de imagen
        removeImage('restaurantImage', 'restaurantImagePreview');
    }
    
    // Limpia el ID de edición actual
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
 * Muestra el modal para crear una nueva categoría
 * Resetea el formulario y muestra el modal
 */
function showCreateCategoryModal() {
    // Limpia el ID de edición (indica que es una creación nueva)
    currentEditId = null;
    // Establece el título del modal a "Nueva Categoría"
    document.getElementById('categoryModalTitle').textContent = 'Nueva Categoría';
    // Resetea el formulario (limpia todos los campos)
    document.getElementById('categoryForm').reset();
    
    // Inicializa el contador de caracteres
    // Obtiene el elemento del contador de caracteres
    const descCounter = document.getElementById('catDescCharCount');
    // Si el contador existe
    if (descCounter) {
        // Establece el contador a 0
        descCounter.textContent = '0';
    }
    
    // Muestra el modal agregando la clase 'active'
    document.getElementById('categoryModal').classList.add('active');
    // Agrega la clase 'modal-open' al body para prevenir scroll
    document.body.classList.add('modal-open');
}

/**
 * Edita una categoría existente
 * Abre el modal de edición y carga los datos de la categoría en el formulario
 * @param {string} id - ID de la categoría a editar
 */
function editCategory(id) {
    // Busca la categoría en el array por su ID
    const category = categories.find(c => c._id === id);
    // Si no se encuentra la categoría, termina la ejecución
    if (!category) return;
    
    // Guarda el ID de la categoría que se está editando
    currentEditId = id;
    // Establece el título del modal a "Editar Categoría"
    document.getElementById('categoryModalTitle').textContent = 'Editar Categoría';
    // Establece el nombre de la categoría en el input
    document.getElementById('categoryName').value = category.nombre;
    // Obtiene la descripción de la categoría o cadena vacía si no existe
    const descValue = category.descripcion || '';
    // Establece la descripción de la categoría en el textarea
    document.getElementById('categoryDescription').value = descValue;
    
    // Inicializa el contador de caracteres
    // Obtiene el elemento del contador de caracteres
    const descCounter = document.getElementById('catDescCharCount');
    // Si el contador existe
    if (descCounter) {
        // Establece el contador con la longitud de la descripción
        descCounter.textContent = descValue.length;
    }
    
    // Muestra el modal agregando la clase 'active'
    document.getElementById('categoryModal').classList.add('active');
    // Agrega la clase 'modal-open' al body para prevenir scroll
    document.body.classList.add('modal-open');
}

/**
 * Cierra el modal de categoría
 * Oculta el modal y limpia el estado
 */
function closeCategoryModal() {
    // Oculta el modal removiendo la clase 'active'
    document.getElementById('categoryModal').classList.remove('active');
    // Remueve la clase 'modal-open' del body para permitir scroll
    document.body.classList.remove('modal-open');
    // Limpia el ID de edición actual
    currentEditId = null;
}

/**
 * Maneja el envío del formulario de categoría
 * Valida los datos y crea o actualiza la categoría en el servidor
 * @param {Event} e - Evento de envío del formulario
 */
async function handleCategorySubmit(e) {
    // Previene el comportamiento por defecto del formulario (recargar la página)
    e.preventDefault();
    
    // Obtiene el formulario que disparó el evento
    const form = e.target;
    // Obtiene el botón de envío del formulario
    const submitBtn = form.querySelector('button[type="submit"]');
    // Crea un objeto FormData con los datos del formulario
    const formData = new FormData(form);
    // Convierte el FormData a un objeto JavaScript plano
    const data = Object.fromEntries(formData);
    
    // Deshabilita el botón de envío para evitar múltiples envíos
    submitBtn.disabled = true;
    // Guarda el texto original del botón para restaurarlo después
    const originalText = submitBtn.textContent;
    // Cambia el texto del botón a 'Guardando...' para indicar que está procesando
    submitBtn.textContent = 'Guardando...';
    
    try {
        // Determina si es creación o actualización y realiza la petición correspondiente
        let response;
        // Si hay un ID de edición (es una actualización)
        if (currentEditId) {
            // Realiza una petición al API para actualizar la categoría
            response = await api.updateCategory(currentEditId, data);
        } else {
            // Si no hay ID de edición (es una creación nueva)
            // Realiza una petición al API para crear la categoría
            response = await api.createCategory(data);
        }
        
        // Verifica si la respuesta fue exitosa
        if (response.success) {
            // Muestra un mensaje de éxito según si fue creación o actualización
            showToast(currentEditId ? CONFIG.MESSAGES.SUCCESS.CATEGORY_UPDATED : CONFIG.MESSAGES.SUCCESS.CATEGORY_CREATED, 'success');
            // Cierra el modal
            closeCategoryModal();
            // Recarga los datos de categorías para mostrar los cambios
            await loadCategoriesData();
        } else {
            // Si la respuesta no fue exitosa, lanza un error
            throw new Error(response.message);
        }
    } catch (error) {
        // Si hay un error durante el guardado
        // Registra el error en la consola para depuración
        console.error('Error saving category:', error);
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
 * Confirma la eliminación de un elemento
 * Abre el modal de confirmación de eliminación
 * @param {string} type - Tipo de elemento (restaurant, category, dish, review, user)
 * @param {string} id - ID del elemento a eliminar
 * @param {string} name - Nombre del elemento a eliminar
 */
function confirmDelete(type, id, name) {
    // Guarda el tipo de elemento que se va a eliminar
    currentDeleteType = type;
    // Guarda el ID del elemento que se va a eliminar
    currentDeleteId = id;
    
    // Mapa de mensajes de confirmación para cada tipo de elemento
    const messages = {
        restaurant: `¿Eliminar el restaurante "${name}"?`,
        category: `¿Eliminar la categoría "${name}"?`,
        dish: `¿Eliminar el plato "${name}"?`,
        review: `¿Eliminar ${name}?`,
        user: `¿Eliminar el usuario "${name}"?`
    };
    
    // Establece el mensaje de confirmación según el tipo de elemento
    document.getElementById('deleteMessage').textContent = messages[type] || '¿Confirmar eliminación?';
    // Muestra el modal de confirmación agregando la clase 'active'
    document.getElementById('deleteConfirmModal').classList.add('active');
    // Agrega la clase 'modal-open' al body para prevenir scroll
    document.body.classList.add('modal-open');
    
    // Obtiene el botón de confirmación de eliminación
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    // Configura el onclick del botón para ejecutar la eliminación
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

// Inicializa el panel de administración cuando el DOM está listo
// Verifica si el documento está cargando
if (document.readyState === 'loading') {
    // Si está cargando, espera a que el evento 'DOMContentLoaded' se dispare
    document.addEventListener('DOMContentLoaded', () => {
        // Inicializa la UI de autenticación primero (antes de verificar permisos)
        // Verifica si la función initAuthUI existe antes de llamarla
        if (typeof initAuthUI === 'function') {
            // Inicializa la UI de autenticación
            initAuthUI();
        }
        // Inicializa el panel de administración
        initAdminPanel();
    });
} else {
    // Si el DOM ya está listo, ejecuta directamente
    // Inicializa la UI de autenticación primero (antes de verificar permisos)
    // Verifica si la función initAuthUI existe antes de llamarla
    if (typeof initAuthUI === 'function') {
        // Inicializa la UI de autenticación
        initAuthUI();
    }
    // Inicializa el panel de administración
    initAdminPanel();
}

// Exporta funciones para uso global
/**
 * Aprueba un restaurante
 * Marca el restaurante como aprobado en el servidor
 * @param {string} id - ID del restaurante a aprobar
 */
async function approveRestaurant(id) {
    try {
        // Realiza una petición al API para aprobar el restaurante
        const response = await api.approveRestaurant(id);
        
        // Verifica si la respuesta fue exitosa
        if (response.success) {
            // Muestra un mensaje de éxito
            showToast('Restaurante aprobado exitosamente', 'success');
            // Recarga los datos de restaurantes para reflejar el cambio
            await loadRestaurantsData();
        } else {
            // Si la respuesta no fue exitosa, lanza un error
            throw new Error(response.message || 'Error al aprobar restaurante');
        }
    } catch (error) {
        // Si hay un error durante la aprobación
        // Registra el error en la consola para depuración
        console.error('Error approving restaurant:', error);
        // Muestra un mensaje de error al usuario
        showToast(error.message || CONFIG.MESSAGES.ERROR.GENERIC, 'error');
    }
}

// ==================== GESTIÓN DE PLATOS ====================
// Array que almacena todos los platos
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
 * Pobla el filtro de restaurantes para platos
 * Llena el selector de restaurantes con todas las opciones disponibles
 */
function populateDishRestaurantFilter() {
    // Obtiene el elemento select del filtro de restaurantes
    const filter = document.getElementById('dishRestaurantFilter');
    // Si el elemento no existe, termina la ejecución
    if (!filter) return;
    
    try {
        // Establece el HTML del select con la opción por defecto y todos los restaurantes
        filter.innerHTML = '<option value="">Todos los restaurantes</option>' +
            restaurants.map(r => `<option value="${r._id}">${sanitizeHTML(r.nombre)}</option>`).join('');
    } catch (error) {
        // Si hay un error durante la población
        // Registra el error en la consola para depuración
        console.error('Error populating restaurant filter:', error);
        // Establece solo la opción por defecto en caso de error
        filter.innerHTML = '<option value="">Todos los restaurantes</option>';
    }
}

/**
 * Filtra los platos por restaurante
 * Muestra solo los platos del restaurante seleccionado
 */
function filterDishesByRestaurant() {
    // Obtiene el elemento select del filtro de restaurantes
    const filter = document.getElementById('dishRestaurantFilter');
    // Si el elemento no existe, termina la ejecución
    if (!filter) return;
    
    // Limpiar cualquier mensaje de error
    // Obtiene la barra de filtros
    const filterBar = document.querySelector('.filter-bar');
    // Si la barra de filtros existe
    if (filterBar) {
        // Busca cualquier mensaje de error existente
        const errorMsg = filterBar.querySelector('.error-message');
        // Si existe un mensaje de error, lo elimina
        if (errorMsg) errorMsg.remove();
    }
    
    try {
        // Obtiene el ID del restaurante seleccionado
        const restaurantId = filter.value;
        
        // Si no hay restaurante seleccionado (valor vacío)
        if (!restaurantId) {
            // Muestra todos los platos
            displayDishesGrid(dishes);
            // Termina la ejecución
            return;
        }
        
        // Filtra los platos que pertenecen al restaurante seleccionado
        const filteredDishes = dishes.filter(d => {
            // Si el plato no tiene restauranteId, lo excluye
            if (!d.restauranteId) return false;
            // Compara el restauranteId del plato con el seleccionado (como string o como objeto)
            return d.restauranteId === restaurantId || d.restauranteId.toString() === restaurantId.toString();
        });
        
        // Muestra los platos filtrados
        displayDishesGrid(filteredDishes);
    } catch (error) {
        // Si hay un error durante el filtrado
        // Registra el error en la consola para depuración
        console.error('Error filtering dishes:', error);
        // Muestra un mensaje de error al usuario
        showToast('Error al filtrar platos', 'error');
        // Muestra todos los platos en caso de error
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

// Exporta funciones a window para handlers onclick
// Hace la función showCreateRestaurantModal disponible globalmente a través de window
window.showCreateRestaurantModal = showCreateRestaurantModal;
// Hace la función editRestaurant disponible globalmente a través de window
window.editRestaurant = editRestaurant;
// Hace la función closeRestaurantModal disponible globalmente a través de window
window.closeRestaurantModal = closeRestaurantModal;
// Hace la función showCreateCategoryModal disponible globalmente a través de window
window.showCreateCategoryModal = showCreateCategoryModal;
// Hace la función editCategory disponible globalmente a través de window
window.editCategory = editCategory;
// Hace la función closeCategoryModal disponible globalmente a través de window
window.closeCategoryModal = closeCategoryModal;
// Hace la función showCreateDishModal disponible globalmente a través de window
window.showCreateDishModal = showCreateDishModal;
// Hace la función editDish disponible globalmente a través de window
window.editDish = editDish;
// Hace la función closeDishModal disponible globalmente a través de window
window.closeDishModal = closeDishModal;
// Hace la función filterDishesByRestaurant disponible globalmente a través de window
window.filterDishesByRestaurant = filterDishesByRestaurant;
// Hace la función confirmDelete disponible globalmente a través de window
window.confirmDelete = confirmDelete;
// Hace la función closeDeleteModal disponible globalmente a través de window
window.closeDeleteModal = closeDeleteModal;
window.approveRestaurant = approveRestaurant;