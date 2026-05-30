<script setup lang="ts">
import HeroRandomDog from './components/HeroRandomDog.vue'
import UserCardGrid from './components/UserCardGrid.vue'
</script>

<template>
    <main class="container">
        <header class="header">
            <h1>Galería de APIs</h1>
            <p class="subtitle">
                Ejemplo de integración de múltiples componentes con diferentes fuentes de datos.
            </p>
        </header>

        <HeroRandomDog />

        <section class="section">
            <h2>Usuarios ficticios</h2>
            <UserCardGrid />
        </section>
    </main>
</template>

<style scoped>
.container {
    max-width: 1120px;
    margin: 0 auto;
    padding: 20px;
    color: var(--text);
}

.header {
    margin-bottom: 16px;
}

.subtitle {
    margin-top: 4px;
    opacity: .75;
}

.section {
    margin-top: 20px;
}
</style>
