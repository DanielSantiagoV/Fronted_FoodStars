# ⭐ FoodStars - Frontend

<div align="center">
  <img src="./icon/foodstars.png" alt="FoodStars Logo" width="150" height="150">
</div>

> **Plataforma Gastronómica - Descubre, Califica y Comparte**  
> *Interfaz web moderna y responsiva para descubrir restaurantes y compartir experiencias culinarias*

## 📋 Descripción del Proyecto

Este es el **frontend** de FoodStars, una plataforma web moderna diseñada para descubrir, calificar y compartir experiencias gastronómicas excepcionales. La aplicación permite a los usuarios explorar restaurantes, leer y escribir reseñas auténticas, y administrar contenido mediante un panel de administración completo.

### ✨ Características Principales

- 🍽️ **Descubrimiento de Restaurantes**: Explora miles de restaurantes con información detallada
- ⭐ **Sistema de Reseñas**: Lee y escribe reseñas auténticas con calificaciones (1-5 estrellas)
- 🔍 **Búsqueda Avanzada**: Búsqueda inteligente por nombre, categoría o platos
- 📊 **Panel de Administración**: Gestión completa de restaurantes, platos, categorías y usuarios
- 🎯 **Filtros Inteligentes**: Filtra por categoría, calificación mínima y ordena por popularidad
- 📱 **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- 🎨 **UI Moderna**: Diseño elegante con efectos glassmorphism, animaciones fluidas y fondos animados
- 🔐 **Autenticación Completa**: Sistema de registro e inicio de sesión seguro
- 📝 **Gestión de Menús**: Visualiza y administra platos de cada restaurante
- 🌟 **Rankings y Estadísticas**: Sistema de calificación inteligente con rankings precisos

## 📁 Estructura del Proyecto

```
Fronted_FoodStars/
├── css/                      # Estilos de la aplicación
│   ├── style.css            # Estilos globales y componentes compartidos
│   ├── index.css            # Estilos de la página principal
│   ├── restaurants.css      # Estilos de la página de restaurantes
│   ├── restaurant-detail.css # Estilos de detalle de restaurante
│   ├── auth.css             # Estilos de autenticación
│   └── admin.css            # Estilos del panel de administración
├── html/                     # Páginas HTML
│   ├── restaurants.html     # Listado de restaurantes
│   ├── restaurant-detail.html # Detalle de restaurante
│   ├── auth.html             # Página de autenticación
│   └── admin.html           # Panel de administración
├── js/                       # Scripts JavaScript
│   ├── config.js            # Configuración global
│   ├── utils.js             # Utilidades y funciones auxiliares
│   ├── api.js               # Comunicación con la API
│   ├── auth.js              # Lógica de autenticación
│   ├── main.js              # Lógica de la página principal
│   ├── restaurant.js        # Lógica de restaurantes
│   ├── restaurante-detail.js # Lógica de detalle de restaurante
│   ├── admin.js             # Lógica del panel admin
│   └── auth-page.js         # Lógica de la página de auth
├── icon/                     # Iconos y recursos
│   └── foodstars.png        # Favicon de la aplicación
├── index.html               # Página principal
└── README.md                # Este archivo
```

## 🚀 Páginas Principales

### 🏠 Página Principal (`index.html`)
- Hero section con búsqueda de restaurantes
- Categorías populares
- Restaurantes destacados
- Sección de características
- Estadísticas en tiempo real

### 🍽️ Restaurantes (`html/restaurants.html`)
- Grid/Lista de restaurantes
- Búsqueda y filtros avanzados
- Filtros por categoría y calificación
- Ordenamiento por popularidad y calificación
- Paginación

### 📄 Detalle de Restaurante (`html/restaurant-detail.html`)
- Información completa del restaurante
- Galería de imágenes
- Menú destacado con platos
- Sección de reseñas con sistema de calificación
- Estadísticas de calificaciones
- Restaurantes similares

### 🔐 Autenticación (`html/auth.html`)
- Formulario de inicio de sesión
- Formulario de registro
- Validación de contraseñas
- Integración con redes sociales (UI)
- Recuperación de contraseña

### 👨‍💼 Panel de Administración (`html/admin.html`)
- Dashboard con estadísticas
- Gestión de restaurantes (CRUD)
- Gestión de platos (CRUD)
- Gestión de categorías (CRUD)
- Gestión de reseñas (moderación)
- Gestión de usuarios

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y moderna
- **CSS3**: Estilos avanzados, animaciones y diseño responsivo
- **JavaScript (Vanilla)**: Lógica de la aplicación sin frameworks
- **API REST**: Comunicación con backend mediante fetch API
- **LocalStorage**: Almacenamiento de tokens y preferencias

## ⚙️ Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd Fronted_FoodStars
   ```

2. **Configurar la URL de la API**
   - Editar `js/config.js`
   - Actualizar `API_URL` con la URL de tu backend:
     ```javascript
     API_URL: 'http://localhost:3000/api/v1'
     ```

3. **Abrir en el navegador**
   - Simplemente abre `index.html` en tu navegador
   - O usa un servidor local (ej: Live Server en VS Code)

## 🔧 Funcionalidades Clave

### Para Usuarios
- ✅ Registro e inicio de sesión
- ✅ Búsqueda de restaurantes
- ✅ Filtrado por categorías y calificación
- ✅ Visualización de detalles de restaurantes
- ✅ Escritura y edición de reseñas
- ✅ Visualización de menús y platos

### Para Administradores
- ✅ Dashboard con métricas en tiempo real
- ✅ CRUD completo de restaurantes
- ✅ CRUD completo de platos
- ✅ CRUD completo de categorías
- ✅ Moderación de reseñas
- ✅ Gestión de usuarios

## 📱 Diseño Responsivo

La aplicación está completamente optimizada para:
- 💻 **Desktop**: Experiencia completa con todas las funcionalidades
- 📱 **Tablet**: Layout adaptado con navegación optimizada
- 📱 **Mobile**: Diseño móvil-first con menú hamburguesa

## 🎨 Características de UI/UX

- **Fondos Animados**: Esferas de gradiente animadas
- **Glassmorphism**: Efectos de vidrio esmerilado en tarjetas
- **Transiciones Suaves**: Animaciones fluidas en todas las interacciones
- **Feedback Visual**: Notificaciones toast para todas las acciones
- **Estados de Carga**: Indicadores de carga elegantes
- **Diseño Intuitivo**: Navegación clara y fácil de usar

## 📝 Notas Adicionales

- El proyecto está diseñado para trabajar con una API REST backend
- La autenticación se maneja mediante tokens JWT almacenados en localStorage
- Todas las peticiones API incluyen manejo de errores y estados de carga
- El diseño sigue principios de diseño moderno y accesibilidad web