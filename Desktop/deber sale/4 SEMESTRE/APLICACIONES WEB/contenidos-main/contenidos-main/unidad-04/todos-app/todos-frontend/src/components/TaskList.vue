<template>
  <div class="task-list">
    <!-- Loading state -->
    <div v-if="loading && tasks.length === 0" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando tareas...</span>
      </div>
      <p class="mt-3 text-muted">Cargando tareas...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading && tasks.length === 0" class="empty-state">
      <i class="bi bi-clipboard-x"></i>
      <h3>No hay tareas</h3>
      <p>¡Comienza creando tu primera tarea!</p>
    </div>

    <!-- Tasks list -->
    <div v-else class="row">
      <div 
        v-for="task in tasks" 
        :key="task.id"
        class="col-12 col-md-6 col-lg-4 mb-3"
      >
        <TaskItem
          :task="task"
          @edit="$emit('edit-task', task)"
          @delete="$emit('delete-task', task)"
          @toggle-complete="$emit('toggle-complete', task)"
        />
      </div>
    </div>

    <!-- Loading overlay for refresh -->
    <div v-if="loading && tasks.length > 0" class="position-relative">
      <div class="loading-overlay-small">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Actualizando...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types/Task'
import TaskItem from './TaskItem.vue'

// Props
interface Props {
  tasks: Task[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// Emits
interface Emits {
  (e: 'edit-task', task: Task): void
  (e: 'delete-task', task: Task): void
  (e: 'toggle-complete', task: Task): void
}

defineEmits<Emits>()
</script>

<style scoped>
.task-list {
  position: relative;
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
  color: #dee2e6;
}

.empty-state h3 {
  color: #495057;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.empty-state p {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 0;
}

.loading-overlay-small {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 0.5rem;
}

/* Animaciones */
.task-list .col-12 {
  animation: fadeInUp 0.3s ease-out;
}

.task-list .col-12:nth-child(1) { animation-delay: 0.1s; }
.task-list .col-12:nth-child(2) { animation-delay: 0.2s; }
.task-list .col-12:nth-child(3) { animation-delay: 0.3s; }
.task-list .col-12:nth-child(4) { animation-delay: 0.4s; }
.task-list .col-12:nth-child(5) { animation-delay: 0.5s; }
.task-list .col-12:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .empty-state {
    padding: 3rem 1rem;
  }
  
  .empty-state i {
    font-size: 4rem;
  }
  
  .empty-state h3 {
    font-size: 1.25rem;
  }
  
  .empty-state p {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .empty-state i {
    font-size: 3rem;
  }
  
  .empty-state h3 {
    font-size: 1.1rem;
  }
}
</style>