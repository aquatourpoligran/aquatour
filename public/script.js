// Variables globales
const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const loadingSpinner = document.getElementById('loadingSpinner');
const buttonText = document.querySelector('.button-text');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('contrasena');
const messageModal = document.getElementById('messageModal');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.querySelector('.close');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya hay un token válido
    checkExistingToken();
    
    // Event listener para el formulario de login
    loginForm.addEventListener('submit', handleLogin);
    
    // Event listener para mostrar/ocultar contraseña
    togglePassword.addEventListener('click', togglePasswordVisibility);
    
    // Event listener para cerrar modal
    closeModal.addEventListener('click', closeMessageModal);
    
    // Cerrar modal al hacer click fuera de él
    window.addEventListener('click', function(event) {
        if (event.target === messageModal) {
            closeMessageModal();
        }
    });
    
    // Event listener para "Olvidaste tu contraseña"
    document.getElementById('forgotPasswordLink').addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('Funcionalidad de recuperación de contraseña próximamente disponible.', 'info');
    });
});

// Función para verificar token existente
async function checkExistingToken() {
    const token = localStorage.getItem('aquatour_token');
    
    if (token) {
        try {
            const response = await fetch('/api/verify-token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    redirectBasedOnRole(data.usuario.rol);
                }
            } else {
                // Token inválido, removerlo
                localStorage.removeItem('aquatour_token');
            }
        } catch (error) {
            console.error('Error verificando token:', error);
            localStorage.removeItem('aquatour_token');
        }
    }
}

// Función para manejar el login
async function handleLogin(e) {
    e.preventDefault();
    
    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    
    // Validaciones básicas
    if (!correo || !contrasena) {
        showMessage('Por favor, completa todos los campos.', 'error');
        return;
    }
    
    if (!isValidEmail(correo)) {
        showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
        return;
    }
    
    // Mostrar estado de carga
    setLoadingState(true);
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                correo: correo,
                contrasena: contrasena
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Guardar token en localStorage
            localStorage.setItem('aquatour_token', data.token);
            
            // Mostrar mensaje de éxito
            showMessage(`¡Bienvenido, ${data.usuario.nombre}!`, 'success');
            
            // Redirigir después de 1.5 segundos
            setTimeout(() => {
                redirectBasedOnRole(data.usuario.rol);
            }, 1500);
            
        } else {
            showMessage(data.message || 'Error al iniciar sesión', 'error');
        }
        
    } catch (error) {
        console.error('Error en login:', error);
        showMessage('Error de conexión. Por favor, intenta nuevamente.', 'error');
    } finally {
        setLoadingState(false);
    }
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para mostrar/ocultar contraseña
function togglePasswordVisibility() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Cambiar icono
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
}

// Función para establecer estado de carga
function setLoadingState(isLoading) {
    if (isLoading) {
        loginButton.disabled = true;
        buttonText.style.opacity = '0';
        loadingSpinner.style.display = 'block';
    } else {
        loginButton.disabled = false;
        buttonText.style.opacity = '1';
        loadingSpinner.style.display = 'none';
    }
}

// Función para mostrar mensajes
function showMessage(message, type = 'info') {
    const messageClass = type === 'error' ? 'error-message' : 
                        type === 'success' ? 'success-message' : 'info-message';
    
    modalMessage.innerHTML = `<div class="${messageClass}">${message}</div>`;
    messageModal.style.display = 'flex';
}

// Función para cerrar modal
function closeMessageModal() {
    messageModal.style.display = 'none';
}

// Función para redirigir basado en el rol
function redirectBasedOnRole(rol) {
    switch(rol) {
        case 'Superadministrador':
            window.location.href = '/dashboard/superadmin.html';
            break;
        case 'Administrador':
            window.location.href = '/dashboard/admin.html';
            break;
        case 'Asesor':
            window.location.href = '/dashboard/asesor.html';
            break;
        default:
            showMessage('Rol de usuario no reconocido', 'error');
    }
}

// Función para logout (para uso futuro)
function logout() {
    localStorage.removeItem('aquatour_token');
    window.location.href = '/';
}

// Función para obtener datos del usuario desde el token
function getUserFromToken() {
    const token = localStorage.getItem('aquatour_token');
    if (!token) return null;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error('Error decodificando token:', error);
        return null;
    }
}

// Validación en tiempo real
document.getElementById('correo').addEventListener('input', function() {
    const inputGroup = this.parentElement;
    if (this.value && isValidEmail(this.value)) {
        inputGroup.classList.remove('error');
        inputGroup.classList.add('success');
    } else if (this.value) {
        inputGroup.classList.remove('success');
        inputGroup.classList.add('error');
    } else {
        inputGroup.classList.remove('success', 'error');
    }
});

document.getElementById('contrasena').addEventListener('input', function() {
    const inputGroup = this.parentElement;
    if (this.value.length >= 6) {
        inputGroup.classList.remove('error');
        inputGroup.classList.add('success');
    } else if (this.value) {
        inputGroup.classList.remove('success');
        inputGroup.classList.add('error');
    } else {
        inputGroup.classList.remove('success', 'error');
    }
});
