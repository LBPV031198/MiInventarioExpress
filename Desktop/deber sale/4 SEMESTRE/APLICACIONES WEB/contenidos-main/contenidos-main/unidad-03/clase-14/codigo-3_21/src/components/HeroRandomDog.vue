<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface DogApiResponse {
  message: string
  status: string
}

const imageUrl = ref<string>('')

async function load(): Promise<void> {
  const res = await fetch('https://dog.ceo/api/breeds/image/random')
  const data: DogApiResponse = await res.json()
  imageUrl.value = data.message
}

onMounted(load)
</script>

<template>
  <section class="hero" v-if="imageUrl">
    <img :src="imageUrl" alt="Random dog" />
    <div class="overlay">
      <h2>Imagen destacada</h2>
      <button class="reload" @click="load">Otra imagen</button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 260px;
  border-radius: 16px;
  overflow: hidden;
  background: #e2e8f0;
}
.hero img {
  width: 100%;
  height: 800px;
  object-fit: cover;
  display: block;
}
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  background: linear-gradient(transparent, rgba(0,0,0,.35));
  color: white;
}
.reload {
  background: white;
  border: 0;
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
}
</style>
