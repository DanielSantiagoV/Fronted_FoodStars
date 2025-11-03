/**
 * FoodieRank - Index Page Logic
 * Main page functionality
 */

// Estado de la página - Variables globales para almacenar datos
// Page state
// Array que almacena todas las categorías cargadas
let categories = [];
// Array que almacena todos los restaurantes cargados
let restaurants = [];

/**
 * Carga y muestra las categorías desde el servidor
 * Realiza una petición al API y actualiza el DOM con las categorías
 */
async function loadCategories() {
    // Obtiene el elemento del DOM donde se mostrarán las categorías
    const grid = document.getElementById('categoryGrid');
    // Si el elemento no existe, termina la ejecución
    if (!grid) return;
    
    // Muestra estado de carga
    // Actualiza el HTML del contenedor con un spinner y mensaje de carga
    grid.innerHTML = `
        <div class="loading-state">
            <div class="loader"></div>
            <p>Cargando categorías...</p>
        </div>
    `;
    
    try {
        // Realiza una petición al API para obtener las categorías
        const response = await api.getCategories();
        
        // Verifica si la respuesta fue exitosa y tiene datos
        if (response.success && response.data) {
            // Guarda las categorías en la variable global
            categories = response.data;
            // Llama a la función para mostrar las categorías en el grid
            displayCategories(categories);
        } else {
            // Si la respuesta no fue exitosa, lanza un error
            throw new Error('Error al cargar categorías');
        }
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading categories:', error);
        // Actualiza el HTML del contenedor con un mensaje de error y botón de reintentar
        grid.innerHTML = `
            <div class="loading-state">
                <p style="color: var(--danger);">❌ Error al cargar categorías</p>
                <button class="btn-primary" onclick="loadCategories()">Reintentar</button>
            </div>
        `;
    }
}

/**
 * Muestra las categorías en el grid
 * Crea elementos DOM para cada categoría y los agrega al grid
 * @param {array} categoriesToDisplay - Categorías a mostrar
 */
function displayCategories(categoriesToDisplay) {
    // Obtiene el elemento del DOM donde se mostrarán las categorías
    const grid = document.getElementById('categoryGrid');
    // Si el elemento no existe, termina la ejecución
    if (!grid) return;
    
    // Verifica si hay categorías para mostrar
    if (!categoriesToDisplay || categoriesToDisplay.length === 0) {
        // Si no hay categorías, muestra un mensaje indicando que no hay categorías disponibles
        grid.innerHTML = `
            <div class="loading-state">
                <p style="color: var(--gray-600);">No hay categorías disponibles</p>
            </div>
        `;
        // Termina la ejecución
        return;
    }
    
    // Limpia el contenido previo del grid
    grid.innerHTML = '';
    
    // Itera sobre cada categoría para crear su tarjeta
    categoriesToDisplay.forEach(category => {
        // Obtiene el icono correspondiente a la categoría usando su nombre
        const icon = getCategoryIcon(category.nombre);
        
        // Crea un elemento div para la tarjeta de categoría
        const card = document.createElement('div');
        // Asigna la clase CSS 'category-card' a la tarjeta
        card.className = 'category-card';
        // Agrega un listener al evento click que navega a la página de la categoría
        card.onclick = () => navigateToCategory(category.nombre);
        
        // Establece el HTML interno de la tarjeta con el icono, nombre y descripción
        card.innerHTML = `
            <span class="category-icon">${icon}</span>
            <h3>${category.nombre}</h3>
            <p>${category.descripcion || 'Explora esta categoría'}</p>
        `;
        
        // Agrega la tarjeta al grid del DOM
        grid.appendChild(card);
    });
}

/**
 * Navega a la página de categoría
 * Redirige a la página de restaurantes filtrada por categoría
 * @param {string} categoryName - Nombre de la categoría
 */
function navigateToCategory(categoryName) {
    // Cambia la URL del navegador para ir a la página de restaurantes con filtro de categoría
    // encodeURIComponent codifica el nombre para que pueda usarse en una URL
    window.location.href = `./html/restaurants.html?category=${encodeURIComponent(categoryName)}`;
}

