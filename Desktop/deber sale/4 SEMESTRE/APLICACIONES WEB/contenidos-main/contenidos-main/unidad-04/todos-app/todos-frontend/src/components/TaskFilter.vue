<template>
  <div class="task-filter card mb-4">
    <div class="card-body">
      <div class="row align-items-end">
        <!-- Filtro por tipo -->
        <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
          <label for="filterType" class="form-label">
            <i class="bi bi-funnel me-1"></i>
            Tipo
          </label>
          <select 
            class="form-select form-select-sm"
            id="filterType"
            v-model="localFilters.type"
            @change="emitFilterChange"
            :disabled="loading"
          >
            <option value="">Todos los tipos</option>
            <option 
              v-for="type in TASK_TYPES" 
              :key="type" 
              :value="type"
            >
              {{ type }}
            </option>
          </select>
        </div>

        <!-- Filtro por prioridad -->
        <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
          <label for="filterPriority" class="form-label">
            <i class="bi bi-exclamation-triangle me-1"></i>
            Prioridad
          </label>
          <select 
            class="form-select form-select-sm"
            id="filterPriority"
            v-model="localFilters.priority"
            @change="emitFilterChange"
            :disabled="loading"
          >
            <option value="">Todas las prioridades</option>
            <option 
              v-for="priority in TASK_PRIORITIES" 
              :key="priority" 
              :value="priority"
            >
              {{ priority.charAt(0).toUpperCase() + priority.slice(1) }}
            </option>
          </select>
        </div>

        <!-- Filtro por estado -->
        <div class="col-md-2 col-sm-6 mb-3 mb-md-0">
          <label for="filterCompleted" class="form-label">
            <i class="bi bi-check-circle me-1"></i>
            Estado
          </label>
          <select 
            class="form-select form-select-sm"
            id="filterCompleted"
            v-model="localFilters.completed"
            @change="emitFilterChange"
            :disabled="loading"
          >
            <option value="">Todas</option>
            <option value="false">Pendientes</option>
            <option value="true">Completadas</option>
          </select>
        </div>

        <!-- Ordenamiento -->
        <div class="col-md-2 col-sm-6 mb-3 mb-md-0">
          <label for="filterSort" class="form-label">
            <i class="bi bi-sort-down me-1"></i>
            Ordenar por
          </label>
          <select 
            class="form-select form-select-sm"
            id="filterSort"
            v-model="localFilters.sortBy"
            @change="emitFilterChange"
            :disabled="loading"
          >
            <option value="createdAt">Fecha creación</option>
            <option value="updatedAt">Última actualización</option>
            <option value="name">Nombre</option>
            <option value="deadline">Fecha límite</option>
            <option value="priority">Prioridad</option>
          </select>
        </div>

        <!-- Orden y acciones -->
        <div class="col-md-2 col-12">
          <div class="d-flex gap-2">
            <!-- Botón de orden -->
            <button 
              type="button"
              :class="`btn btn-outline-secondary btn-sm ${localFilters.order === 'asc' ? 'active' : ''}`"
              @click="toggleOrder"
              :disabled="loading"
              :title="localFilters.order === 'asc' ? 'Orden ascendente' : 'Orden descendente'"
            >
              <i :class="`bi bi-sort-${localFilters.order === 'asc' ? 'up' : 'down'}`"></i>
            </button>

            <!-- Botón limpiar filtros -->
            <button 
              type="button"
              class="btn btn-outline-danger btn-sm"
              @click="clearFilters"
              :disabled="loading || !hasActiveFilters"
              title="Limpiar filtros"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Indicadores de filtros activos -->
      <div v-if="hasActiveFilters" class="mt-3">
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <small class="text-muted">Filtros activos:</small>
          
          <span v-if="localFilters.type" class="badge bg-primary">
            Tipo: {{ localFilters.type }}
            <button 
              type="button" 
              class="btn-close btn-close-white ms-1" 
              style="font-size: 0.6rem;"
              @click="clearFilter('type')"
            ></button>
          </span>
          
          <span v-if="localFilters.priority" class="badge bg-warning text-dark">
            Prioridad: {{ localFilters.priority }}
            <button 
              type="button" 
              class="btn-close ms-1" 
              style="font-size: 0.6rem;"
              @click="clearFilter('priority')"
            ></button>
          </span>
          
          <span v-if="localFilters.completed !== undefined" class="badge bg-success">
            {{ localFilters.completed === 'true' ? 'Completadas' : 'Pendientes' }}
            <button 
              type="button" 
              class="btn-close btn-close-white ms-1" 
              style="font-size: 0.6rem;"
              @click="clearFilter('completed')"
            ></button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import type { TaskFilters } from '@/types/Task'
