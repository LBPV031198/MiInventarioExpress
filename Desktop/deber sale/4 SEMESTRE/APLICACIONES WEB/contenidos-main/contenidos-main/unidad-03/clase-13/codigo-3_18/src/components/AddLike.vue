<template>
    <article class="post">
        <header>
            <h2>Publicación destacada</h2>
        </header>
        <p>Reacciones ❤️: <strong>{{ contador }}</strong></p>
        <button @click="incrementar">Dar like</button>
    </article>
</template>

<script setup lang="ts">
import { useContador } from '../composables/useContador';
const { contador, incrementar } = useContador();
</script>

<style scoped>
.post {
    border: 2px dashed #ef4444;
    padding: 1rem;
    border-radius: 8px;
}

button {
    padding: .5rem .8rem;
    background: #ef4444;
    color: white;
    border: 0;
    border-radius: 6px;
}
</style>
