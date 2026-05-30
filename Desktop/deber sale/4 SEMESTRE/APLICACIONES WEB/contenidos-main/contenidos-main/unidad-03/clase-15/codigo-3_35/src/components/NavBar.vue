<template>
  <nav>
    <router-link to="/">Inicio</router-link>
    <router-link :to="{ name: 'about' }">Acerca</router-link>
    <router-link :to="{ name: 'user', params: { id: 42 }, query: { filter: 'vip' } }">
      Usuario 42
    </router-link>
    <router-link :to="{ name: 'dashboard-home' }">Dashboard</router-link>
    <router-link :to="{ name: 'login' }">Login</router-link>
  </nav>
</template>

<script setup lang="ts"></script>
