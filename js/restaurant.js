/**
 * FoodieRank - Restaurants Page Logic
 * Handles restaurant listing, filtering, and search
 */

// Estado de la página - Variables globales para almacenar el estado de la página
// Page state
// Página actual de la paginación (inicia en 1)
let currentPage = 1;
// Total de páginas disponibles para la paginación (inicia en 1)
let totalPages = 1;
// Vista actual del listado ('grid' para cuadrícula o 'list' para lista)
let currentView = 'grid';
// Objeto que almacena todos los filtros activos
let filters = {
    // Término de búsqueda de texto libre
    search: '',
    // Nombre de la categoría seleccionada
    category: '',
    // Calificación mínima (0 significa sin filtro de calificación)
    rating: 0,
    // Campo por el cual ordenar ('ranking', 'nombre', etc.)
    ordenarPor: 'ranking',
    // Orden de clasificación ('asc' ascendente o 'desc' descendente)
    orden: 'desc'
};
// Array que almacena todas las categorías cargadas del servidor
let categories = [];
// Array que almacena todos los restaurantes cargados del servidor
let restaurants = [];

/**
 * Inicializa la página
 * Carga los datos iniciales, parsea parámetros de URL y configura event listeners
 */
async function initPage() {
    // Carga los datos iniciales
    // Carga las categorías desde el servidor
    await loadCategories();
    
    // Parsea los parámetros de la URL
    // Extrae los filtros y parámetros de la URL actual
    parseURLParameters();
    
    // Configura los event listeners
    // Agrega todos los listeners necesarios para interactividad
    setupEventListeners();
    
    // Carga los restaurantes
    // Carga los restaurantes del servidor con los filtros aplicados
    await loadRestaurants();
}

/**
 * Parsea los parámetros de la URL
 * Extrae los filtros y configuración desde los parámetros de consulta de la URL
 */
function parseURLParameters() {
    // Obtiene todos los parámetros de consulta de la URL actual
    const params = getQueryParams();
    
    // Si hay un parámetro de búsqueda en la URL
    if (params.search) {
        // Establece el filtro de búsqueda con el valor del parámetro
        filters.search = params.search;
        // Establece el valor del input de búsqueda en el DOM
        document.getElementById('searchInput').value = params.search;
        // Muestra el botón para limpiar la búsqueda
        showClearButton();
    }
    
    // Si hay un parámetro de categoría en la URL
    if (params.category) {
        // Establece el filtro de categoría con el valor del parámetro
        filters.category = params.category;
    }
    
    // Si hay un parámetro de calificación en la URL
    if (params.rating) {
        // Convierte el parámetro a número entero y lo establece como filtro de calificación
        filters.rating = parseInt(params.rating);
    }
    
    // Backend usa ordenarPor y orden
    // Si hay un parámetro de ordenamiento por campo
    if (params.ordenarPor) {
        // Establece el campo por el cual ordenar
        filters.ordenarPor = params.ordenarPor;
        // Establece el orden (descendente por defecto si no se especifica)
        filters.orden = params.orden || 'desc';
        // Actualiza el valor del select de ordenamiento en el formato "campo-orden"
        document.getElementById('sortFilter').value = `${params.ordenarPor}-${params.orden || 'desc'}`;
    } else if (params.sort) {
        // Compatibilidad con formato anterior
        // Si viene el parámetro 'sort' en formato antiguo, lo parsea
        const parts = params.sort.split('-');
        // Si tiene exactamente 2 partes (campo y orden)
        if (parts.length === 2) {
            // Establece el campo de ordenamiento desde la primera parte
            filters.ordenarPor = parts[0];
            // Establece el orden desde la segunda parte
            filters.orden = parts[1];
        }
        // Actualiza el valor del select de ordenamiento
        document.getElementById('sortFilter').value = params.sort;
    }
    
    // Si hay un parámetro de página en la URL
    if (params.page) {
        // Convierte el parámetro a número entero y establece la página actual
        currentPage = parseInt(params.page);
    } else if (params.saltar !== undefined) {
        // Calcular página desde saltar si se proporciona
        // Si viene el parámetro 'saltar' (offset), calcula la página correspondiente
        // Divide el offset por el límite de elementos por página y suma 1 (ya que la página inicia en 1)
        currentPage = Math.floor(params.saltar / CONFIG.PAGINATION.DEFAULT_LIMIT) + 1;
    }
}

