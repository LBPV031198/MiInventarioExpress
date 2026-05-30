<script setup lang="ts">
import WeatherCurrent from './components/WeatherCurrent.vue'
</script>

<template>
    <main class="container">
        <header class="header">
            <h1>Clima — Quito, Ecuador</h1>
            <p>Consumo de API con manejo de respuestas y errores</p>
        </header>

        <WeatherCurrent />
    </main>
</template>

<style scoped>
.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    margin-bottom: 16px;
}

.section {
    margin-top: 20px;
}
</style>
