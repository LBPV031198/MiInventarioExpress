<script setup lang="ts">
import NavBar from './components/NavBar.vue'
</script>

<template>
  <header class="p-4">
    <h1>Demo SPA con Vue Router (TS)</h1>
    <NavBar />
  </header>

  <main class="p-4">
    <router-view />
  </main>
</template>

<style>
body {
  font-family: system-ui, sans-serif;
  margin: 0;
}
a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
nav a {
  margin-right: 12px;
}
</style>
