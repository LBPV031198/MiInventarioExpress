<template>
  <section>
    <h2>Login</h2>
    <p>Autenticación simulada para probar guards.</p>
    <button @click="iniciarSesion">Iniciar sesión</button>
  </section>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

function iniciarSesion() {
  login()
  const destino = (route.query.redirect as string) || '/dashboard'
  // Reemplaza la URL actual (no deja rastro del login)
  router.replace(destino)
}
</script>