/**
 * Configura los event listeners
 * Agrega todos los listeners necesarios para la interactividad de la página
 */
function setupEventListeners() {
    // Input de búsqueda
    // Obtiene el elemento del input de búsqueda
    const searchInput = document.getElementById('searchInput');
    // Agrega un listener al evento 'input' con debounce de 500ms (espera medio segundo después de que el usuario deje de escribir)
    searchInput.addEventListener('input', debounce(handleSearch, 500));
    
    // Botón para limpiar búsqueda
    // Obtiene el elemento del botón para limpiar la búsqueda
    const clearSearch = document.getElementById('clearSearch');
    // Agrega un listener al evento 'click' del botón
    clearSearch.addEventListener('click', () => {
        // Limpia el valor del input de búsqueda
        searchInput.value = '';
        // Limpia el filtro de búsqueda
        filters.search = '';
        // Oculta el botón de limpiar búsqueda
        hideClearButton();
        // Actualiza la URL y recarga los restaurantes
        updateURLAndReload();
    });
    
    // Toggle de filtros (mostrar/ocultar sidebar)
    // Obtiene el elemento del botón que togglea los filtros
    const filterToggle = document.getElementById('filterToggle');
    // Obtiene el elemento del sidebar de filtros
    const sidebarFilters = document.getElementById('sidebarFilters');
    // Agrega un listener al evento 'click' del botón toggle
    filterToggle.addEventListener('click', () => {
        // Alterna la clase 'active' del sidebar (lo muestra u oculta)
        sidebarFilters.classList.toggle('active');
    });
    
    // Botón para limpiar todos los filtros
    // Obtiene el elemento del botón para limpiar filtros
    const clearFilters = document.getElementById('clearFilters');
    // Agrega un listener al evento 'click' del botón
    clearFilters.addEventListener('click', () => {
        // Llama a la función para resetear todos los filtros
        resetFilters();
    });
    
    // Filtro de ordenamiento
    // Obtiene el elemento del select de ordenamiento
    const sortFilter = document.getElementById('sortFilter');
    // Agrega un listener al evento 'change' del select
    sortFilter.addEventListener('change', (e) => {
        // Parsea el valor del formato "ordenarPor-orden"
        // Obtiene el valor seleccionado del select
        const value = e.target.value;
        // Si el valor contiene un guion (formato correcto)
        if (value.includes('-')) {
            // Divide el valor por el guion para obtener campo y orden
            const [ordenarPor, orden] = value.split('-');
            // Establece el campo de ordenamiento
            filters.ordenarPor = ordenarPor;
            // Establece el orden (ascendente o descendente)
            filters.orden = orden;
        } else {
            // Fallback para formato anterior
            // Si no tiene el formato correcto, usa valores por defecto
            filters.ordenarPor = 'ranking';
            filters.orden = 'desc';
        }
        // Resetea a la primera página cuando se cambia el ordenamiento
        currentPage = 1;
        // Actualiza la URL y recarga los restaurantes
        updateURLAndReload();
    });
    
    // Toggle de vista (cuadrícula/lista)
    // Agrega un listener al botón de vista de cuadrícula
    document.getElementById('gridView').addEventListener('click', () => setView('grid'));
    // Agrega un listener al botón de vista de lista
    document.getElementById('listView').addEventListener('click', () => setView('list'));
    
    // Paginación
    // Agrega un listener al botón de página anterior
    document.getElementById('prevPage').addEventListener('click', () => changePage(currentPage - 1));
    // Agrega un listener al botón de página siguiente
    document.getElementById('nextPage').addEventListener('click', () => changePage(currentPage + 1));
}

/**
 * Carga las categorías desde el servidor
 * Realiza una petición al API y muestra las categorías como filtros
 */
