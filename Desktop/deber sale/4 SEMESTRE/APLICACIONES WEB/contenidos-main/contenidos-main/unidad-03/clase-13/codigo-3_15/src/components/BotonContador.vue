<template>
  <button @click="notificarPadre">
    Haz clic (local: {{ clics }})
  </button>
</template>

<script setup>
import { ref } from 'vue';

const clics = ref(0);
const emit = defineEmits(['incrementado']);

const notificarPadre = () => {
  clics.value++;
  emit('incrementado'); // Se emite el evento hacia el componente padre
};
</script>

<style scoped>
button {
  padding: 0.7rem;
  background-color: steelblue;
  color: white;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>