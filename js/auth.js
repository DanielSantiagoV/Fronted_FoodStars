/**
 * FoodieRank - Authentication Management
 * Handles user authentication and session management
 */

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
function isAuthenticated() {
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    const user = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    return !!(token && user);
}

/**
 * Get current user
 * @returns {object|null} User object or null
 */
function getCurrentUser() {
    try {
        const userStr = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

/**
 * Check if current user is admin
 * @returns {boolean} True if user is admin
 */
function isAdmin() {
    const user = getCurrentUser();
    // Verificar tanto 'role' como 'rol' para compatibilidad con backend
    const userRole = user?.role || user?.rol;
    return user && userRole === CONFIG.ROLES.ADMIN;
}

/**
 * Save authentication data
 * @param {string} token - JWT token
 * @param {object} user - User object
 */
function saveAuthData(token, user) {
    // Normalizar el campo de rol (backend puede usar 'rol', frontend espera 'role')
    const normalizedUser = {
        ...user,
        role: user.role || user.rol || CONFIG.ROLES.USER,
        rol: user.rol || user.role || CONFIG.ROLES.USER
    };
    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(normalizedUser));
}

/**
 * Clear authentication data
 */
function clearAuthData() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
}

/**
 * Logout user
 */
function logout() {
    clearAuthData();
    showToast(CONFIG.MESSAGES.SUCCESS.LOGOUT, 'success');
    
    // Determine correct path based on current location
    const currentPath = window.location.pathname;
    const redirectUrl = currentPath.includes('/html/') 
        ? '../index.html' 
        : 'index.html';
    
    // Redirect to home after a short delay
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 1000);
}

/**
 * Initialize authentication UI
 */
function initAuthUI() {
    const navAuthLink = document.getElementById('navAuthLink');
    const userMenu = document.getElementById('userMenu');
    const adminLink = document.getElementById('adminLink');
    const userInitials = document.getElementById('userInitials');
    
    if (isAuthenticated()) {
        const user = getCurrentUser();
        
        // Hide auth link
        if (navAuthLink) {
            navAuthLink.style.display = 'none';
        }
        
        // Show user menu
        if (userMenu) {
            userMenu.style.display = 'block';
            
            // Set user initials
            if (userInitials && user) {
                const initials = user.nombre 
                    ? user.nombre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                    : user.email ? user.email[0].toUpperCase() : 'U';
                userInitials.textContent = initials;
            }
        }
        
        // Show admin link if user is admin
        if (adminLink && isAdmin()) {
            adminLink.style.display = 'block';
        }
        
        // Update CTA buttons for authenticated users
        const ctaAuthBtn = document.getElementById('ctaAuthBtn');
        const heroAuthBtn = document.getElementById('heroAuthBtn');
        
        if (ctaAuthBtn) {
            ctaAuthBtn.textContent = 'Ver Mi Perfil';
            ctaAuthBtn.href = '#profile';
        }
        
        if (heroAuthBtn) {
            heroAuthBtn.style.display = 'none';
        }
        
    } else {
        // Show auth link
        if (navAuthLink) {
            navAuthLink.style.display = 'block';
        }
        
        // Hide user menu
        if (userMenu) {
            userMenu.style.display = 'none';
        }
        
        // Hide admin link
        if (adminLink) {
            adminLink.style.display = 'none';
        }
    }
}

/**
 * Require authentication - redirect if not logged in
 * @param {string} redirectUrl - URL to redirect to after login
 */
function requireAuth(redirectUrl = null) {
    if (!isAuthenticated()) {
        const currentUrl = redirectUrl || window.location.pathname;
        showToast('Debes iniciar sesión para acceder a esta página', 'warning');
        
        // Determine correct path to auth.html based on current location
        const currentPath = window.location.pathname;
        const authUrl = currentPath.includes('/html/') 
            ? './auth.html' 
            : 'html/auth.html';
        
        setTimeout(() => {
            window.location.href = `${authUrl}?redirect=${encodeURIComponent(currentUrl)}`;
        }, 1500);
        
        return false;
    }
    return true;
}

