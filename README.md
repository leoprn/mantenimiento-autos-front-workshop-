# Front Workshop Mantenimiento Auto

Dashboard de gestión para talleres mecánicos desarrollado con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Autenticación**: Login y registro de talleres con JWT
- **Dashboard**: Interfaz moderna y responsiva para gestión de talleres
- **Gestión de Perfil**: Edición de información del workshop
- **Rutas Protegidas**: Sistema de protección de rutas basado en autenticación
- **UI Moderna**: Diseño con Tailwind CSS y componentes de Headless UI

## 📋 Prerrequisitos

- Node.js 16+ 
- npm o yarn
- Backend API (backed-mantenimiento-auto) corriendo en http://localhost:8080

## 🔧 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` en la raíz del proyecto:
```env
REACT_APP_API_URL=http://localhost:8080
```

## 🏃 Ejecución

Para desarrollo:
```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

Para producción:
```bash
npm run build
```

## 📦 Tecnologías Utilizadas

- **React 19**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **React Router**: Navegación y rutas
- **Axios**: Cliente HTTP
- **Tailwind CSS**: Framework de estilos
- **Headless UI**: Componentes sin estilos
- **Heroicons**: Iconos SVG

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── common/          # Componentes reutilizables
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   └── pages/           # Páginas principales
│       ├── Login.tsx
│       ├── Register.tsx
│       ├── Dashboard.tsx
│       └── WorkshopProfile.tsx
├── contexts/            # Contextos de React
│   └── AuthContext.tsx
├── services/            # Servicios API
│   └── api.ts
├── types/               # Definiciones TypeScript
│   └── index.ts
└── App.tsx              # Componente principal
```

## 🔐 Autenticación

El sistema utiliza JWT para autenticación:

1. **Registro**: El usuario se registra con username, email y contraseña
2. **Login**: Se obtiene un token JWT que se almacena en localStorage
3. **Protección**: Las rutas protegidas verifican la autenticación
4. **Interceptor**: Axios agrega automáticamente el token a las peticiones

## 🛣️ Rutas

- `/` - Redirige a dashboard
- `/login` - Página de inicio de sesión
- `/register` - Página de registro
- `/dashboard` - Dashboard principal (protegida)

## 🔗 Integración con API

### Endpoints consumidos:

- `POST /api/v1/auth/login/workshop` - Autenticación de comercios
- `POST /api/v1/auth/register/workshop` - Registro
- `GET /api/v1/workshops` - Obtener información del workshop
- `PUT /api/v1/workshops/{id}` - Actualizar información del workshop

## 🐳 Docker (Opcional)

Para ejecutar con Docker:

```bash
docker build -t front-workshop-mantenimiento-auto .
docker run -p 3000:80 front-workshop-mantenimiento-auto
```

## 📝 Licencia

Este proyecto es privado y de uso exclusivo del proyecto de mantenimiento automotriz.
