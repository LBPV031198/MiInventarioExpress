<template>
  <div 
    :class="[
      'task-card card h-100',
      { 'completed': task.completed },
      { 'overdue': isOverdue }
    ]"
  >
    <div class="card-body d-flex flex-column">
      <!-- Header con tipo y prioridad -->
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div class="d-flex gap-2">
          <span :class="`badge badge-type bg-${getTaskTypeColor(task.type)}`">
            <i :class="`bi bi-${getTaskTypeIcon(task.type)} me-1`"></i>
            {{ task.type }}
          </span>
          <span :class="`badge badge-priority bg-${getTaskPriorityColor(task.priority)}`">
            <i :class="`bi bi-${getTaskPriorityIcon(task.priority)} me-1`"></i>
            {{ task.priority }}
          </span>
        </div>
        
        <!-- Estado de completado -->
        <div class="form-check">
          <input 
            class="form-check-input" 
            type="checkbox" 
            :checked="task.completed"
            @change="$emit('toggle-complete')"
            :id="`task-${task.id}`"
          >
          <label class="form-check-label visually-hidden" :for="`task-${task.id}`">
            Marcar como completada
          </label>
        </div>
      </div>

      <!-- Título de la tarea -->
      <h5 
        :class="[
          'card-title mb-2',
          { 'text-decoration-line-through text-muted': task.completed }
        ]"
      >
        {{ task.name }}
      </h5>

      <!-- Descripción -->
      <p 
        v-if="task.description" 
        :class="[
          'card-text text-truncate-2 flex-grow-1',
          { 'text-muted': task.completed }
        ]"
      >
        {{ task.description }}
      </p>

      <!-- Fecha límite -->
      <div v-if="task.deadline" class="mb-3">
        <small 
          :class="[
            'text-muted d-flex align-items-center',
            { 'text-danger fw-bold': isOverdue && !task.completed }
          ]"
        >
          <i class="bi bi-calendar-event me-1"></i>
          <span v-if="isOverdue && !task.completed">
            Vencida: {{ formatDate(task.deadline) }}
          </span>
          <span v-else>
            Vence: {{ formatDate(task.deadline) }}
          </span>
        </small>
      </div>

      <!-- Fechas de creación y actualización -->
      <div class="mb-3">
        <small class="text-muted d-block">
          <i class="bi bi-clock me-1"></i>
          Creada: {{ formatDate(task.createdAt) }}
        </small>
        <small v-if="task.updatedAt !== task.createdAt" class="text-muted d-block">
          <i class="bi bi-pencil me-1"></i>
          Actualizada: {{ formatDate(task.updatedAt) }}
        </small>
      </div>

      <!-- Botones de acción -->
      <div class="mt-auto">
        <div class="btn-group w-100" role="group">
          <button 
            type="button" 
            class="btn btn-outline-primary btn-sm"
            @click="$emit('edit')"
            :disabled="task.completed"
          >
            <i class="bi bi-pencil me-1"></i>
            Editar
          </button>
          <button 
            type="button" 
            class="btn btn-outline-danger btn-sm"
            @click="confirmDelete"
          >
            <i class="bi bi-trash me-1"></i>
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Indicador de estado overdue -->
    <div v-if="isOverdue && !task.completed" class="position-absolute top-0 end-0 p-2">
      <i class="bi bi-exclamation-triangle-fill text-danger" title="Tarea vencida"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types/Task'
import { 
  getTaskTypeColor, 
  getTaskPriorityColor, 
  getTaskTypeIcon, 
  getTaskPriorityIcon, 
  formatDate, 
  isTaskOverdue 
} from '@/types/Task'

// Props
interface Props {
  task: Task
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'toggle-complete'): void
}

const emit = defineEmits<Emits>()

// Computed properties
const isOverdue = computed(() => isTaskOverdue(props.task))

// Methods
const confirmDelete = () => {
  if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${props.task.name}"?`)) {
    emit('delete')
  }
}
</script>

<style scoped>
.task-card {
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  position: relative;
  overflow: hidden;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.task-card.completed {
  opacity: 0.7;
  background-color: #f8f9fa;
}

.task-card.completed .card-body {
  position: relative;
}

.task-card.completed .card-body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(40, 167, 69, 0.1) 10px,
    rgba(40, 167, 69, 0.1) 20px
  );
  pointer-events: none;
}

.task-card.overdue {
  border-left: 4px solid #dc3545;
}

.task-card.overdue:not(.completed) {
  background: linear-gradient(135deg, #fff 0%, #fff5f5 100%);
}

.badge-type {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-weight: 500;
}

.badge-priority {
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-check-input {
  transform: scale(1.2);
  cursor: pointer;
}

.form-check-input:checked {
  background-color: #28a745;
  border-color: #28a745;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  max-height: 2.8em;
}

.btn-group .btn {
  font-size: 0.8rem;
  padding: 0.375rem 0.5rem;
  font-weight: 500;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
}

/* Animaciones */
.task-card {
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Estados hover para botones */
.btn-sm:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .badge-type,
  .badge-priority {
    font-size: 0.65rem;
    padding: 0.15rem 0.3rem;
  }
  
  .card-title {
    font-size: 1rem;
  }
  
  .btn-group .btn {
    font-size: 0.75rem;
    padding: 0.25rem 0.4rem;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .task-card,
  .btn-sm {
    transition: none;
    animation: none;
  }
  
  .task-card:hover {
    transform: none;
  }
  
  .btn-sm:hover {
    transform: none;
  }
}

/* Dark mode support (preparado para futuras implementaciones) */
@media (prefers-color-scheme: dark) {
  .task-card {
    background-color: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .task-card.completed {
    background-color: #1a202c;
  }
}
</style>