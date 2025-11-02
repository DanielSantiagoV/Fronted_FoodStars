# ⭐ FoodStars - Frontend

<div align="center">
  <img src="https://media.tenor.com/fWD5SZjcqHwAAAAi/cooking-nasogg.gif" alt="FoodStars Logo" width="350" height="350">
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


## 🛠️ Tecnologías Utilizadas

### Frontend Core
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Características Técnicas
- **CSS Vanilla**: Estilos personalizados con variables CSS y diseño modular
- **JavaScript ES6+**: Código moderno sin frameworks (Vanilla JS)
- **Fetch API**: Comunicación asíncrona con el backend REST
- **LocalStorage**: Almacenamiento de tokens y datos de sesión
- **Responsive Design**: Media queries y diseño mobile-first

### Recursos y Herramientas
- **Iconos SVG**: Iconos vectoriales inline para mejor rendimiento
- **Emojis**: Uso de emojis nativos para iconos temáticos
- **CSS Variables**: Sistema de diseño con variables personalizables
- **Animaciones CSS**: Transiciones y animaciones fluidas nativas

### Backend (Requerido)
El frontend requiere un backend REST API con los siguientes endpoints:
- Autenticación (login, registro, logout)
- Restaurantes (CRUD)
- Platos/Menú (CRUD)
- Categorías (CRUD)
- Reseñas (CRUD)
- Usuarios (gestión)

## 🚀 Instalación y Configuración

