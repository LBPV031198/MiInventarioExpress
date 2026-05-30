<script setup lang="ts">
import { ref } from 'vue'
const nombre = ref('')
</script>

<template>
  <div class="saludo">
    <h1>Hola, {{ nombre }}</h1>
    <input v-model="nombre" placeholder="Escribe tu nombre" />
  </div>
</template>

<style scoped>
.saludo {
  max-width: 300px;
  margin: 2rem auto;
  text-align: center;
}
input {
  margin-top: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
