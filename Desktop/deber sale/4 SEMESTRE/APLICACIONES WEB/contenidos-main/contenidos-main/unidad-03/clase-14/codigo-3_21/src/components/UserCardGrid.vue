<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface User {
  id: number
  name: string
  email: string
  company: { name: string }
}

const users = ref<User[]>([])

async function load(): Promise<void> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users')
  const data: User[] = await res.json()
  users.value = data
}

onMounted(load)
</script>

<template>
  <section class="grid">
    <article v-for="u in users" :key="u.id" class="card">
      <img
        :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&size=128`"
        :alt="u.name"
        class="avatar"
      />
      <div class="info">
        <h3>{{ u.name }}</h3>
        <p class="email">{{ u.email }}</p>
        <p class="company">{{ u.company.name }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  flex-shrink: 0;
}
.info h3 {
  margin: 0;
  font-size: 1rem;
  color: #1e293b;
}
.email {
  font-size: 0.85rem;
  color: #475569;
}
.company {
  font-size: 0.85rem;
  color: #334155;
}
</style>