### Prerrequisitos
- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Servidor backend REST API corriendo (por defecto: `http://localhost:3000`)
- Editor de código (recomendado: VS Code con extensión Live Server)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd Fronted_FoodStars
   ```

2. **Configurar la URL del Backend**
   - Abrir el archivo `js/config.js`
   - Actualizar `API_URL` con la URL de tu backend:
     ```javascript
     API_URL: 'http://localhost:3000/api/v1'
     ```

3. **Abrir la aplicación**
   
   **Opción 1: Servidor HTTP simple (Python)**
   ```bash
   python -m http.server 8000
   # Luego abrir: http://localhost:8000
   ```
   
   **Opción 2: Servidor HTTP simple (Node.js)**
   ```bash
   npx http-server -p 8000
   # Luego abrir: http://localhost:8000
   ```
   
   **Opción 3: Live Server (VS Code - Recomendado)**
   - Instalar extensión "Live Server" en VS Code
   - Clic derecho en `index.html` → "Open with Live Server"

4. **Verificar la conexión**
   - Abrir la consola del navegador (F12)
   - Verificar que no hay errores de conexión con la API
   - El backend debe estar corriendo en el puerto configurado

### Configuración Adicional

- **Cambiar el puerto del backend**: Editar `API_URL` en `js/config.js`
- **Configurar timeout de requests**: Modificar `API_TIMEOUT` en `js/config.js`
- **Personalizar paginación**: Ajustar `PAGINATION` en `js/config.js`



## 🎯 Funcionalidades Detalladas

### 🍽️ Gestión de Restaurantes
- **Exploración**: Visualiza restaurantes con información completa (nombre, categoría, ubicación, calificación)
- **Búsqueda Inteligente**: Búsqueda por nombre, categoría o platos
- **Filtros Avanzados**: Filtra por categoría, calificación mínima y ordena por popularidad o ranking
- **Vista Detallada**: Página dedicada con información completa, menú y reseñas
- **Gestión Admin**: CRUD completo para administradores (crear, editar, eliminar restaurantes)

### ⭐ Sistema de Reseñas
- **Escritura de Reseñas**: Los usuarios pueden escribir reseñas con calificación (1-5 estrellas)
- **Comentarios**: Reseñas con texto mínimo de 10 caracteres y máximo de 1000
- **Edición y Eliminación**: Los usuarios pueden editar o eliminar sus propias reseñas
- **Visualización**: Sistema de visualización con paginación y estadísticas de calificaciones
- **Moderación**: Los administradores pueden moderar reseñas

### 🍕 Gestión de Platos
- **Menú del Restaurante**: Visualiza todos los platos de cada restaurante
- **Información Completa**: Nombre, descripción, precio e imagen
- **Gestión Admin**: CRUD completo de platos asociados a restaurantes
- **Filtrado**: Filtra platos por restaurante

### 🏷️ Sistema de Categorías
- **Categorías Populares**: Exploración por categorías de comida (Italiana, Sushi, Vegetariano, etc.)
- **Iconos Temáticos**: Cada categoría tiene un emoji representativo
- **Gestión Admin**: Crear, editar y eliminar categorías
- **Filtrado por Categoría**: Navega restaurantes por tipo de comida

### 📊 Panel de Administración
- **Dashboard**: Estadísticas en tiempo real (restaurantes, reseñas, usuarios, categorías)
- **Gestión Completa**: Administra restaurantes, platos, categorías, reseñas y usuarios
- **Actividad Reciente**: Visualiza las últimas acciones del sistema
- **Tablas Interactivas**: Visualización clara con acciones rápidas

### 🔐 Autenticación y Usuarios
- **Registro**: Creación de cuenta con validación de contraseñas
- **Inicio de Sesión**: Autenticación segura con tokens JWT
- **Perfil de Usuario**: Gestión de perfil y preferencias
- **Roles**: Sistema de roles (usuario y administrador)
- **Sesión Persistente**: Tokens almacenados en localStorage

### 🎨 Características de UI/UX
- **Glassmorphism**: Efectos de vidrio esmerilado en tarjetas y modales
- **Animaciones Fluidas**: Transiciones suaves en todas las interacciones
- **Fondos Animados**: Esferas de gradiente animadas en el fondo
- **Responsive Design**: Adaptable a todos los dispositivos
- **Notificaciones Toast**: Feedback visual para todas las acciones
- **Estados de Carga**: Indicadores elegantes durante las peticiones
- **Modales Elegantes**: Confirmaciones y formularios en modales modernos

## 🔧 Configuración Avanzada

### Variables de Configuración
```javascript
// En js/config.js - Configuración global
const CONFIG = {
    API_URL: 'http://localhost:3000/api/v1',
    API_TIMEOUT: 10000,
    
    PAGINATION: {
        DEFAULT_LIMIT: 12,
        MAX_LIMIT: 50
    },
    
    VALIDATION: {
        PASSWORD_MIN_LENGTH: 8,
        REVIEW_MIN_LENGTH: 10,
        REVIEW_MAX_LENGTH: 1000
    },
    
    RATING: {
        MIN: 1,
        MAX: 5
    }
}
```

### Personalización de Estilos
```css
/* Variables CSS personalizables en css/style.css */
:root {
    --primary: #FF6B35;
    --primary-dark: #E55A2B;
    --secondary: #004E89;
    --accent: #F7931E;
    --dark: #1A1A2E;
    /* ... más variables de color y espaciado */
}
```

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1024px (Layout completo con sidebar)
- **Tablet**: 768px - 1024px (Grid adaptativo, menú hamburguesa)
- **Mobile**: < 768px (Layout vertical, navegación optimizada)

### Características Móviles
- Menú hamburguesa táctil
- Formularios adaptativos con inputs grandes
- Modales full-screen en móvil
- Botones optimizados para touch
- Grid responsive con columnas adaptativas

## 🔌 Integración con Backend

### Endpoints de Autenticación
```
POST   /api/v1/auth/registro          # Registrar nuevo usuario
POST   /api/v1/auth/login             # Iniciar sesión
POST   /api/v1/auth/logout            # Cerrar sesión
GET    /api/v1/auth/perfil            # Obtener perfil
PUT    /api/v1/auth/perfil            # Actualizar perfil
```

### Endpoints de Restaurantes
```
GET    /api/v1/restaurantes           # Obtener restaurantes (con filtros)
GET    /api/v1/restaurantes/:id      # Obtener restaurante por ID
POST   /api/v1/restaurantes           # Crear restaurante (admin)
PUT    /api/v1/restaurantes/:id       # Actualizar restaurante (admin)
DELETE /api/v1/restaurantes/:id       # Eliminar restaurante (admin)
```

### Endpoints de Platos
```
GET    /api/v1/platos                 # Obtener platos (con filtros)
GET    /api/v1/platos/:id             # Obtener plato por ID
GET    /api/v1/restaurantes/:id/platos # Platos de un restaurante
POST   /api/v1/platos                 # Crear plato (admin)
PUT    /api/v1/platos/:id              # Actualizar plato (admin)
DELETE /api/v1/platos/:id             # Eliminar plato (admin)
```

### Endpoints de Reseñas
```
GET    /api/v1/resenas                # Obtener reseñas (con filtros)
GET    /api/v1/resenas/:id            # Obtener reseña por ID
GET    /api/v1/restaurantes/:id/resenas # Reseñas de un restaurante
POST   /api/v1/resenas                # Crear reseña (autenticado)
PUT    /api/v1/resenas/:id            # Actualizar reseña (propietario)
DELETE /api/v1/resenas/:id            # Eliminar reseña (propietario/admin)
```

### Endpoints de Categorías
```
GET    /api/v1/categorias             # Obtener todas las categorías
GET    /api/v1/categorias/:id         # Obtener categoría por ID
POST   /api/v1/categorias             # Crear categoría (admin)
PUT    /api/v1/categorias/:id         # Actualizar categoría (admin)
DELETE /api/v1/categorias/:id         # Eliminar categoría (admin)
```

### Endpoints de Administración
```
GET    /api/v1/admin/dashboard        # Estadísticas del dashboard
GET    /api/v1/admin/usuarios         # Listar usuarios
PUT    /api/v1/admin/usuarios/:id     # Actualizar rol de usuario
DELETE /api/v1/admin/usuarios/:id      # Eliminar usuario
```

### Formato de Datos

**Restaurante:**
```javascript
{
  "_id": "string",
  "nombre": "string",
  "categoriaId": "string",
  "descripcion": "string",
  "ubicacion": "string",
  "imagen": "string (base64 o URL)",
  "promedioCalificacion": number,
  "totalResenas": number,
  "popularidad": number
}
```

**Reseña:**
```javascript
{
  "_id": "string",
  "restauranteId": "string",
  "usuarioId": "string",
  "calificacion": number (1-5),
  "comentario": "string",
  "fecha": "ISO_string"
}
```

**Plato:**
```javascript
{
  "_id": "string",
  "nombre": "string",
  "restauranteId": "string",
  "descripcion": "string",
  "precio": number,
  "imagen": "string"
}
```

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de Conexión al Backend**
   ```
   ❌ Error: No se pudo conectar con el backend
   ```
   - Verificar que el servidor backend esté corriendo en `http://localhost:3000`
   - Comprobar la URL en `js/config.js`
   - Revisar CORS en el backend (debe permitir el origen del frontend)
   - Verificar la consola del navegador para errores específicos

