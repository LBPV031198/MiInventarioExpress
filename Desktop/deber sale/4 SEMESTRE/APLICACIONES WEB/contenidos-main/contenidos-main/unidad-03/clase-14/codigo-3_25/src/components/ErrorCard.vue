<script setup lang="ts">
defineProps<{ message?: string }>()
</script>

<template>
  <div class="card error">
    <p><strong>Error al cargar el módulo.</strong></p>
    <p>{{ message ?? 'Intente nuevamente en unos segundos.' }}</p>
  </div>
</template>

<style scoped>
.card {
  padding: 14px;
  border: 1px solid #fecaca;
  border-radius: 12px;
  background: #fef2f2;
  color: #7f1d1d;
}
.error {
  font-weight: 500;
  font-size: 0.95rem;
}
</style>