/**
 * Obtiene el nombre de categoría del restaurante (mapea categoriaId a nombre)
 * Busca el nombre de la categoría basándose en el ID de categoría del restaurante
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

/**
 * Carga y muestra los restaurantes destacados
 * Realiza una petición al API y actualiza el DOM con los restaurantes
 */
async function loadRestaurants() {
    // Obtiene el elemento del DOM donde se mostrarán los restaurantes
    const grid = document.getElementById('restaurantGrid');
    // Si el elemento no existe, termina la ejecución
    if (!grid) return;
    
    // Muestra estado de carga
    // Actualiza el HTML del contenedor con un spinner y mensaje de carga
    grid.innerHTML = `
        <div class="loading-state">
            <div class="loader"></div>
            <p>Cargando restaurantes...</p>
        </div>
    `;
    
    try {
        // Realiza una petición al API para obtener los restaurantes
        // Backend usa 'limite' no 'limit'
        const response = await api.getRestaurants({
            limite: 6,  // Backend usa 'limite' no 'limit'
            // Ordena por ranking
            ordenarPor: 'ranking',
            // Orden descendente (mayor ranking primero)
            orden: 'desc' // Sort by ranking descending
        });
        
        // Verifica si la respuesta fue exitosa y tiene datos
        if (response.success && response.data) {
            // Guarda los restaurantes en la variable global
            restaurants = response.data;
            // Llama a la función para mostrar los restaurantes en el grid
            displayRestaurants(restaurants);
        } else {
            // Si la respuesta no fue exitosa, lanza un error
            throw new Error('Error al cargar restaurantes');
        }
    } catch (error) {
        // Si hay un error durante la carga
        // Registra el error en la consola para depuración
        console.error('Error loading restaurants:', error);
        // Actualiza el HTML del contenedor con un mensaje de error y botón de reintentar
        grid.innerHTML = `
            <div class="loading-state">
                <p style="color: var(--danger);">❌ Error al cargar restaurantes</p>
                <button class="btn-primary" onclick="loadRestaurants()">Reintentar</button>
            </div>
        `;
    }
}

/**
 * Muestra los restaurantes en el grid
 * Itera sobre los restaurantes y crea tarjetas para cada uno
 * @param {array} restaurantsToDisplay - Restaurantes a mostrar
 */