2. **Error de Autenticación**
   ```
   ❌ Error: Token inválido o expirado
   ```
   - Cerrar sesión y volver a iniciar sesión
   - Limpiar localStorage del navegador
   - Verificar que el backend esté generando tokens válidos

3. **Restaurantes No Cargan**
   - Verificar formato de respuesta del API
   - Comprobar que el backend devuelva `{ success: true, data: [...] }`
   - Revisar consola del navegador para errores
   - Verificar permisos CORS

4. **Reseñas No se Publican**
   - Verificar que el usuario esté autenticado
   - Comprobar validaciones (mínimo 10 caracteres)
   - Verificar que se haya seleccionado una calificación
   - Revisar formato de datos enviados

5. **Imágenes No se Suben**
   - Verificar formato de imagen (JPG, PNG, WEBP)
   - Comprobar tamaño máximo (recomendado: 2MB)
   - Verificar conversión a base64
   - Revisar endpoints de backend para subida de imágenes

## 🚀 Próximas Mejoras

- [ ] 📱 **PWA (Progressive Web App)**: Instalación como app nativa
- [ ] 🗺️ **Integración con Mapas**: Visualización de restaurantes en mapa
- [ ] 🔔 **Notificaciones Push**: Alertas de nuevas reseñas y actualizaciones
- [ ] 🌐 **Internacionalización (i18n)**: Soporte multi-idioma
- [ ] 📊 **Gráficos Avanzados**: Estadísticas visuales con charts
- [ ] 💾 **Exportación de Datos**: Exportar restaurantes y reseñas
- [ ] 🔍 **Búsqueda Avanzada**: Filtros más complejos y búsqueda semántica
- [ ] ⭐ **Sistema de Favoritos**: Guardar restaurantes favoritos
- [ ] 📸 **Galería de Fotos**: Subir múltiples fotos por restaurante
- [ ] 🎯 **Recomendaciones**: Sistema de recomendaciones personalizadas

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork el proyecto**
   ```bash
   git clone <repository-url>
   cd Fronted_FoodStars
   ```

2. **Crea una rama para tu feature**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

3. **Realiza tus cambios**
   - Sigue las convenciones de código existentes
   - Agrega comentarios donde sea necesario
   - Prueba tus cambios en diferentes navegadores

4. **Commit tus cambios**
   ```bash
   git commit -m 'feat: agregar nueva funcionalidad X'
   ```

5. **Push a la rama**
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

6. **Abre un Pull Request**
   - Describe los cambios realizados
   - Incluye capturas de pantalla si aplica
   - Menciona cualquier breaking change

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Desarrollado con ❤️ para la comunidad gastronómica**

---

### 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- 📧 **Email**: [vinascodaniel9@gmail.com]
- 🐛 **Issues**: Abre un issue en el repositorio
- 💬 **Discusiones**: Participa en las discusiones del proyecto

---

*¡Gracias por usar FoodStars! ⭐🍽️✨*