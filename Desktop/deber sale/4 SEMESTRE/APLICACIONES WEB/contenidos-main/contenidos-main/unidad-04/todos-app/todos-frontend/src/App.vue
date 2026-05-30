<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { apiService, handleApiError } from '@/services/api'
import type { Task, TaskFilters, CreateTaskRequest, UpdateTaskRequest } from '@/types/Task'

// Importar componentes
import TaskList from '@/components/TaskList.vue'
import TaskForm from '@/components/TaskForm.vue'
import TaskFilter from '@/components/TaskFilter.vue'

// Estado reactivo
const tasks = ref<Task[]>([])
const loading = ref(false)
const formLoading = ref(false)
const showCreateModal = ref(false)
const editingTask = ref<Task | null>(null)

// Filtros
const filters = reactive<TaskFilters>({
  type: undefined,
  priority: undefined,
  completed: undefined,
  sortBy: 'createdAt',
  order: 'desc',
})

// Sistema de alertas
const alert = reactive({
  show: false,
  type: 'info' as 'success' | 'danger' | 'warning' | 'info',
  message: '',
})

// Computed properties
const filteredTasks = computed(() => {
  let result = [...tasks.value]

  // Aplicar filtros locales adicionales si es necesario
  if (filters.completed !== undefined) {
    result = result.filter((task) => task.completed === filters.completed)
  }

  return result
})

// Métodos
const showAlert = (type: typeof alert.type, message: string) => {
  alert.type = type
  alert.message = message
  alert.show = true

  // Auto-hide después de 5 segundos
  setTimeout(() => {
    hideAlert()
  }, 5000)
}

const hideAlert = () => {
  alert.show = false
}

const getAlertIcon = (type: string) => {
  const icons = {
    success: 'check-circle-fill',
    danger: 'exclamation-triangle-fill',
    warning: 'exclamation-triangle-fill',
    info: 'info-circle-fill',
  }
  return icons[type as keyof typeof icons] || 'info-circle-fill'
}

const loadTasks = async () => {
  try {
    loading.value = true
    const response = await apiService.getTasks(filters)

    if (response.success && response.data) {
      tasks.value = response.data
    } else {
      throw new Error(response.message || 'Error al cargar las tareas')
    }
  } catch (error) {
    console.error('Error cargando tareas:', error)
    showAlert('danger', handleApiError(error))
  } finally {
    loading.value = false
  }
}

const refreshTasks = () => {
  loadTasks()
}

const applyFilters = () => {
  loadTasks()
}

const saveTask = async (taskData: CreateTaskRequest | UpdateTaskRequest) => {
  try {
    formLoading.value = true
    let response

    if (editingTask.value) {
      // Actualizar tarea existente
      response = await apiService.updateTask(editingTask.value.id, taskData as UpdateTaskRequest)
    } else {
      // Crear nueva tarea
      response = await apiService.createTask(taskData as CreateTaskRequest)
    }

    if (response.success) {
      showAlert(
        'success',
        editingTask.value ? 'Tarea actualizada correctamente' : 'Tarea creada correctamente',
      )
      showCreateModal.value = false
      editingTask.value = null
      await loadTasks()
    } else {
      throw new Error(response.message || 'Error al guardar la tarea')
    }
  } catch (error) {
    console.error('Error guardando tarea:', error)
    showAlert('danger', handleApiError(error))
  } finally {
    formLoading.value = false
  }
}

const editTask = (task: Task) => {
  editingTask.value = task
  showCreateModal.value = true
}

const deleteTask = async (task: Task) => {
  if (!confirm(`¿Estás seguro de que quieres eliminar la tarea "${task.name}"?`)) {
    return
  }

  try {
    const response = await apiService.deleteTask(task.id)

    if (response.success) {
      showAlert('success', 'Tarea eliminada correctamente')
      await loadTasks()
    } else {
      throw new Error(response.message || 'Error al eliminar la tarea')
    }
  } catch (error) {
    console.error('Error eliminando tarea:', error)
    showAlert('danger', handleApiError(error))
  }
}

const toggleTaskComplete = async (task: Task) => {
  try {
    const response = await apiService.toggleTaskCompletion(task.id, !task.completed)

    if (response.success) {
      const action = !task.completed ? 'completada' : 'marcada como pendiente'
      showAlert('success', `Tarea ${action}`)
      await loadTasks()
    } else {
      throw new Error(response.message || 'Error al actualizar la tarea')
    }
  } catch (error) {
    console.error('Error actualizando tarea:', error)
    showAlert('danger', handleApiError(error))
  }
}

const cancelEdit = () => {
  editingTask.value = null
  showCreateModal.value = false
}

// Lifecycle hooks
onMounted(() => {
  loadTasks()
})
</script>

<template>
  <div id="app">
    <!-- Header de la aplicación -->
    <header class="app-header">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h1 class="mb-0">
              <i class="bi bi-check2-square me-2"></i>
              Todos App
            </h1>
            <p class="subtitle mb-0">Gestiona tus tareas de manera eficiente</p>
          </div>
          <div class="col-md-6 text-md-end mt-2 mt-md-0">
            <button class="btn btn-light btn-sm me-2" @click="refreshTasks" :disabled="loading">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Actualizar
            </button>
            <button class="btn btn-success btn-sm" @click="showCreateModal = true">
              <i class="bi bi-plus-lg me-1"></i>
              Nueva Tarea
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="main-container">
      <div class="container">
        <!-- Alertas -->
        <div
          v-if="alert.show"
          :class="`alert alert-${alert.type} alert-dismissible fade show`"
          role="alert"
        >
          <i :class="`bi bi-${getAlertIcon(alert.type)} me-2`"></i>
          {{ alert.message }}
          <button type="button" class="btn-close" @click="hideAlert"></button>
        </div>

        <!-- Filtros -->
        <TaskFilter v-model:filters="filters" @filter-change="applyFilters" :loading="loading" />

        <!-- Lista de tareas -->
        <TaskList
          :tasks="filteredTasks"
          :loading="loading"
          @edit-task="editTask"
          @delete-task="deleteTask"
          @toggle-complete="toggleTaskComplete"
        />

        <!-- Modal para crear/editar tarea -->
        <TaskForm
          v-model:show="showCreateModal"
          :task="editingTask"
          :loading="formLoading"
          @save-task="saveTask"
          @cancel="cancelEdit"
        />
      </div>
    </main>

    <!-- Loading overlay -->
    <div v-if="loading && tasks.length === 0" class="loading-overlay">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos específicos del componente App */
.app-header {
  background: linear-gradient(135deg, #007bff, #0056b3);
}

.loading-overlay {
  backdrop-filter: blur(2px);
}

.alert {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
