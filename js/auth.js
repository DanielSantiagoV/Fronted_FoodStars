/**
 * FoodieRank - Authentication Management
 * Handles user authentication and session management
 */

/**
 * Verifica si el usuario está autenticado
 * Comprueba si existe un token y datos de usuario en el almacenamiento local
 * @returns {boolean} True si el usuario está logueado
 */
function isAuthenticated() {
    // Obtiene el token de autenticación del almacenamiento local usando la clave configurada
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    // Obtiene los datos del usuario del almacenamiento local usando la clave configurada
    const user = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    // Retorna true si tanto el token como el usuario existen (convierte a booleano con !!)
    return !!(token && user);
}

/**
 * Obtiene el usuario actual del almacenamiento local
 * Parsea los datos JSON almacenados y retorna el objeto usuario
 * @returns {object|null} Objeto usuario o null si no existe o hay error
 */
function getCurrentUser() {
    try {
        // Obtiene la cadena JSON del usuario desde el almacenamiento local
        const userStr = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        // Si existe la cadena, la parsea a objeto JSON, sino retorna null
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        // Si hay un error al parsear (JSON inválido), lo registra en consola
        console.error('Error parsing user data:', error);
        // Retorna null en caso de error
        return null;
    }
}

/**
 * Verifica si el usuario actual es administrador
 * Comprueba el rol del usuario contra el rol de administrador configurado
 * @returns {boolean} True si el usuario es administrador
 */
function isAdmin() {
    // Obtiene el usuario actual del almacenamiento
    const user = getCurrentUser();
    // Verifica tanto 'role' como 'rol' para compatibilidad con backend
    // Usa optional chaining (?.) y operador OR para buscar el rol
    const userRole = user?.role || user?.rol;
    // Retorna true si existe usuario y su rol es igual al rol de administrador configurado
    return user && userRole === CONFIG.ROLES.ADMIN;
}

/**
 * Guarda los datos de autenticación en el almacenamiento local
 * Normaliza el objeto usuario para asegurar compatibilidad con diferentes formatos
 * @param {string} token - Token JWT de autenticación
 * @param {object} user - Objeto con los datos del usuario
 */
function saveAuthData(token, user) {
    // Normalizar el campo de rol (backend puede usar 'rol', frontend espera 'role')
    // Crea un objeto usuario normalizado con todas las propiedades originales
    const normalizedUser = {
        // Copia todas las propiedades del objeto usuario original usando spread operator
        ...user,
        // Establece 'role' con el valor existente o 'rol' o el rol por defecto de usuario
        role: user.role || user.rol || CONFIG.ROLES.USER,
        // Establece 'rol' con el valor existente o 'role' o el rol por defecto de usuario
        rol: user.rol || user.role || CONFIG.ROLES.USER
    };
    // Guarda el token en el almacenamiento local usando la clave configurada
    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
    // Guarda el usuario normalizado como JSON string en el almacenamiento local
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(normalizedUser));
}

/**
 * Limpia los datos de autenticación del almacenamiento local
 * Elimina el token y los datos del usuario
 */
function clearAuthData() {
    // Elimina el token del almacenamiento local
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    // Elimina los datos del usuario del almacenamiento local
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
}

/**
 * Cierra la sesión del usuario
 * Limpia los datos de autenticación y redirige al inicio
 */
function logout() {
    // Limpia todos los datos de autenticación del almacenamiento local
    clearAuthData();
    // Muestra un mensaje de éxito indicando que la sesión se cerró correctamente
    showToast(CONFIG.MESSAGES.SUCCESS.LOGOUT, 'success');
    
    // Determina la ruta correcta basada en la ubicación actual
    // Obtiene la ruta actual del navegador
    const currentPath = window.location.pathname;
    // Si la ruta incluye '/html/', usa ruta relativa hacia arriba, sino ruta relativa simple
    const redirectUrl = currentPath.includes('/html/') 
        ? '../index.html' 
        : 'index.html';
    
    // Redirige al inicio después de un pequeño retraso
    // Espera 1 segundo (1000ms) antes de redirigir para que el usuario vea el mensaje
    setTimeout(() => {
        // Cambia la URL del navegador para redirigir al usuario
        window.location.href = redirectUrl;
    }, 1000);
}

