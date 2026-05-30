<script setup lang="ts">
import AddCart from './components/AddCart.vue';
import AddLike from './components/AddLike.vue';
</script>

<template>
  <h1>Ejemplo de Composable compartido y componentes distintos</h1>
  <div style="display:flex; gap:1rem; align-items:flex-start;">
    <AddCart />
    <AddLike />
  </div>
</template>

<style scoped></style>
