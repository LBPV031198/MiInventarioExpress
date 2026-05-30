<template>
  <div class="tarjeta">
    <h2>{{ nombre }}</h2>
    <p>Email: {{ correo }}</p>
  </div>
</template>

<script setup>
// Declaración explícita de las props esperadas
defineProps({
  nombre: String,
  correo: String
});
</script>

<style scoped>
.tarjeta {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  max-width: 300px;
  margin: auto;
  background-color: #f9f9f9;
}
</style>