async function loadCategories() {
    // Obtiene el contenedor donde se mostrarán los filtros de categoría
    const container = document.getElementById('categoryFilters');
    // Muestra un estado de carga mientras se obtienen las categorías
    container.innerHTML = '<div class="loading-state"><div class="loader"></div></div>';
    
    try {
        // Realiza una petición al API para obtener todas las categorías
        const response = await api.getCategories();
        
        // Verifica si la respuesta fue exitosa y tiene datos
        if (response.success && response.data) {
            // Guarda las categorías en la variable global
            categories = response.data;
            // Llama a la función para mostrar las categorías como checkboxes
            displayCategoryFilters(categories);
        }
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading categories:', error);
        // Muestra un mensaje de error en el contenedor
        container.innerHTML = '<p style="color: var(--danger); text-align: center; font-size: 0.9rem;">Error al cargar categorías</p>';
    }
}

/**
 * Muestra los filtros de categoría
 * Crea checkboxes para cada categoría que permiten filtrar por categoría
 * @param {array} categoriesToDisplay - Categorías a mostrar
 */
function displayCategoryFilters(categoriesToDisplay) {
    // Obtiene el contenedor donde se mostrarán los filtros de categoría
    const container = document.getElementById('categoryFilters');
    
    // Crea HTML para cada categoría como checkbox y lo concatena
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
 * Maneja el cambio de selección de categoría
 * Solo permite una categoría seleccionada a la vez (comportamiento de radio button)
 * @param {string} categoryName - Nombre de la categoría seleccionada
 */
function handleCategoryChange(categoryName) {
    // Desmarca todas las demás categorías
    // Selecciona todos los checkboxes de categorías y los itera
    document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(cb => {
        // Si el checkbox no es el que fue clickeado, lo desmarca
        if (cb.value !== categoryName) cb.checked = false;
    });
    
    // Obtiene el checkbox de la categoría clickeada
    const checkbox = document.querySelector(`#categoryFilters input[value="${categoryName}"]`);
    // Establece el filtro de categoría si está marcado, sino lo limpia
    filters.category = checkbox.checked ? categoryName : '';
    // Resetea a la primera página cuando se cambia el filtro
    currentPage = 1;
    // Actualiza la URL y recarga los restaurantes
    updateURLAndReload();
}

/**
 * Configura el filtro de calificación por estrellas
 * Agrega listeners a los botones de estrellas para filtrar por calificación mínima
 */
function setupRatingFilter() {
    // Obtiene todos los botones de estrellas
    const ratingButtons = document.querySelectorAll('.star-btn');
    
    // Itera sobre cada botón de estrella
    ratingButtons.forEach(btn => {
        // Agrega un listener al evento 'click' de cada botón
        btn.addEventListener('click', () => {
            // Obtiene la calificación del atributo data-rating y la convierte a número
            const rating = parseInt(btn.dataset.rating);
            
            // Toggle de calificación (si se clickea la misma estrella, se desactiva)
            // Si el filtro actual es igual a la calificación clickeada
            if (filters.rating === rating) {
                // Desactiva el filtro de calificación (0 significa sin filtro)
                filters.rating = 0;
                // Remueve la clase 'active' de todos los botones de estrellas
                ratingButtons.forEach(b => b.classList.remove('active'));
            } else {
                // Si se selecciona una calificación diferente
                // Establece el filtro de calificación
                filters.rating = rating;
                // Remueve la clase 'active' de todos los botones
                ratingButtons.forEach(b => b.classList.remove('active'));
                // Agrega la clase 'active' al botón clickeado para resaltarlo
                btn.classList.add('active');
            }
            
            // Resetea a la primera página cuando se cambia el filtro
            currentPage = 1;
            // Actualiza la URL y recarga los restaurantes
            updateURLAndReload();
        });
    });
    
    // Establece el estado inicial activo
    // Si hay un filtro de calificación activo al cargar la página
    if (filters.rating > 0) {
        // Busca el botón correspondiente a la calificación del filtro
        const activeBtn = document.querySelector(`.star-btn[data-rating="${filters.rating}"]`);
        // Si el botón existe, le agrega la clase 'active' para resaltarlo
        if (activeBtn) activeBtn.classList.add('active');
    }
}

/**
 * Maneja la búsqueda de texto
 * Actualiza el filtro de búsqueda cuando el usuario escribe en el input
 * @param {Event} e - Evento de input del campo de búsqueda
 */
function handleSearch(e) {
    // Obtiene el valor del input y elimina espacios al inicio y final
    filters.search = e.target.value.trim();
    
    // Si hay texto en la búsqueda
    if (filters.search) {
        // Muestra el botón para limpiar la búsqueda
        showClearButton();
    } else {
        // Si no hay texto, oculta el botón de limpiar búsqueda
        hideClearButton();
    }
    
    // Resetea a la primera página cuando se cambia la búsqueda
    currentPage = 1;
    // Actualiza la URL y recarga los restaurantes
    updateURLAndReload();
}

/**
 * Muestra el botón para limpiar la búsqueda
 * Hace visible el botón X que permite limpiar el término de búsqueda
 */
function showClearButton() {
    // Obtiene el botón de limpiar búsqueda y lo hace visible con display flex
    document.getElementById('clearSearch').style.display = 'flex';
}

/**
 * Oculta el botón para limpiar la búsqueda
 * Oculta el botón X cuando no hay término de búsqueda
 */
function hideClearButton() {
    // Obtiene el botón de limpiar búsqueda y lo oculta con display none
    document.getElementById('clearSearch').style.display = 'none';
}

/**
 * Resetea todos los filtros
 * Limpia todos los filtros y vuelve a la configuración por defecto
 */
function resetFilters() {
    // Restablece el objeto de filtros a sus valores por defecto
    filters = {
        // Limpia el término de búsqueda
        search: '',
        // Limpia el filtro de categoría
        category: '',
        // Limpia el filtro de calificación (0 significa sin filtro)
        rating: 0,
        // Restablece el campo de ordenamiento a 'ranking'
        ordenarPor: 'ranking',
        // Restablece el orden a descendente
        orden: 'desc'
    };
    
    // Limpia el valor del input de búsqueda en el DOM
    document.getElementById('searchInput').value = '';
    // Restablece el select de ordenamiento a 'ranking-desc'
    document.getElementById('sortFilter').value = 'ranking-desc';
    // Desmarca todos los checkboxes de categorías
    document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(cb => cb.checked = false);
    // Remueve la clase 'active' de todos los botones de estrellas
    document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('active'));
    
    // Oculta el botón de limpiar búsqueda
    hideClearButton();
    // Resetea a la primera página
    currentPage = 1;
    // Actualiza la URL y recarga los restaurantes
    updateURLAndReload();
}

