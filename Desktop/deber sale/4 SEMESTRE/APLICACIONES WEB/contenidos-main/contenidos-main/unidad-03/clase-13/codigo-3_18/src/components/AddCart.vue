<template>
    <section class="carrito">
        <h2>Carrito</h2>
        <p>
            Productos añadidos: <strong>{{ contador }}</strong>
        </p>
        <button @click="incrementar">Añadir al carrito</button>
    </section>
</template>

<script setup lang="ts">
import { useContador } from '../composables/useContador'
const { contador, incrementar } = useContador()
</script>

<style scoped>
.carrito {
    border: 2px solid #0ea5e9;
    padding: 1rem;
    border-radius: 8px;
}

button {
    padding: 0.5rem 0.8rem;
    background: #0ea5e9;
    color: white;
    border: 0;
    border-radius: 6px;
}
</style>
