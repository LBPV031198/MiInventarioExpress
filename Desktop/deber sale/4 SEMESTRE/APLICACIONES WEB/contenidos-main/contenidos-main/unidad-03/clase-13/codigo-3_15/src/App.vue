<template>
  <h1>Componente personalizado</h1>
  <p>Total Acumulado: {{ total }}</p>
  <BotonContador @incrementado="sumar"/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BotonContador from './components/BotonContador.vue';

const total = ref(0);

const sumar = () => {
  total.value++;
};

</script>

<style scoped></style>
