# Guía de Inicio Rápido

## 🚀 Ejecutar el Proyecto

### Opción 1: Desarrollo Local

1. **Iniciar el Backend**:
```bash
cd ../backed-mantenimiento-auto
docker-compose up -d
```

2. **Iniciar el Frontend**:
```bash
cd ../front-workshop-mantenimiento-auto
npm install
npm start
```

La aplicación estará disponible en http://localhost:3000

### Opción 2: Docker (Producción)

1. **Asegurarse de que el network existe**:
```bash
docker network create carcareconnect-network
```

2. **Iniciar el Backend**:
```bash
cd ../backed-mantenimiento-auto
docker-compose up -d
```

3. **Construir y ejecutar el Frontend**:
```bash
cd ../front-workshop-mantenimiento-auto
docker-compose up -d --build
```

El frontend estará disponible en http://localhost:3000

## 🔐 Probar la Aplicación

1. Ir a http://localhost:3000/register
2. Registrar un nuevo workshop con:
   - Username: `taller_test`
   - Email: `taller@test.com`
   - Password: `password123`
3. Iniciar sesión en http://localhost:3000/login
4. Ver y editar la información del workshop en el Dashboard

## 🛠️ Comandos Útiles

### Backend
```bash
# Ver logs
docker-compose logs -f app

# Detener servicios
docker-compose down

# Reconstruir
docker-compose up -d --build
```

### Frontend
```bash
# Desarrollo
npm start

# Construir producción
npm run build

# Tests
npm test

# Ver build local
serve -s build
```

## 📝 Variables de Entorno

### Backend (.env o docker-compose.yml)
- `SPRING_DATASOURCE_URL`: URL de la base de datos
- `JWT_SECRET`: Clave secreta para JWT
- `JWT_EXPIRATION`: Tiempo de expiración del token

### Frontend (.env)
- `REACT_APP_API_URL`: URL del backend (default: http://localhost:8080)

## 🔍 Verificar que todo funciona

### Backend
```bash
curl http://localhost:8080/api/v1/auth/health
# Debe responder: {"status":"UP","service":"identity"}
```

### Frontend
```bash
curl http://localhost:3000/health
# Debe responder: OK
```

## ❗ Troubleshooting

### El frontend no se conecta al backend
- Verificar que `REACT_APP_API_URL` esté correcto
- Verificar que el backend esté corriendo en el puerto 8080
- Revisar la consola del navegador para errores de CORS

### Error de autenticación
- Verificar que el token se esté guardando correctamente
- Limpiar localStorage y volver a iniciar sesión
- Verificar que JWT_SECRET esté configurado en el backend

### Error al construir con Docker
- Asegurarse de tener suficientes recursos (RAM, disco)
- Limpiar imágenes antiguas: `docker system prune -a`
- Verificar que node_modules esté en .dockerignore

