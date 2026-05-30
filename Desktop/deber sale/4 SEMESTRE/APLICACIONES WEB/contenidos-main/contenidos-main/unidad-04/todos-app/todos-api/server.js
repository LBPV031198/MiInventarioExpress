require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

// Conectar a la base de datos
connectDB();

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API Info: http://localhost:${PORT}/api`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err, promise) => {
  console.log('Error no manejado:', err.message);
  // Cerrar servidor y salir del proceso
  server.close(() => {
    process.exit(1);
  });
});

// Manejo de excepciones no capturadas
process.on('uncaughtException', (err) => {
  console.log('Excepción no capturada:', err.message);
  console.log('Cerrando aplicación...');
  process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor HTTP...');
  server.close(() => {
    console.log('Proceso HTTP terminado');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido. Cerrando servidor HTTP...');
  server.close(() => {
    console.log('Proceso HTTP terminado');
  });
});