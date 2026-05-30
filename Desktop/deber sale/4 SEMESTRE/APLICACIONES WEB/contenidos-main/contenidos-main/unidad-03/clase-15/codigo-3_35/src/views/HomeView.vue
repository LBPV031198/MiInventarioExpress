<template>
  <section>
    <h2>Inicio</h2>
    <p>Ejemplos de navegación programática:</p>

    <button @click="irAUsuario(7)">Ir a usuario 7 (push)</button>
    <button @click="irDashboard()">Ir al Dashboard (requiere login)</button>
    <button @click="redirigirAAbout()">Reemplazar URL actual por About</button>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

function irAUsuario(id: number) {
  router.push({ name: 'user', params: { id } })
}
function irDashboard() {
  router.push({ name: 'dashboard-home' })
}
function redirigirAAbout() {
  router.replace({ name: 'about' })
}
</script>