/**
 * Actualiza la URL y recarga los restaurantes
 * Sincroniza los filtros con la URL y recarga los restaurantes con los nuevos filtros
 */
function updateURLAndReload() {
    // Crea un objeto vacío para los parámetros de la URL
    const params = {};
    
    // Si hay un término de búsqueda, lo agrega a los parámetros
    if (filters.search) params.search = filters.search;
    // category se maneja arriba con categoriaId
    // Si hay un filtro de calificación mínima, lo agrega a los parámetros
    if (filters.rating) params.minRating = filters.rating;
    // Backend usa ordenarPor y orden en lugar de sort
    // Si hay un campo de ordenamiento, lo agrega a los parámetros
    if (filters.ordenarPor) params.ordenarPor = filters.ordenarPor;
    // Si hay un orden, lo agrega a los parámetros
    if (filters.orden) params.orden = filters.orden;
    // Si no estamos en la primera página, agrega el parámetro de página
    if (currentPage > 1) params.pagina = currentPage; // Usar 'pagina' o 'saltar' según el backend
    
    // Actualiza los parámetros de consulta en la URL sin recargar la página
    updateQueryParams(params);
    // Recarga los restaurantes con los nuevos filtros
    loadRestaurants();
    // Actualiza la visualización de filtros activos
    updateActiveFilters();
    // Actualiza el contador de filtros activos
    updateFilterCount();
}

/**
 * Actualiza la visualización de filtros activos
 * Muestra chips (etiquetas) para cada filtro activo con botón para removerlo
 */