/**
 * Inicializa la interfaz de usuario de autenticación
 * Muestra u oculta elementos según el estado de autenticación del usuario
 */
function initAuthUI() {
    // Obtiene el elemento del enlace de autenticación en la navegación
    const navAuthLink = document.getElementById('navAuthLink');
    // Obtiene el elemento del menú de usuario
    const userMenu = document.getElementById('userMenu');
    // Obtiene el elemento del enlace de administrador
    const adminLink = document.getElementById('adminLink');
    // Obtiene el elemento donde se muestran las iniciales del usuario
    const userInitials = document.getElementById('userInitials');
    
    // Si el usuario está autenticado
    if (isAuthenticated()) {
        // Obtiene los datos del usuario actual
        const user = getCurrentUser();
        
        // Oculta el enlace de autenticación si existe
        if (navAuthLink) {
            // Oculta el enlace estableciendo display a 'none'
            navAuthLink.style.display = 'none';
        }
        
        // Muestra el menú de usuario si existe
        if (userMenu) {
            // Muestra el menú estableciendo display a 'block'
            userMenu.style.display = 'block';
            
            // Establece las iniciales del usuario si el elemento existe
            if (userInitials && user) {
                // Calcula las iniciales: si tiene nombre, toma primera letra de cada palabra
                // Si no tiene nombre, usa la primera letra del email, sino usa 'U'
                const initials = user.nombre 
                    // Divide el nombre por espacios, toma primera letra de cada palabra, junta y convierte a mayúsculas
                    ? user.nombre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                    // Si tiene email, toma la primera letra y la convierte a mayúscula
                    : user.email ? user.email[0].toUpperCase() : 'U';
                // Establece el texto del elemento con las iniciales calculadas
                userInitials.textContent = initials;
            }
        }
        
        // Muestra el enlace de administrador si el usuario es admin
        if (adminLink && isAdmin()) {
            // Muestra el enlace estableciendo display a 'block'
            adminLink.style.display = 'block';
        }
        
        // Actualiza los botones CTA (call-to-action) para usuarios autenticados
        // Obtiene el botón de autenticación del CTA
        const ctaAuthBtn = document.getElementById('ctaAuthBtn');
        // Obtiene el botón de autenticación del hero
        const heroAuthBtn = document.getElementById('heroAuthBtn');
        
        // Si existe el botón CTA, cambia su texto y enlace
        if (ctaAuthBtn) {
            // Cambia el texto del botón a 'Ver Mi Perfil'
            ctaAuthBtn.textContent = 'Ver Mi Perfil';
            // Cambia el enlace del botón a '#profile'
            ctaAuthBtn.href = '#profile';
        }
        
        // Si existe el botón del hero, lo oculta
        if (heroAuthBtn) {
            // Oculta el botón estableciendo display a 'none'
            heroAuthBtn.style.display = 'none';
        }
        
    } else {
        // Si el usuario NO está autenticado
        // Muestra el enlace de autenticación si existe
        if (navAuthLink) {
            // Muestra el enlace estableciendo display a 'block'
            navAuthLink.style.display = 'block';
        }
        
        // Oculta el menú de usuario si existe
        if (userMenu) {
            // Oculta el menú estableciendo display a 'none'
            userMenu.style.display = 'none';
        }
        
        // Oculta el enlace de administrador si existe
        if (adminLink) {
            // Oculta el enlace estableciendo display a 'none'
            adminLink.style.display = 'none';
        }
    }
}

/**
 * Requiere autenticación - redirige si el usuario no está logueado
 * Verifica si el usuario está autenticado, si no, muestra mensaje y redirige a login
 * @param {string} redirectUrl - URL a la cual redirigir después del login
 * @returns {boolean} False si no está autenticado, true si lo está
 */