import { TASK_TYPES, TASK_PRIORITIES } from '@/types/Task'

// Props
interface Props {
  filters: TaskFilters
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// Emits
interface Emits {
  (e: 'update:filters', filters: TaskFilters): void
  (e: 'filter-change'): void
}

const emit = defineEmits<Emits>()

// Local filters state
const localFilters = reactive<TaskFilters>({
  type: props.filters.type,
  priority: props.filters.priority,
  completed: props.filters.completed,
  sortBy: props.filters.sortBy || 'createdAt',
  order: props.filters.order || 'desc'
})

// Computed properties
const hasActiveFilters = computed(() => {
  return !!(localFilters.type || 
           localFilters.priority || 
           localFilters.completed !== undefined)
})

// Methods
const emitFilterChange = () => {
  // Convert string 'true'/'false' to boolean for completed filter
  const filters: TaskFilters = {
    ...localFilters,
    completed: localFilters.completed === 'true' ? true : 
               localFilters.completed === 'false' ? false : 
               undefined
  }
  
  emit('update:filters', filters)
  emit('filter-change')
}

const toggleOrder = () => {
  localFilters.order = localFilters.order === 'asc' ? 'desc' : 'asc'
  emitFilterChange()
}

const clearFilters = () => {
  localFilters.type = undefined
  localFilters.priority = undefined
  localFilters.completed = undefined
  emitFilterChange()
}

const clearFilter = (filterName: keyof TaskFilters) => {
  localFilters[filterName] = undefined
  emitFilterChange()
}

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.type = newFilters.type
  localFilters.priority = newFilters.priority
  localFilters.completed = newFilters.completed === true ? 'true' : 
                          newFilters.completed === false ? 'false' : 
                          undefined
  localFilters.sortBy = newFilters.sortBy || 'createdAt'
  localFilters.order = newFilters.order || 'desc'
}, { deep: true })
</script>

<style scoped>
.task-filter {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e9ecef;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.form-label {
  font-weight: 500;
  font-size: 0.875rem;
  color: #495057;
  margin-bottom: 0.25rem;
}

.form-select-sm {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border-radius: 0.375rem;
}

.btn-outline-secondary.active {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35rem 0.5rem;
  border-radius: 0.375rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-close {
  background: none;
  border: none;
  opacity: 0.8;
  cursor: pointer;
  padding: 0;
  width: 0.8rem;
  height: 0.8rem;
}

.btn-close:hover {
  opacity: 1;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

/* Animations */
.task-filter {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.badge {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-label {
    font-size: 0.8rem;
  }
  
  .form-select-sm {
    font-size: 0.75rem;
  }
  
  .btn-sm {
    font-size: 0.75rem;
    padding: 0.2rem 0.4rem;
  }
  
  .badge {
    font-size: 0.7rem;
    padding: 0.25rem 0.4rem;
  }
}

@media (max-width: 576px) {
  .card-body {
    padding: 1rem;
  }
  
  .col-12:not(:last-child) {
    margin-bottom: 0.75rem;
  }
  
  .d-flex.gap-2 {
    justify-content: center;
  }
}

/* Focus states for accessibility */
.form-select:focus,
.btn:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Loading state */
.form-select:disabled,
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