function updateActiveFilters() {
    // Obtiene el contenedor principal de filtros activos
    const container = document.getElementById('activeFilters');
    // Obtiene el contenedor donde se mostrarán los chips de filtros
    const chipsContainer = document.getElementById('filterChips');
    
    // Array para almacenar los filtros activos
    const activeFilters = [];
    
    // Si hay un filtro de búsqueda activo
    if (filters.search) {
        // Agrega el filtro de búsqueda al array
        activeFilters.push({
            type: 'search',
            label: `Búsqueda: "${filters.search}"`,
            value: filters.search
        });
    }
    
    // Si hay un filtro de categoría activo
    if (filters.category) {
        // Agrega el filtro de categoría al array
        activeFilters.push({
            type: 'category',
            label: `Categoría: ${filters.category}`,
            value: filters.category
        });
    }
    
    // Si hay un filtro de calificación activo
    if (filters.rating) {
        // Agrega el filtro de calificación al array
        activeFilters.push({
            type: 'rating',
            label: `Mínimo ${filters.rating} estrellas`,
            value: filters.rating
        });
    }
    
    // Si hay filtros activos
    if (activeFilters.length > 0) {
        // Muestra el contenedor de filtros activos
        container.style.display = 'block';
        // Crea HTML para cada filtro activo como un chip con botón para removerlo
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
        // Si no hay filtros activos, oculta el contenedor
        container.style.display = 'none';
    }
}

/**
 * Remueve un filtro específico
 * Elimina un filtro individual según su tipo y actualiza la página
 * @param {string} type - Tipo de filtro a remover ('search', 'category', 'rating')
 */
function removeFilter(type) {
    // Usa switch para manejar diferentes tipos de filtros
    switch (type) {
        case 'search':
            // Limpia el filtro de búsqueda
            filters.search = '';
            // Limpia el valor del input de búsqueda
            document.getElementById('searchInput').value = '';
            // Oculta el botón de limpiar búsqueda
            hideClearButton();
            break;
        case 'category':
            // Limpia el filtro de categoría
            filters.category = '';
            // Desmarca todos los checkboxes de categorías
            document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(cb => cb.checked = false);
            break;
        case 'rating':
            // Limpia el filtro de calificación
            filters.rating = 0;
            // Remueve la clase 'active' de todos los botones de estrellas
            document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('active'));
            break;
    }
    
    // Resetea a la primera página cuando se remueve un filtro
    currentPage = 1;
    // Actualiza la URL y recarga los restaurantes
    updateURLAndReload();
}

/**
 * Actualiza el badge de conteo de filtros
 * Muestra un número indicando cuántos filtros están activos
 */
function updateFilterCount() {
    // Obtiene el elemento del badge de conteo
    const badge = document.getElementById('filterCount');
    // Inicializa el contador en 0
    let count = 0;
    
    // Si hay filtro de búsqueda, incrementa el contador
    if (filters.search) count++;
    // Si hay filtro de categoría, incrementa el contador
    if (filters.category) count++;
    // Si hay filtro de calificación, incrementa el contador
    if (filters.rating) count++;
    
    // Si hay al menos un filtro activo
    if (count > 0) {
        // Establece el texto del badge con el número de filtros
        badge.textContent = count;
        // Muestra el badge con display flex
        badge.style.display = 'flex';
    } else {
        // Si no hay filtros activos, oculta el badge
        badge.style.display = 'none';
    }
}

/**
 * Carga los restaurantes desde el servidor
 * Realiza una petición al API con los filtros y parámetros actuales
 */
