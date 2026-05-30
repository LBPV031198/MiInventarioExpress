<template>
  <section>
    <h2>Perfil de usuario</h2>
    <p><strong>ID:</strong> {{ id }}</p>
    <p><strong>Filtro (query):</strong> {{ route.query.filter ?? 'ninguno' }}</p>
    <button @click="volver">Volver</button>
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

// props desde la ruta (gracias a props: true)
const props = defineProps<{ id: string }>()
const id = props.id

const route = useRoute()
const router = useRouter()

function volver() {
  router.back()
}
</script>
