<script setup lang="ts">
import { ref, onMounted } from 'vue'

/**
 * Tipos de datos esperados de la API de Open-Meteo
 * Solo incluimos los campos necesarios para este ejemplo.
 */
interface CurrentWeather {
  temperature_2m: number
  apparent_temperature: number
  wind_speed_10m: number
  relative_humidity_2m?: number
  weather_code: number
}

interface ApiResponse {
  current: CurrentWeather
}

/**
 * Estados reactivos:
 * - weather: guarda los datos de clima actuales
 * - loading: indica si la solicitud está en curso
 * - error: almacena mensajes de error (si ocurren)
 */
const weather = ref<CurrentWeather | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

/**
 * Función auxiliar: convierte el código de clima en un emoji + descripcion.
 * Estos códigos provienen de la documentación de Open-Meteo.
 */
function codeToWeatherInfo(code: number): { emoji: string; desc: string } {
  const map: Record<number, { emoji: string; desc: string }> = {
    0: { emoji: '☀️', desc: 'Despejado' },
    1: { emoji: '🌤️', desc: 'Mayormente despejado' },
    2: { emoji: '⛅', desc: 'Parcialmente nublado' },
    3: { emoji: '☁️', desc: 'Nublado' },
    45: { emoji: '🌫️', desc: 'Niebla' },
    51: { emoji: '🌦️', desc: 'Llovizna ligera' },
    61: { emoji: '🌧️', desc: 'Lluvia ligera' },
    65: { emoji: '🌧️', desc: 'Lluvia intensa' },
    71: { emoji: '❄️', desc: 'Nieve ligera' },
    80: { emoji: '🌦️', desc: 'Chubascos' },
    95: { emoji: '⛈️', desc: 'Tormenta' }
  }
  return map[code] ?? { emoji: '🌡️', desc: 'Clima variable' }
}

/**
 * Función para cargar el clima actual desde la API.
 * Se incluyen validaciones de estado HTTP y tipo de contenido.
 */
async function loadWeather() {
  loading.value = true
  error.value = null

  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', '-0.2299')   // Latitud de Quito
    url.searchParams.set('longitude', '-78.5249') // Longitud de Quito
    url.searchParams.set(
      'current',
      'temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m,weather_code'
    )
    url.searchParams.set('timezone', 'auto')

    const res = await fetch(url.toString())

    // Validación del estado HTTP
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`)
    }

    // Validación del tipo de contenido
    const ct = res.headers.get('content-type') ?? ''
    if (!ct.includes('application/json')) {
      throw new Error('Respuesta no es JSON')
    }

    // Parseo y validación mínima de datos
    const data: ApiResponse = await res.json()
    if (!data.current) {
      throw new Error('Estructura de datos inesperada')
    }

    weather.value = data.current
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'Error desconocido al obtener el clima'
    }
  } finally {
    loading.value = false
  }
}

// Cargar datos al montar el componente
onMounted(loadWeather)
</script>

<template>
  <section class="panel">
    <h2>Clima actual — Quito</h2>

    <!-- Estado cargando -->
    <p v-if="loading">Cargando datos del clima...</p>

    <!-- Estado error -->
    <p v-else-if="error" class="error">Error: {{ error }}</p>

    <!-- Estado con datos -->
    <div v-else-if="weather" class="weather-box">
      <span class="emoji">{{ codeToWeatherInfo(weather.weather_code).emoji }}</span>
      <p class="desc">{{ codeToWeatherInfo(weather.weather_code).desc }}</p>

      <ul class="metrics">
        <li><strong>Temperatura:</strong> {{ weather.temperature_2m }} °C</li>
        <li><strong>Sensación térmica:</strong> {{ weather.apparent_temperature }} °C</li>
        <li><strong>Viento:</strong> {{ weather.wind_speed_10m }} km/h</li>
        <li v-if="weather.relative_humidity_2m !== undefined">
          <strong>Humedad:</strong> {{ weather.relative_humidity_2m }} %
        </li>
      </ul>
    </div>

    <!-- Botón de recarga -->
    <button :disabled="loading" @click="loadWeather">
      Recargar
    </button>
  </section>
</template>

<style scoped>
.panel {
  max-width: 320px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.error {
  color: #b91c1c;
}
.weather-box {
  margin: 12px 0;
}
.emoji {
  font-size: 2.5rem;
}
.desc {
  font-weight: 500;
  margin: 4px 0 12px;
}
.metrics {
  list-style: none;
  padding: 0;
  text-align: left;
  font-size: 0.95rem;
}
.metrics li {
  margin-bottom: 4px;
}
button {
  margin-top: 8px;
  padding: .4rem .8rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
}
</style>