async function loadRestaurants() {
    // Obtiene el elemento del grid donde se mostrarán los restaurantes
    const grid = document.getElementById('restaurantsGrid');
    // Muestra un estado de carga mientras se obtienen los restaurantes
    grid.innerHTML = '<div class="loading-state"><div class="loader"></div><p>Cargando restaurantes...</p></div>';
    
    try {
        // Crea un objeto con los parámetros para la petición al API
        const params = {
            // Calcula el offset (saltar) para la paginación: (página - 1) * elementos por página
            saltar: (currentPage - 1) * CONFIG.PAGINATION.DEFAULT_LIMIT,  // Backend usa 'saltar' para paginación
            // Establece el límite de elementos por página
            limite: CONFIG.PAGINATION.DEFAULT_LIMIT,  // Backend usa 'limite' no 'limit'
            // Campo por el cual ordenar (ranking por defecto)
            ordenarPor: filters.ordenarPor || 'ranking',
            // Orden de clasificación (descendente por defecto)
            orden: filters.orden || 'desc'
        };
        
        // Si hay un término de búsqueda, lo agrega a los parámetros
        if (filters.search) params.search = filters.search;
        // El backend filtra por categoriaId, pero podemos filtrar por nombre si el backend lo soporta
        // Por ahora enviar categoriaId si tenemos la categoría seleccionada
        if (filters.category) {
            // Buscar el ID de la categoría
            // Busca la categoría en el array por su nombre
            const category = categories.find(c => c.nombre === filters.category);
            // Si se encuentra la categoría y tiene ID
            if (category && category._id) {
                // Usa el ID de la categoría para filtrar
                params.categoriaId = category._id;
            } else {
                // Fallback: usar el nombre si no tenemos el ID
                params.categoria = filters.category;
            }
        }
        // Si hay un filtro de calificación mínima, lo agrega a los parámetros
        if (filters.rating) params.minRating = filters.rating;
        
        // Realiza la petición al API con los parámetros construidos
        const response = await api.getRestaurants(params);
        
        // Verifica si la respuesta fue exitosa y tiene datos
        if (response.success && response.data) {
            // Guarda los restaurantes en la variable global
            restaurants = response.data;
            // Obtiene el total de páginas desde la información de paginación o usa 1 por defecto
            totalPages = response.pagination?.totalPages || 1;
            
            // Muestra los restaurantes en el grid
            displayRestaurants(restaurants);
            // Actualiza la información de resultados (título y conteo)
            updateResultsInfo(response.pagination?.total || restaurants.length);
            // Actualiza la paginación (botones de páginas)
            updatePagination();
        } else {
            // Si la respuesta no fue exitosa, lanza un error
            throw new Error('Error al cargar restaurantes');
        }
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading restaurants:', error);
        // Muestra un mensaje de error con opción de reintentar
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
 * Muestra los restaurantes en el grid
 * Crea y muestra las tarjetas de restaurantes o un mensaje si no hay resultados
 * @param {array} restaurantsToDisplay - Restaurantes a mostrar
 */
function displayRestaurants(restaurantsToDisplay) {
    // Obtiene el elemento del grid donde se mostrarán los restaurantes
    const grid = document.getElementById('restaurantsGrid');
    
    // Verifica si hay restaurantes para mostrar
    if (!restaurantsToDisplay || restaurantsToDisplay.length === 0) {
        // Si no hay restaurantes, muestra un mensaje de estado vacío
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No se encontraron restaurantes</h3>
                <p>Intenta ajustar tus filtros de búsqueda</p>
                <button class="btn-primary" onclick="resetFilters()">Limpiar Filtros</button>
            </div>
        `;
        // Termina la ejecución
        return;
    }
    
    // Limpia el contenido previo del grid
    grid.innerHTML = '';
    
    // Itera sobre cada restaurante para crear su tarjeta
    restaurantsToDisplay.forEach(restaurant => {
        // Crea una tarjeta para el restaurante
        const card = createRestaurantCard(restaurant);
        // Agrega la tarjeta al grid del DOM
        grid.appendChild(card);
    });
}

/**
 * Crea un elemento de tarjeta de restaurante
 * Genera el HTML completo de la tarjeta con toda la información del restaurante
 * @param {object} restaurant - Datos del restaurante
 * @returns {HTMLElement} Elemento de tarjeta de restaurante
 */
function createRestaurantCard(restaurant) {
    // Crea un elemento div para la tarjeta
    const card = document.createElement('div');
    // Asigna la clase CSS 'restaurant-card' a la tarjeta
    card.className = 'restaurant-card';
    // Agrega un listener al evento click que navega a la página de detalle del restaurante
    card.onclick = () => navigateToRestaurant(restaurant._id);
    
    // Backend retorna calificacionPromedio
    // Obtiene la calificación promedio del restaurante (puede venir como 'calificacionPromedio' o 'promedioCalificacion')
    const rating = restaurant.calificacionPromedio || restaurant.promedioCalificacion || 0;
    // Obtiene el total de reseñas del restaurante, o 0 si no existe
    const reviewCount = restaurant.totalReseñas || 0;
    // Genera el HTML de las estrellas basándose en la calificación
    const stars = generateStars(rating);
    // Determina si el restaurante es popular (popularidad > 70 o más de 20 reseñas)
    const isPopular = restaurant.popularidad > 70 || reviewCount > 20;
    
    // Determinar si hay imagen (Base64 o URL)
    // Verifica si existe imagen y si es Base64 (empieza con 'data:image') o URL (empieza con 'http')
    const hasImage = restaurant.imagen && (restaurant.imagen.startsWith('data:image') || restaurant.imagen.startsWith('http'));
    // Si hay imagen, usa la imagen del restaurante, sino usa cadena vacía
    const imageSrc = hasImage ? restaurant.imagen : '';
    
    // Establece el HTML interno de la tarjeta con toda la información del restaurante
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
    
    // Retorna la tarjeta creada
    return card;
}

/**
 * Navega a la página de detalle del restaurante
 * Redirige a la página de detalle con el ID del restaurante
 * @param {string} restaurantId - ID del restaurante
 */
function navigateToRestaurant(restaurantId) {
    // Cambia la URL del navegador para ir a la página de detalle del restaurante
    window.location.href = `restaurant-detail.html?id=${restaurantId}`;
}

/**
 * Actualiza la información de resultados
 * Muestra el título y conteo de resultados según los filtros activos
 * @param {number} total - Total de resultados encontrados
 */
function updateResultsInfo(total) {
    // Obtiene el elemento del título de resultados
    const title = document.getElementById('resultsTitle');
    // Obtiene el elemento del conteo de resultados
    const count = document.getElementById('resultsCount');
    
    // Actualiza el título según los filtros activos
    // Si hay un filtro de búsqueda activo
    if (filters.search) {
        // Muestra el término de búsqueda en el título
        title.textContent = `Resultados para "${filters.search}"`;
    } else if (filters.category) {
        // Si hay un filtro de categoría, muestra el nombre de la categoría
        title.textContent = `Categoría: ${filters.category}`;
    } else {
        // Si no hay filtros, muestra el título genérico
        title.textContent = 'Todos los Restaurantes';
    }
    
    // Actualiza el conteo con el número total formateado y pluralización correcta
    count.textContent = `${formatNumber(total)} restaurante${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
}

/**
 * Establece el modo de vista (cuadrícula o lista)
 * Cambia la visualización entre vista de cuadrícula y lista
 * @param {string} view - Modo de vista ('grid' para cuadrícula o 'list' para lista)
 */
function setView(view) {
    // Actualiza la variable global con la vista seleccionada
    currentView = view;
    
    // Obtiene los elementos necesarios del DOM
    const grid = document.getElementById('restaurantsGrid');
    const gridBtn = document.getElementById('gridView');
    const listBtn = document.getElementById('listView');
    
    // Si se seleccionó la vista de cuadrícula
    if (view === 'grid') {
        // Remueve la clase 'list-view' del grid (muestra en cuadrícula)
        grid.classList.remove('list-view');
        // Agrega la clase 'active' al botón de cuadrícula (lo resalta)
        gridBtn.classList.add('active');
        // Remueve la clase 'active' del botón de lista
        listBtn.classList.remove('active');
    } else {
        // Si se seleccionó la vista de lista
        // Agrega la clase 'list-view' al grid (muestra en lista)
        grid.classList.add('list-view');
        // Remueve la clase 'active' del botón de cuadrícula
        gridBtn.classList.remove('active');
        // Agrega la clase 'active' al botón de lista (lo resalta)
        listBtn.classList.add('active');
    }
}

/**
 * Actualiza la paginación
 * Genera los botones de páginas y actualiza el estado de los botones anterior/siguiente
 */
function updatePagination() {
    // Obtiene los elementos necesarios del DOM
    const pagination = document.getElementById('pagination');
    const pagesContainer = document.getElementById('paginationPages');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    // Si hay una página o menos, oculta la paginación
    if (totalPages <= 1) {
        // Oculta el contenedor de paginación
        pagination.style.display = 'none';
        // Termina la ejecución
        return;
    }
    
    // Muestra el contenedor de paginación
    pagination.style.display = 'flex';
    
    // Actualiza los botones anterior/siguiente
    // Deshabilita el botón anterior si estamos en la primera página
    prevBtn.disabled = currentPage === 1;
    // Deshabilita el botón siguiente si estamos en la última página
    nextBtn.disabled = currentPage === totalPages;
    
    // Genera los botones de páginas
    // Limpia el contenedor de botones de páginas
    pagesContainer.innerHTML = '';
    
    // Define el número máximo de botones de páginas a mostrar (5)
    const maxPages = 5;
    // Calcula la página inicial mostrando páginas alrededor de la página actual
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    // Calcula la página final
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    // Ajusta el inicio si el rango es menor al máximo
    // Si el rango calculado es menor que maxPages, ajusta startPage hacia atrás
    if (endPage - startPage < maxPages - 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    // Crea un botón para cada página en el rango calculado
    for (let i = startPage; i <= endPage; i++) {
        // Crea un elemento button para la página
        const btn = document.createElement('button');
        // Asigna la clase CSS 'page-btn' al botón
        btn.className = 'page-btn';
        // Establece el texto del botón con el número de página
        btn.textContent = i;
        // Si es la página actual, agrega la clase 'active' para resaltarla
        if (i === currentPage) btn.classList.add('active');
        // Agrega un listener al click que cambia a esa página
        btn.onclick = () => changePage(i);
        // Agrega el botón al contenedor de páginas
        pagesContainer.appendChild(btn);
    }
}

/**
 * Cambia de página
 * Actualiza la página actual y recarga los restaurantes
 * @param {number} page - Número de página a la cual cambiar
 */
function changePage(page) {
    // Valida que la página sea válida y diferente a la actual
    // Si la página es menor a 1, mayor al total, o igual a la actual, no hace nada
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    // Actualiza la página actual
    currentPage = page;
    // Actualiza la URL y recarga los restaurantes
    updateURLAndReload();
    // Hace scroll suave hacia arriba de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Inicializa la página cuando el DOM está listo
// Verifica si el documento está cargando
if (document.readyState === 'loading') {
    // Si está cargando, espera a que el evento 'DOMContentLoaded' se dispare
    document.addEventListener('DOMContentLoaded', () => {
        // Inicializa la página
        initPage();
        // Configura el filtro de calificación por estrellas
        setupRatingFilter();
    });
} else {
    // Si el DOM ya está listo, ejecuta directamente
    // Inicializa la página
    initPage();
    // Configura el filtro de calificación por estrellas
    setupRatingFilter();
}

/**
 * Obtiene el nombre de categoría del restaurante (mapea categoriaId a nombre)
 * Busca el nombre de la categoría basándose en el ID de categoría del restaurante
 * @param {object} restaurant - Objeto del restaurante
 * @returns {string|null} Nombre de la categoría o null si no se encuentra
 */
function getRestaurantCategoryName(restaurant) {
    // Si el restaurante no existe, retorna null
    if (!restaurant) return null;
    
    // Si el restaurante tiene categoriaId, buscar el nombre en categories
    // Verifica si tiene categoriaId y hay categorías cargadas
    if (restaurant.categoriaId && categories.length > 0) {
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

// Exporta funciones para uso global
// Hace la función handleCategoryChange disponible globalmente a través de window
window.handleCategoryChange = handleCategoryChange;
// Hace la función removeFilter disponible globalmente a través de window
window.removeFilter = removeFilter;
// Hace la función resetFilters disponible globalmente a través de window
window.resetFilters = resetFilters;
// Hace la función loadRestaurants disponible globalmente a través de window
window.loadRestaurants = loadRestaurants;