import { createApp } from 'vue'
import App from './App.vue'

// Importar Bootstrap CSS y JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Importar estilos personalizados
import './assets/styles/main.css'

// Crear la aplicación Vue
const app = createApp(App)

// Configuración global de la aplicación
app.config.globalProperties.$appName = 'Todos App'
app.config.globalProperties.$appVersion = '1.0.0'

// Manejo global de errores
app.config.errorHandler = (err, instance, info) => {
  console.error('Error global de Vue:', err)
  console.error('Información del error:', info)

  // En producción, podrías enviar esto a un servicio de logging
  if (import.meta.env.PROD) {
    // Aquí podrías integrar con servicios como Sentry, LogRocket, etc.
    console.error('Error en producción:', { err, info })
  }
}

// Configuración de advertencias en desarrollo
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Advertencia de Vue:', msg)
    console.warn('Trace:', trace)
  }
}

// Montar la aplicación
app.mount('#app')

// Remover el loading screen cuando la app esté lista
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.classList.add('app-ready')
  }, 500)
})

// Configurar título dinámico de la página
document.title = 'Todos App - Gestión de Tareas'

// Configurar meta description dinámicamente
const metaDescription = document.querySelector('meta[name="description"]')
if (metaDescription) {
  metaDescription.setAttribute(
    'content',
    'Organiza tus tareas de Universidad, Casa, Trabajo y Personal de manera eficiente con Todos App',
  )
}

// Configurar variables CSS personalizadas
document.documentElement.style.setProperty('--app-primary-color', '#007bff')
document.documentElement.style.setProperty('--app-secondary-color', '#6c757d')
document.documentElement.style.setProperty('--app-success-color', '#28a745')
document.documentElement.style.setProperty('--app-danger-color', '#dc3545')
document.documentElement.style.setProperty('--app-warning-color', '#ffc107')
document.documentElement.style.setProperty('--app-info-color', '#17a2b8')

// Log de inicialización en desarrollo
if (import.meta.env.DEV) {
  console.log('🚀 Todos App iniciada en modo desarrollo')
  console.log('📡 API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
}