/**
 * Require admin - redirect if not admin
 */
function requireAdmin() {
    if (!isAuthenticated()) {
        requireAuth();
        return false;
    }
    
    if (!isAdmin()) {
        showToast('No tienes permisos para acceder a esta página', 'error');
        
        // Determine correct path based on current location
        const currentPath = window.location.pathname;
        const redirectUrl = currentPath.includes('/html/') 
            ? '../index.html' 
            : 'index.html';
        
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1500);
        return false;
    }
    
    return true;
}

/**
 * Handle login
 * @param {object} credentials - Login credentials
 */
async function handleLogin(credentials) {
    try {
        const response = await api.login(credentials);
        
        if (response.success && response.data) {
            // Backend retorna { usuario, token } - ajustar para compatibilidad
            const user = response.data.usuario || response.data.user;
            const token = response.data.token;
            
            if (!user || !token) {
                throw new Error('Datos de autenticación incompletos');
            }
            
            // Save auth data
            saveAuthData(token, user);
            
            showToast(CONFIG.MESSAGES.SUCCESS.LOGIN, 'success');
            
            // Check for redirect parameter
            const params = getQueryParams();
            let redirectUrl = params.redirect;
            
            // If no redirect param, go to index.html
            if (!redirectUrl) {
                // Determine correct path based on current location
                const currentPath = window.location.pathname;
                if (currentPath.includes('/html/')) {
                    redirectUrl = '../index.html';
                } else {
                    redirectUrl = 'index.html';
                }
            }
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
        } else {
            throw new Error(response.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

/**
 * Handle registration
 * @param {object} userData - Registration data
 */
async function handleRegister(userData) {
    try {
        const response = await api.register(userData);
        
        if (response.success && response.data) {
            // Backend retorna { usuario, token } - ajustar para compatibilidad
            const user = response.data.usuario || response.data.user;
            const token = response.data.token;
            
            if (!user || !token) {
                throw new Error('Datos de registro incompletos');
            }
            
            // Save auth data
            saveAuthData(token, user);
            
            showToast(CONFIG.MESSAGES.SUCCESS.REGISTER, 'success');
            
            // Determine correct path based on current location
            const currentPath = window.location.pathname;
            const redirectUrl = currentPath.includes('/html/') 
                ? '../index.html' 
                : 'index.html';
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
        } else {
            throw new Error(response.message || 'Error al registrarse');
        }
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

/**
 * Validate authentication token
 */
async function validateToken() {
    if (!isAuthenticated()) {
        return false;
    }
    
    try {
        // Try to get profile to validate token
        const response = await api.getProfile();
        
        if (response.success) {
            // Update user data in storage
            const user = getCurrentUser();
            if (user) {
                saveAuthData(localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN), response.data);
            }
            return true;
        } else {
            // Token invalid, clear auth
            clearAuthData();
            return false;
        }
    } catch (error) {
        // Token invalid or network error
        if (error.message.includes('401') || error.message.includes('authorization')) {
            clearAuthData();
        }
        return false;
    }
}

/**
 * Auto-login check on page load
 */
async function autoLoginCheck() {
    if (isAuthenticated()) {
        const isValid = await validateToken();
        if (!isValid && window.location.pathname !== '/auth.html') {
            showToast('Tu sesión ha expirado', 'warning');
        }
    }
}

/**
 * Get user display name
 * @returns {string} User display name
 */
function getUserDisplayName() {
    const user = getCurrentUser();
    if (!user) return 'Usuario';
    
    return user.nombre || user.username || user.email || 'Usuario';
}

/**
 * Update user in storage
 * @param {object} updatedUser - Updated user object
 */
function updateStoredUser(updatedUser) {
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    if (token && updatedUser) {
        saveAuthData(token, updatedUser);
        initAuthUI(); // Refresh UI
    }
}

// Initialize auth UI on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAuthUI();
        autoLoginCheck();
    });
} else {
    initAuthUI();
    autoLoginCheck();
}

// Handle menu toggle for mobile
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
});