function requireAuth(redirectUrl = null) {
    // Verifica si el usuario NO está autenticado
    if (!isAuthenticated()) {
        // Obtiene la URL actual o usa la proporcionada como parámetro
        const currentUrl = redirectUrl || window.location.pathname;
        // Muestra un mensaje de advertencia indicando que debe iniciar sesión
        showToast('Debes iniciar sesión para acceder a esta página', 'warning');
        
        // Determina la ruta correcta a auth.html basada en la ubicación actual
        // Obtiene la ruta actual del navegador
        const currentPath = window.location.pathname;
        // Si la ruta incluye '/html/', usa ruta relativa, sino usa ruta con subdirectorio
        const authUrl = currentPath.includes('/html/') 
            ? './auth.html' 
            : 'html/auth.html';
        
        // Espera 1.5 segundos antes de redirigir
        setTimeout(() => {
            // Redirige a la página de autenticación con la URL actual como parámetro redirect
            // encodeURIComponent codifica la URL para que pueda ser usada como parámetro de consulta
            window.location.href = `${authUrl}?redirect=${encodeURIComponent(currentUrl)}`;
        }, 1500);
        
        // Retorna false indicando que no está autenticado
        return false;
    }
    // Retorna true indicando que está autenticado
    return true;
}

/**
 * Requiere permisos de administrador - redirige si no es admin
 * Verifica primero si está autenticado, luego si es admin
 * @returns {boolean} False si no es admin, true si lo es
 */
function requireAdmin() {
    // Verifica si el usuario NO está autenticado
    if (!isAuthenticated()) {
        // Si no está autenticado, llama a requireAuth para redirigir al login
        requireAuth();
        // Retorna false indicando que no tiene permisos
        return false;
    }
    
    // Verifica si el usuario NO es administrador
    if (!isAdmin()) {
        // Muestra un mensaje de error indicando que no tiene permisos
        showToast('No tienes permisos para acceder a esta página', 'error');
        
        // Determina la ruta correcta basada en la ubicación actual
        // Obtiene la ruta actual del navegador
        const currentPath = window.location.pathname;
        // Si la ruta incluye '/html/', usa ruta relativa hacia arriba, sino ruta relativa simple
        const redirectUrl = currentPath.includes('/html/') 
            ? '../index.html' 
            : 'index.html';
        
        // Espera 1.5 segundos antes de redirigir
        setTimeout(() => {
            // Redirige al inicio
            window.location.href = redirectUrl;
        }, 1500);
        // Retorna false indicando que no es administrador
        return false;
    }
    
    // Retorna true indicando que es administrador
    return true;
}

/**
 * Maneja el proceso de inicio de sesión
 * Realiza la petición al servidor, guarda los datos y redirige
 * @param {object} credentials - Credenciales de login (email y password)
 */
