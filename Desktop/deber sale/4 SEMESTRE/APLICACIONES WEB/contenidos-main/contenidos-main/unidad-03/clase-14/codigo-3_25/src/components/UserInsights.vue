<script setup lang="ts">
// Simula una tarea de datos “costosa” (p. ej., fetch + agregación)
async function loadAnalytics() {
  await new Promise((r) => setTimeout(r, 1200)) // latencia simulada
  return {
    activeUsers: 1240,
    conversion: 0.043,
    arpu: 12.3,
  }
}

// Top‑level await: el componente no se renderiza hasta resolver.
const analytics = await loadAnalytics()
</script>

<template>
  <section class="grid">
    <article class="tile">
      <h3>Usuarios activos</h3>
      <p class="val">{{ analytics.activeUsers.toLocaleString() }}</p>
    </article>
    <article class="tile">
      <h3>Conversión</h3>
      <p class="val">{{ (analytics.conversion * 100).toFixed(2) }}%</p>
    </article>
    <article class="tile">
      <h3>ARPU</h3>
      <p class="val">$ {{ analytics.arpu.toFixed(2) }}</p>
    </article>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
.tile {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  background: #fff;
}
h3 {
  margin: 0 0 6px;
  font-size: 0.95rem;
  color: #334155;
}
.val {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
}
</style>
