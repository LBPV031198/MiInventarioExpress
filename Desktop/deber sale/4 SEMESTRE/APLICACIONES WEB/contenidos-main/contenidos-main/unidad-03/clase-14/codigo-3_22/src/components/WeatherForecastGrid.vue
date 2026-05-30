<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Hourly {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
}
interface ForecastResp {
    hourly: Hourly
    timezone: string
}

const items = ref<Array<{ time: string; temp: number; code: number }>>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const ct = res.headers.get('content-type') ?? ''
    if (!ct.includes('application/json')) throw new Error('Contenido no JSON')
    return res.json() as Promise<T>
}

function codeToEmoji(code: number): string {
    if ([0, 1].includes(code)) return '☀️'
    if ([2].includes(code)) return '⛅'
    if ([3, 45, 48].includes(code)) return '☁️'
    if ([51, 61, 63, 80].includes(code)) return '🌦️'
    if ([65, 95].includes(code)) return '⛈️'
    if ([71].includes(code)) return '❄️'
    return '🌡️'
}

async function load() {
    loading.value = true
    error.value = null
    try {
        const url = new URL('https://api.open-meteo.com/v1/forecast')
        url.searchParams.set('latitude', '-0.2299')
        url.searchParams.set('longitude', '-78.5249')
        url.searchParams.set('hourly', 'temperature_2m,weather_code')
        url.searchParams.set('forecast_days', '3')
        url.searchParams.set('timezone', 'auto')

        const resp = await fetchJson<ForecastResp>(url.toString())
        const h = resp?.hourly
        if (!h?.time || !h?.temperature_2m || !h?.weather_code) {
            throw new Error('Estructura inesperada')
        }
        // Empaquetar las primeras 18 horas como muestra
        const n = Math.min(h.time.length, 18)
        items.value = Array.from({ length: n }, (_, i) => ({
            time: h.time[i],
            temp: h.temperature_2m[i],
            code: h.weather_code[i]
        }))
    } catch (e: unknown) {
        error.value = (e instanceof Error) ? e.message : 'Fallo al obtener pronóstico.'
    } finally {
        loading.value = false
    }
}

onMounted(load)
</script>

<template>
    <section>
        <p v-if="loading">Cargando pronóstico…</p>
        <p v-else-if="error" class="error">Error: {{ error }}</p>

        <div v-else class="grid">
            <article v-for="it in items" :key="it.time" class="card">
                <div class="time">{{ new Date(it.time).toLocaleString() }}</div>
                <div class="temp">{{ it.temp.toFixed(1) }} °C</div>
                <div class="icon">{{ codeToEmoji(it.code) }}</div>
            </article>
        </div>

        <button class="reload" :disabled="loading" @click="load">Recargar</button>
    </section>
</template>

<style scoped>
.error {
    color: #b91c1c;
}

.grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    margin: 8px 0 12px;
}

.card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 12px;
    display: grid;
    gap: 6px;
    text-align: center;
}

.time {
    font-size: .85rem;
    color: #475569;
}

.temp {
    font-weight: 600;
    color: #0f172a;
}

.icon {
    font-size: 1.25rem;
}

.reload {
    padding: .45rem .8rem;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    cursor: pointer;
}
</style>