async function handleLogin(credentials) {
    try {
        // Realiza una petición de login al servidor usando la API
        const response = await api.login(credentials);
        
        // Verifica si la respuesta fue exitosa y tiene datos
        if (response.success && response.data) {
            // Backend retorna { usuario, token } - ajustar para compatibilidad
            // Obtiene el usuario de la respuesta (puede venir como 'usuario' o 'user')
            const user = response.data.usuario || response.data.user;
            // Obtiene el token de la respuesta
            const token = response.data.token;
            
            // Verifica que tanto el usuario como el token existan
            if (!user || !token) {
                // Si faltan datos, lanza un error
                throw new Error('Datos de autenticación incompletos');
            }
            
            // Guarda los datos de autenticación en el almacenamiento local
            saveAuthData(token, user);
            
            // Muestra un mensaje de éxito indicando que el login fue exitoso
            showToast(CONFIG.MESSAGES.SUCCESS.LOGIN, 'success');
            
            // Verifica si hay un parámetro de redirección en la URL
            // Obtiene todos los parámetros de la URL actual
            const params = getQueryParams();
            // Obtiene el parámetro 'redirect' si existe
            let redirectUrl = params.redirect;
            
            // Si no hay parámetro de redirección, va a index.html
            if (!redirectUrl) {
                // Determina la ruta correcta basada en la ubicación actual
                // Obtiene la ruta actual del navegador
                const currentPath = window.location.pathname;
                // Si la ruta incluye '/html/', usa ruta relativa hacia arriba, sino ruta relativa simple
                if (currentPath.includes('/html/')) {
                    redirectUrl = '../index.html';
                } else {
                    redirectUrl = 'index.html';
                }
            }
            
            // Redirige después de un pequeño retraso
            // Espera 1 segundo (1000ms) antes de redirigir para que el usuario vea el mensaje
            setTimeout(() => {
                // Cambia la URL del navegador para redirigir al usuario
                window.location.href = redirectUrl;
            }, 1000);
        } else {
            // Si la respuesta no fue exitosa, lanza un error con el mensaje del servidor o mensaje por defecto
            throw new Error(response.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        // Si hay cualquier error durante el proceso, lo registra en consola
        console.error('Login error:', error);
        // Relanza el error para que pueda ser manejado por el código que llamó a esta función
        throw error;
    }
}

/**
 * Maneja el proceso de registro de nuevo usuario
 * Realiza la petición al servidor, guarda los datos y redirige
 * @param {object} userData - Datos del nuevo usuario (nombre, email, password, etc.)
 */
async function handleRegister(userData) {
    try {
        // Realiza una petición de registro al servidor usando la API
        const response = await api.register(userData);
        
        // Verifica si la respuesta fue exitosa y tiene datos
        if (response.success && response.data) {
            // Backend retorna { usuario, token } - ajustar para compatibilidad
            // Obtiene el usuario de la respuesta (puede venir como 'usuario' o 'user')
            const user = response.data.usuario || response.data.user;
            // Obtiene el token de la respuesta
            const token = response.data.token;
            
            // Verifica que tanto el usuario como el token existan
            if (!user || !token) {
                // Si faltan datos, lanza un error
                throw new Error('Datos de registro incompletos');
            }
            
            // Guarda los datos de autenticación en el almacenamiento local
            saveAuthData(token, user);
            
            // Muestra un mensaje de éxito indicando que el registro fue exitoso
            showToast(CONFIG.MESSAGES.SUCCESS.REGISTER, 'success');
            
            // Determina la ruta correcta basada en la ubicación actual
            // Obtiene la ruta actual del navegador
            const currentPath = window.location.pathname;
            // Si la ruta incluye '/html/', usa ruta relativa hacia arriba, sino ruta relativa simple
            const redirectUrl = currentPath.includes('/html/') 
                ? '../index.html' 
                : 'index.html';
            
            // Redirige después de un pequeño retraso
            // Espera 1 segundo (1000ms) antes de redirigir para que el usuario vea el mensaje
            setTimeout(() => {
                // Cambia la URL del navegador para redirigir al usuario
                window.location.href = redirectUrl;
            }, 1000);
        } else {
            // Si la respuesta no fue exitosa, lanza un error con el mensaje del servidor o mensaje por defecto
            throw new Error(response.message || 'Error al registrarse');
        }
    } catch (error) {
        // Si hay cualquier error durante el proceso, lo registra en consola
        console.error('Registration error:', error);
        // Relanza el error para que pueda ser manejado por el código que llamó a esta función
        throw error;
    }
}

/**
 * Valida el token de autenticación
 * Realiza una petición al servidor para verificar que el token sea válido
 * @returns {Promise<boolean>} True si el token es válido, false si no lo es
 */
async function validateToken() {
    // Verifica si el usuario está autenticado (tiene token y usuario en localStorage)
    if (!isAuthenticated()) {
        // Si no está autenticado, retorna false
        return false;
    }
    
    try {
        // Intenta obtener el perfil del usuario para validar el token
        // Realiza una petición al endpoint de perfil que requiere autenticación
        const response = await api.getProfile();
        
        // Verifica si la respuesta fue exitosa
        if (response.success) {
            // Actualiza los datos del usuario en el almacenamiento
            // Obtiene el usuario actual
            const user = getCurrentUser();
            // Si existe usuario, actualiza sus datos con la respuesta del servidor
            if (user) {
                // Obtiene el token actual y guarda el usuario actualizado
                saveAuthData(localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN), response.data);
            }
            // Retorna true indicando que el token es válido
            return true;
        } else {
            // Si la respuesta no fue exitosa, el token es inválido, limpia la autenticación
            clearAuthData();
            // Retorna false indicando que el token es inválido
            return false;
        }
    } catch (error) {
        // Token inválido o error de red
        // Verifica si el error es por falta de autorización (401)
        if (error.message.includes('401') || error.message.includes('authorization')) {
            // Si es error de autorización, limpia la autenticación
            clearAuthData();
        }
        // Retorna false indicando que hubo un error
        return false;
    }
}

/**
 * Verificación automática de login al cargar la página
 * Valida el token al cargar la página para asegurar que la sesión sigue válida
 */
async function autoLoginCheck() {
    // Verifica si el usuario está autenticado
    if (isAuthenticated()) {
        // Valida el token con el servidor
        const isValid = await validateToken();
        // Si el token no es válido y no estamos en la página de autenticación
        if (!isValid && window.location.pathname !== '/auth.html') {
            // Muestra un mensaje de advertencia indicando que la sesión expiró
            showToast('Tu sesión ha expirado', 'warning');
        }
    }
}

/**
 * Obtiene el nombre de visualización del usuario
 * Retorna el nombre, username o email del usuario, o 'Usuario' por defecto
 * @returns {string} Nombre de visualización del usuario
 */
function getUserDisplayName() {
    // Obtiene el usuario actual del almacenamiento
    const user = getCurrentUser();
    // Si no existe usuario, retorna 'Usuario' por defecto
    if (!user) return 'Usuario';
    
    // Retorna el nombre, username o email, o 'Usuario' si ninguno existe
    return user.nombre || user.username || user.email || 'Usuario';
}

/**
 * Actualiza el usuario en el almacenamiento
 * Guarda los datos actualizados del usuario y refresca la UI
 * @param {object} updatedUser - Objeto con los datos actualizados del usuario
 */
function updateStoredUser(updatedUser) {
    // Obtiene el token actual del almacenamiento
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    // Si existe token y usuario actualizado, guarda los datos
    if (token && updatedUser) {
        // Guarda el token y el usuario actualizado
        saveAuthData(token, updatedUser);
        // Refresca la interfaz de usuario para reflejar los cambios
        initAuthUI(); // Refresh UI
    }
}

// Inicializa la UI de autenticación cuando el DOM está listo
// Verifica si el documento está cargando
if (document.readyState === 'loading') {
    // Si está cargando, espera a que el evento DOMContentLoaded se dispare
    document.addEventListener('DOMContentLoaded', () => {
        // Inicializa la interfaz de usuario de autenticación
        initAuthUI();
        // Realiza la verificación automática de login
        autoLoginCheck();
    });
} else {
    // Si el DOM ya está listo, ejecuta directamente
    // Inicializa la interfaz de usuario de autenticación
    initAuthUI();
    // Realiza la verificación automática de login
    autoLoginCheck();
}

// Maneja el toggle del menú para dispositivos móviles
// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene el botón de toggle del menú
    const menuToggle = document.getElementById('menuToggle');
    // Obtiene el contenedor de los enlaces de navegación
    const navLinks = document.getElementById('navLinks');
    
    // Si ambos elementos existen
    if (menuToggle && navLinks) {
        // Agrega un listener al evento click del botón de toggle
        menuToggle.addEventListener('click', () => {
            // Alterna la clase 'active' en el contenedor de enlaces (muestra/oculta)
            navLinks.classList.toggle('active');
            // Alterna la clase 'active' en el botón de toggle (cambia el icono)
            menuToggle.classList.toggle('active');
        });
        
        // Cierra el menú cuando se hace click fuera de él
        // Agrega un listener al evento click del documento completo
        document.addEventListener('click', (e) => {
            // Si el click NO fue dentro del botón toggle ni dentro de los enlaces de navegación
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                // Remueve la clase 'active' del contenedor de enlaces (oculta el menú)
                navLinks.classList.remove('active');
                // Remueve la clase 'active' del botón toggle (restaura el icono)
                menuToggle.classList.remove('active');
            }
        });
        
        // Cierra el menú cuando se hace click en un enlace
        // Obtiene todos los enlaces dentro del contenedor de navegación
        navLinks.querySelectorAll('a').forEach(link => {
            // Agrega un listener a cada enlace
            link.addEventListener('click', () => {
                // Remueve la clase 'active' del contenedor de enlaces (oculta el menú)
                navLinks.classList.remove('active');
                // Remueve la clase 'active' del botón toggle (restaura el icono)
                menuToggle.classList.remove('active');
            });
        });
    }
});
