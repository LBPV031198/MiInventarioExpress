# Todos API - Backend

API REST para el sistema de gestión de tareas construida con Node.js, Express y MongoDB.

## 🚀 Características

- **Framework**: Express.js 4.x
- **Base de datos**: MongoDB con Mongoose ODM
- **Validación**: express-validator
- **Seguridad**: Helmet, CORS configurado
- **Compresión**: gzip habilitada
- **Logging**: Estructurado para desarrollo y producción
- **Health checks**: Endpoint de estado de la API

## 📁 Estructura del Proyecto

```
todos-api/
├── src/
│   ├── controllers/        # Controladores de rutas
│   │   └── taskController.js
│   ├── models/            # Modelos de Mongoose
│   │   └── Task.js
│   ├── routes/            # Definición de rutas
│   │   └── tasks.js
│   ├── middleware/        # Middleware personalizado
│   │   ├── cors.js
│   │   └── errorHandler.js
│   ├── config/           # Configuraciones
│   │   └── database.js
│   └── app.js           # Configuración de Express
├── deployment/          # Archivos de despliegue
│   ├── railway.json
│   ├── .env.railway.example
│   └── .env.atlas.example
├── server.js           # Punto de entrada
├── package.json
└── README.md
```

## 🛠️ Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```

3. **Configurar MongoDB**
   - Local: `mongodb://localhost:27017/todos-app`
   - Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/todos-app`

4. **Iniciar servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## 🌐 API Endpoints

### Health Check
- `GET /health` - Estado de la API
- `GET /api` - Información de la API

### Tareas (Tasks)
- `GET /api/tasks` - Obtener todas las tareas
- `GET /api/tasks/:id` - Obtener tarea por ID
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `GET /api/tasks/stats` - Obtener estadísticas

### Parámetros de consulta

#### GET /api/tasks
- `type`: Universidad | Casa | Trabajo | Personal
- `priority`: alta | media | baja
- `completed`: true | false
- `sortBy`: name | createdAt | updatedAt | deadline | priority
- `order`: asc | desc

## 📊 Modelo de Datos

### Task Schema
```javascript
{
  name: String,           // Requerido, máx 100 caracteres
  description: String,    // Opcional, máx 500 caracteres
  type: String,          // Enum: Universidad, Casa, Trabajo, Personal
  priority: String,      // Enum: alta, media, baja (default: media)
  deadline: Date,        // Opcional, debe ser futura
  completed: Boolean,    // Default: false
  createdAt: Date,       // Auto-generado
  updatedAt: Date        // Auto-generado
}
```

## 🔧 Variables de Entorno

```env
# Servidor
NODE_ENV=development
PORT=5000

# Base de datos
MONGODB_URI=mongodb://localhost:27017/todos-app

# CORS
FRONTEND_URL=http://localhost:5173
NETLIFY_URL=https://tu-app.netlify.app

# Configuración adicional
API_VERSION=v1
```

## 🚀 Despliegue

### Railway

1. **Configurar railway.json**
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/health"
     }
   }
   ```

2. **Variables de entorno en Railway**
   - `NODE_ENV=production`
   - `MONGODB_URI=mongodb+srv://...`
   - `FRONTEND_URL=https://tu-app.netlify.app`

3. **Desplegar**
   - Conectar repositorio de GitHub
   - Railway detectará automáticamente la configuración

### MongoDB Atlas

1. **Crear cluster**
2. **Configurar usuario y contraseña**
3. **Whitelist IPs** (0.0.0.0/0 para desarrollo)
4. **Obtener connection string**

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 📝 Scripts Disponibles

- `npm start` - Iniciar servidor de producción
- `npm run dev` - Servidor de desarrollo con nodemon
- `npm test` - Ejecutar tests
- `npm run lint` - Linter ESLint
- `npm run format` - Formatear código con Prettier

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configurado para orígenes específicos
- **Validación**: Datos de entrada validados
- **Sanitización**: Prevención de inyección
- **Rate Limiting**: Preparado para implementar

## 📊 Logging y Monitoreo

- **Console logging**: Desarrollo
- **Structured logging**: Producción
- **Error tracking**: Preparado para Sentry
- **Health checks**: `/health` endpoint

## 🐛 Debugging

```bash
# Logs detallados
DEBUG=todos-api:* npm run dev

# Inspeccionar con Node.js
node --inspect server.js
```

## 🤝 Contribución

1. Seguir convenciones de código existentes
2. Agregar tests para nuevas funcionalidades
3. Actualizar documentación
4. Validar con ESLint y Prettier

## 📄 Dependencias Principales

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **cors**: Cross-Origin Resource Sharing
- **helmet**: Seguridad HTTP
- **express-validator**: Validación de datos
- **compression**: Compresión gzip
- **dotenv**: Variables de entorno

## 🔗 Enlaces Útiles

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Railway Documentation](https://docs.railway.app/)