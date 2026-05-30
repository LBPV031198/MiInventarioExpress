<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import LoadingCard from './components/LoadingCard.vue'
import ErrorCard from './components/ErrorCard.vue'

// Estado para “pedir” el módulo bajo demanda (evita cargarlo de inicio).
const showModule = ref(false)

/**
 * Componente asíncrono:
 * - loader: carga perezosa del archivo del componente real.
 * - suspensible: true → la espera la gobierna <Suspense>.
 * - delay: evita parpadeos de loaders (ms antes de mostrar fallback).
 * - timeout: tiempo máximo; si excede, dispara error.
 * - onError: reintenta automáticamente hasta 2 veces.
 */
const AsyncUserInsights = defineAsyncComponent({
  loader: () => import('./components/UserInsights.vue'),
  suspensible: true,
  delay: 200,
  timeout: 8000,
  errorComponent: ErrorCard,
  onError(error, retry, fail, attempts) {
    if (attempts <= 2) retry()
    else fail()
  },
})
</script>

<template>
  <main class="container">
    <h1>Componentes asíncronos en Vue 3</h1>
    <p>Este módulo se carga bajo demanda y suspende su render hasta resolver datos iniciales.</p>

    <button v-if="!showModule" class="btn" @click="showModule = true">
      Cargar módulo analítico
    </button>

    <!-- Al solicitar el módulo, usamos Suspense para fallback/errores -->
    <Suspense v-if="showModule">
      <template #default>
        <AsyncUserInsights />
      </template>
      <template #fallback>
        <LoadingCard />
      </template>
    </Suspense>

  </main>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: system-ui, sans-serif;
}
.btn {
  padding: 0.45rem 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
}
</style>
