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
    return user && user.role === CONFIG.ROLES.ADMIN;
}

/**
 * Save authentication data
 * @param {string} token - JWT token
 * @param {object} user - User object
 */
function saveAuthData(token, user) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
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
    
    // Redirect to home after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
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
        
        setTimeout(() => {
            window.location.href = `auth.html?redirect=${encodeURIComponent(currentUrl)}`;
        }, 1500);
        
        return false;
    }
    return true;
}
