<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

const posts = ref<Post[]>([])

async function cargarDatos(): Promise<void> {
  const respuesta = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=5'
  )
  const data: Post[] = await respuesta.json()
  posts.value = data
}

onMounted(cargarDatos)
</script>

<template>
  <main>
    <h1>Publicaciones</h1>
    <button @click="cargarDatos">Recargar</button>
    <ul>
      <li v-for="p in posts" :key="p.id">
        <h3>{{ p.title }}</h3>
        <p>{{ p.body }}</p>
      </li>
    </ul>
  </main>
</template>

<style scoped></style>