function displayRestaurants(restaurantsToDisplay) {
    // Obtiene el elemento del DOM donde se mostrarán los restaurantes
    const grid = document.getElementById('restaurantGrid');
    // Si el elemento no existe, termina la ejecución
    if (!grid) return;
    
    // Verifica si hay restaurantes para mostrar
    if (!restaurantsToDisplay || restaurantsToDisplay.length === 0) {
        // Si no hay restaurantes, muestra un mensaje indicando que no hay restaurantes disponibles
        grid.innerHTML = `
            <div class="loading-state">
                <p style="color: var(--gray-600);">No hay restaurantes disponibles</p>
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
 * Genera el HTML y configura los event listeners para la tarjeta
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
    window.location.href = `./html/restaurant-detail.html?id=${restaurantId}`;
}

/**
 * Busca restaurantes
 * Obtiene el término de búsqueda y redirige a la página de resultados
 */
function searchRestaurants() {
    // Obtiene el elemento del input de búsqueda
    const searchInput = document.getElementById('searchInput');
    // Si el elemento no existe, termina la ejecución
    if (!searchInput) return;
    
    // Obtiene el valor del input y elimina espacios en blanco al inicio y final
    const query = searchInput.value.trim();
    
    // Si hay un término de búsqueda
    if (query) {
        // Redirige a la página de restaurantes con el término de búsqueda como parámetro
        // encodeURIComponent codifica el término para que pueda usarse en una URL
        window.location.href = `restaurants.html?search=${encodeURIComponent(query)}`;
    } else {
        // Si no hay término de búsqueda, muestra un mensaje de advertencia
        showToast('Por favor ingresa un término de búsqueda', 'warning');
    }
}
/**
 * Busca por etiqueta
 * Redirige a la página de restaurantes con una búsqueda por etiqueta
 * @param {string} tag - Etiqueta por la cual buscar
 */
function searchTag(tag) {
    // Cambia la URL del navegador para ir a la página de restaurantes con la etiqueta como búsqueda
    // encodeURIComponent codifica la etiqueta para que pueda usarse en una URL
    window.location.href = `./html/restaurants.html?search=${encodeURIComponent(tag)}`;
}

/**
 * Carga las estadísticas (datos simulados por ahora)
 * Muestra estadísticas animadas en la página principal
 */
async function loadStatistics() {
    // Obtiene los elementos del DOM donde se mostrarán las estadísticas
    const statsRestaurants = document.getElementById('statsRestaurants');
    const statsReviews = document.getElementById('statsReviews');
    const statsUsers = document.getElementById('statsUsers');
    
    try {
        // Intenta obtener estadísticas reales del API si el endpoint existe
        // Por ahora, usa datos simulados con animación
        // Anima el número de restaurantes de 0 a 1234 en 2 segundos
        animateNumber(statsRestaurants, 0, 1234, 2000);
        // Anima el número de reseñas de 0 a 15678 en 2 segundos
        animateNumber(statsReviews, 0, 15678, 2000);
        // Anima el número de usuarios de 0 a 8945 en 2 segundos
        animateNumber(statsUsers, 0, 8945, 2000);
    } catch (error) {
        // Si hay un error al cargar las estadísticas
        // Registra el error en la consola para depuración
        console.error('Error loading stats:', error);
        // Mantiene los valores por defecto (ya mostrados en el HTML)
    }
}

/**
 * Anima el conteo de un número
 * Incrementa el valor del elemento desde start hasta end con animación
 * @param {HTMLElement} element - Elemento a animar
 * @param {number} start - Valor inicial
 * @param {number} end - Valor final
 * @param {number} duration - Duración de la animación en milisegundos
 */
function animateNumber(element, start, end, duration) {
    // Si el elemento no existe, termina la ejecución
    if (!element) return;
    
    // Calcula el rango de valores a animar
    const range = end - start;
    // Calcula el incremento por frame para lograr 60fps (duración/16ms por frame)
    const increment = range / (duration / 16); // 60fps
    // Inicializa el valor actual en el valor de inicio
    let current = start;
    
    // Crea un intervalo que se ejecuta cada 16ms (aproximadamente 60 veces por segundo)
    const timer = setInterval(() => {
        // Incrementa el valor actual
        current += increment;
        // Si el valor actual alcanzó o superó el valor final
        if (current >= end) {
            // Establece el texto del elemento al valor final formateado con '+'
            element.textContent = formatNumber(end) + '+';
            // Detiene el intervalo
            clearInterval(timer);
        } else {
            // Si aún no alcanzó el valor final
            // Establece el texto del elemento al valor actual (redondeado hacia abajo) formateado con '+'
            element.textContent = formatNumber(Math.floor(current)) + '+';
        }
    }, 16);
}

/**
 * Configura el manejador de tecla Enter en el campo de búsqueda
 * Permite buscar presionando Enter además de hacer click en el botón
 */
function setupSearchHandler() {
    // Obtiene el elemento del input de búsqueda
    const searchInput = document.getElementById('searchInput');
    // Si el elemento existe
    if (searchInput) {
        // Agrega un listener al evento 'keypress' del input
        searchInput.addEventListener('keypress', (e) => {
            // Si la tecla presionada es Enter
            if (e.key === 'Enter') {
                // Ejecuta la función de búsqueda
                searchRestaurants();
            }
        });
    }
}

/**
 * Carga las categorías en el footer
 * Muestra las primeras 4 categorías como enlaces en el footer
 */
function loadFooterCategories() {
    // Obtiene el elemento del DOM donde se mostrarán las categorías del footer
    const footerCategories = document.getElementById('footerCategories');
    // Si el elemento no existe o no hay categorías cargadas, termina la ejecución
    if (!footerCategories || categories.length === 0) return;
    
    // Toma las primeras 4 categorías
    const topCategories = categories.slice(0, 4);
    
    // Actualiza el HTML del footer con enlaces a las categorías
    footerCategories.innerHTML = topCategories.map(category => `
        <li>
            <a href="restaurants.html?category=${encodeURIComponent(category.nombre)}">
                ${category.nombre}
            </a>
        </li>
    `).join('');
}

/**
 * Inicializa la página
 * Carga todos los datos necesarios y configura los event listeners
 */
async function initPage() {
    try {
        // Carga todos los datos
        // Usa Promise.all para cargar categorías, restaurantes y estadísticas en paralelo
        await Promise.all([
            loadCategories(),
            loadRestaurants(),
            loadStatistics()
        ]);
        
        // Configura los manejadores
        // Configura el manejador de búsqueda
        setupSearchHandler();
        
        // Carga el footer después de que las categorías estén cargadas
        // Espera 500ms para asegurar que las categorías estén disponibles
        setTimeout(loadFooterCategories, 500);
        
    } catch (error) {
        // Si hay un error durante la inicialización
        // Registra el error en la consola para depuración
        console.error('Error initializing page:', error);
        // Muestra un mensaje de error al usuario
        showToast('Error al cargar la página', 'error');
    }
}

/**
 * Configura el observador de intersección para animaciones
 * Detecta cuando los elementos entran en el viewport y los anima
 */
function setupScrollAnimations() {
    // Configuración del observador de intersección
    const observerOptions = {
        // Umbral: 10% del elemento debe ser visible
        threshold: 0.1,
        // Margen: -50px desde abajo para activar la animación antes de que el elemento esté completamente visible
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Crea un observador de intersección con la configuración y callback
    const observer = new IntersectionObserver((entries) => {
        // Itera sobre cada entrada (elemento observado)
        entries.forEach(entry => {
            // Si el elemento está intersectando (es visible)
            if (entry.isIntersecting) {
                // Hace el elemento completamente opaco
                entry.target.style.opacity = '1';
                // Mueve el elemento a su posición final (sin traslación)
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observa todas las tarjetas
    // Selecciona todas las tarjetas (categorías, restaurantes, features) y las configura
    document.querySelectorAll('.category-card, .restaurant-card, .feature-card').forEach(card => {
        // Establece la opacidad inicial en 0 (invisible)
        card.style.opacity = '0';
        // Establece la posición inicial 30px hacia abajo
        card.style.transform = 'translateY(30px)';
        // Establece la transición para animar los cambios suavemente
        card.style.transition = 'all 0.6s ease';
        // Comienza a observar el elemento para detectar cuando entra en el viewport
        observer.observe(card);
    });
}

/**
 * Maneja los botones CTA del hero según el estado de autenticación
 * Actualiza el texto y enlace del botón si el usuario está autenticado
 */
function updateHeroCTA() {
    // Verifica si el usuario está autenticado
    if (isAuthenticated()) {
        // Obtiene el botón de autenticación del hero
        const heroAuthBtn = document.querySelector('.hero .btn-secondary');
        // Si el botón existe
        if (heroAuthBtn) {
            // Cambia el texto del botón a 'Mi Perfil'
            heroAuthBtn.textContent = 'Mi Perfil';
            // Cambia el enlace del botón a '#profile'
            heroAuthBtn.href = '#profile';
        }
    }
}

// Inicializa cuando el DOM está listo
// Verifica si el documento está cargando
if (document.readyState === 'loading') {
    // Si está cargando, espera a que el evento 'DOMContentLoaded' se dispare
    document.addEventListener('DOMContentLoaded', () => {
        // Inicializa la página
        initPage();
        // Configura las animaciones de scroll después de 100ms
        setTimeout(setupScrollAnimations, 100);
        // Actualiza los botones CTA del hero
        updateHeroCTA();
    });
} else {
    // Si el DOM ya está listo, ejecuta directamente
    // Inicializa la página
    initPage();
    // Configura las animaciones de scroll después de 100ms
    setTimeout(setupScrollAnimations, 100);
    // Actualiza los botones CTA del hero
    updateHeroCTA();
}

// Exporta funciones para uso global
// Hace la función searchRestaurants disponible globalmente a través de window
window.searchRestaurants = searchRestaurants;
// Hace la función searchTag disponible globalmente a través de window
window.searchTag = searchTag;
// Hace la función loadCategories disponible globalmente a través de window
window.loadCategories = loadCategories;
// Hace la función loadRestaurants disponible globalmente a través de window
window.loadRestaurants = loadRestaurants;
