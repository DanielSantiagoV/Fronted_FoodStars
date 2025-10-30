/**
 * FoodieRank - Auth Page Logic
 * Handles login and registration forms
 */

// Current active tab
let currentTab = 'login';

/**
 * Switch between login and register tabs
 * @param {string} tab - Tab to switch to ('login' or 'register')
 */
function switchTab(tab) {
    currentTab = tab;
    
    // Update tabs
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    }
    
    // Clear errors
    clearFormErrors();
}

/**
 * Toggle password visibility
 * @param {string} inputId - ID of password input
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.password-toggle');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = `
            <svg class="eye-closed" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
        `;
    } else {
        input.type = 'password';
        button.innerHTML = `
            <svg class="eye-open" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
        `;
    }
}

/**
 * Clear all form errors
 */
function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
    });
    
    document.querySelectorAll('.form-group input').forEach(input => {
        input.classList.remove('error');
    });
}

/**
 * Show field error
 * @param {string} fieldId - Field ID
 * @param {string} message - Error message
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + 'Error');
    
    if (field) field.classList.add('error');
    if (errorSpan) errorSpan.textContent = message;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function validateEmailFormat(email) {
    return validateEmail(email);
}

/**
 * Validate login form
 * @param {object} data - Form data
 * @returns {boolean} True if valid
 */
function validateLoginForm(data) {
    clearFormErrors();
    let isValid = true;
    
    // Validate email
    if (!data.email) {
        showFieldError('loginEmail', 'El correo electrónico es requerido');
        isValid = false;
    } else if (!validateEmailFormat(data.email)) {
        showFieldError('loginEmail', 'Ingresa un correo electrónico válido');
        isValid = false;
    }
    
    // Validate password
    if (!data.password) {
        showFieldError('loginPassword', 'La contraseña es requerida');
        isValid = false;
    } else if (data.password.length < CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
        showFieldError('loginPassword', `La contraseña debe tener al menos ${CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} caracteres`);
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validate register form
 * @param {object} data - Form data
 * @returns {boolean} True if valid
 */
function validateRegisterForm(data) {
    clearFormErrors();
    let isValid = true;
    
    // Validate name
    if (!data.nombre) {
        showFieldError('registerName', 'El nombre es requerido');
        isValid = false;
    } else if (data.nombre.length < CONFIG.VALIDATION.USERNAME_MIN_LENGTH) {
        showFieldError('registerName', `El nombre debe tener al menos ${CONFIG.VALIDATION.USERNAME_MIN_LENGTH} caracteres`);
        isValid = false;
    }
    
    // Validate email
    if (!data.email) {
        showFieldError('registerEmail', 'El correo electrónico es requerido');
        isValid = false;
    } else if (!validateEmailFormat(data.email)) {
        showFieldError('registerEmail', 'Ingresa un correo electrónico válido');
        isValid = false;
    }
    
    // Validate password
    if (!data.password) {
        showFieldError('registerPassword', 'La contraseña es requerida');
        isValid = false;
    } else {
        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.isValid) {
            showFieldError('registerPassword', passwordValidation.message);
            isValid = false;
        }
    }
    
    // Validate confirm password
    if (!data.confirmPassword) {
        showFieldError('registerConfirmPassword', 'Debes confirmar la contraseña');
        isValid = false;
    } else if (data.password !== data.confirmPassword) {
        showFieldError('registerConfirmPassword', 'Las contraseñas no coinciden');
        isValid = false;
    }
    
    // Validate terms acceptance
    if (!data.acceptTerms) {
        showFieldError('acceptTerms', 'Debes aceptar los términos y condiciones');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Handle login form submission
 * @param {Event} e - Submit event
 */
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateLoginForm(data)) {
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Iniciando sesión...</span>';
    
    try {
        // Call login function from auth.js
        await handleLogin({
            email: data.email,
            password: data.password
        });
        
        // Success feedback (toast shown in handleLogin)
        form.classList.add('form-success');
        
    } catch (error) {
        console.error('Login error:', error);
        
        // Show error message
        const errorMessage = error.message || CONFIG.MESSAGES.ERROR.GENERIC;
        showToast(errorMessage, 'error');
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

/**
 * Handle register form submission
 * @param {Event} e - Submit event
 */
async function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Convert checkbox to boolean
    data.acceptTerms = formData.get('acceptTerms') === 'on';
    
    // Validate form
    if (!validateRegisterForm(data)) {
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Creando cuenta...</span>';
    
    try {
        // Remove confirmPassword from data before sending
        const { confirmPassword, acceptTerms, ...registerData } = data;
        
        // Call register function from auth.js
        await handleRegister(registerData);
        
        // Success feedback (toast shown in handleRegister)
        form.classList.add('form-success');
        
    } catch (error) {
        console.error('Register error:', error);
        
        // Show error message
        const errorMessage = error.message || CONFIG.MESSAGES.ERROR.GENERIC;
        showToast(errorMessage, 'error');
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

/**
 * Update password strength indicator
 * @param {string} password - Password to check
 */
function updatePasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    // Remove all strength classes
    strengthFill.classList.remove('weak', 'medium', 'strong');
    
    if (!password) {
        strengthFill.style.width = '0';
        strengthText.textContent = 'La contraseña debe tener al menos 8 caracteres';
        return;
    }
    
    let strength = 0;
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    // Calculate strength
    Object.values(checks).forEach(check => {
        if (check) strength++;
    });
    
    // Update UI
    if (strength <= 2) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Contraseña débil';
        strengthText.style.color = 'var(--danger)';
    } else if (strength <= 4) {
        strengthFill.classList.add('medium');
        strengthText.textContent = 'Contraseña media';
        strengthText.style.color = 'var(--warning)';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Contraseña fuerte';
        strengthText.style.color = 'var(--success)';
    }
}

/**
 * Setup password strength monitor
 */
function setupPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            updatePasswordStrength(e.target.value);
        });
    }
}

/**
 * Check if already authenticated
 */
function checkExistingAuth() {
    if (isAuthenticated()) {
        showToast('Ya has iniciado sesión', 'info');
        setTimeout(() => {
            const params = getQueryParams();
            const redirectUrl = params.redirect || 'index.html';
            window.location.href = redirectUrl;
        }, 1500);
    }
}

/**
 * Initialize auth page
 */
function initAuthPage() {
    // Check if already authenticated
    checkExistingAuth();
    
    // Setup form handlers
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
    
    // Setup password strength indicator
    setupPasswordStrength();
    
    // Check for redirect parameter and show message
    const params = getQueryParams();
    if (params.redirect) {
        showToast('Debes iniciar sesión para continuar', 'info');
    }
    
    // Setup social auth buttons (placeholder)
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Autenticación social próximamente disponible', 'info');
        });
    });
    
    // Setup forgot password link
    document.querySelectorAll('.forgot-password').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Recuperación de contraseña próximamente disponible', 'info');
        });
    });
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthPage);
} else {
    initAuthPage();
}

// Export functions for global use
window.switchTab = switchTab;
window.togglePassword = togglePassword;