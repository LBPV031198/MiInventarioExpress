const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const corsMiddleware = require('./middleware/cors');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Importar rutas
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compresión gzip
app.use(compression());

// CORS
app.use(corsMiddleware);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware para desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Todos API - Sistema de gestión de tareas',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks',
      health: '/health'
    },
    documentation: 'https://github.com/tu-usuario/todos-api'
  });
});

// Rutas de la API
app.use('/api/tasks', taskRoutes);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;