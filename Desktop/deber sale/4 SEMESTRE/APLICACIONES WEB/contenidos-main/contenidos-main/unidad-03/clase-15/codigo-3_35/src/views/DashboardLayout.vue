<template>
  <section>
    <h2>Dashboard</h2>
    <nav>
      <router-link :to="{ name: 'dashboard-home' }">Resumen</router-link>
      <router-link :to="{ name: 'dashboard-billing' }">Facturación</router-link>
    </nav>
    <article style="margin-top: 1rem">
      <router-view />
    </article>
  </section>
</template>

<script setup lang="ts"></script>
