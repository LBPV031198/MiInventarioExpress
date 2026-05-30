<template>
  <!-- Modal -->
  <div 
    class="modal fade" 
    :class="{ show: show }" 
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1" 
    aria-labelledby="taskModalLabel" 
    :aria-hidden="!show"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title" id="taskModalLabel">
            <i :class="`bi bi-${isEditing ? 'pencil' : 'plus-lg'} me-2`"></i>
            {{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            @click="handleCancel"
            :disabled="loading"
          ></button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" novalidate>
            <!-- Nombre de la tarea -->
            <div class="mb-3">
              <label for="taskName" class="form-label">
                Nombre de la tarea <span class="text-danger">*</span>
              </label>
              <input 
                type="text" 
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                id="taskName"
                v-model="form.name"
                placeholder="Ej: Estudiar para el examen de matemáticas"
                maxlength="100"
                required
                :disabled="loading"
              >
              <div v-if="errors.name" class="invalid-feedback">
                {{ errors.name }}
              </div>
              <div class="form-text">
                {{ form.name.length }}/100 caracteres
              </div>
            </div>

            <!-- Descripción -->
            <div class="mb-3">
              <label for="taskDescription" class="form-label">Descripción</label>
              <textarea 
                class="form-control"
                :class="{ 'is-invalid': errors.description }"
                id="taskDescription"
                v-model="form.description"
                rows="3"
                placeholder="Describe los detalles de la tarea..."
                maxlength="500"
                :disabled="loading"
              ></textarea>
              <div v-if="errors.description" class="invalid-feedback">
                {{ errors.description }}
              </div>
              <div class="form-text">
                {{ (form.description || '').length }}/500 caracteres
              </div>
            </div>

            <!-- Tipo y Prioridad -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="taskType" class="form-label">
                  Tipo <span class="text-danger">*</span>
                </label>
                <select 
                  class="form-select"
                  :class="{ 'is-invalid': errors.type }"
                  id="taskType"
                  v-model="form.type"
                  required
                  :disabled="loading"
                >
                  <option value="">Selecciona un tipo</option>
                  <option 
                    v-for="type in TASK_TYPES" 
                    :key="type" 
                    :value="type"
                  >
                    {{ type }}
                  </option>
                </select>
                <div v-if="errors.type" class="invalid-feedback">
                  {{ errors.type }}
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="taskPriority" class="form-label">Prioridad</label>
                <select 
                  class="form-select"
                  :class="{ 'is-invalid': errors.priority }"
                  id="taskPriority"
                  v-model="form.priority"
                  :disabled="loading"
                >
                  <option 
                    v-for="priority in TASK_PRIORITIES" 
                    :key="priority" 
                    :value="priority"
                  >
                    {{ priority.charAt(0).toUpperCase() + priority.slice(1) }}
                  </option>
                </select>
                <div v-if="errors.priority" class="invalid-feedback">
                  {{ errors.priority }}
                </div>
              </div>
            </div>

            <!-- Fecha límite -->
            <div class="mb-3">
              <label for="taskDeadline" class="form-label">Fecha límite</label>
              <input 
                type="datetime-local" 
                class="form-control"
                :class="{ 'is-invalid': errors.deadline }"
                id="taskDeadline"
                v-model="form.deadline"
                :min="minDateTime"
                :disabled="loading"
              >
              <div v-if="errors.deadline" class="invalid-feedback">
                {{ errors.deadline }}
              </div>
              <div class="form-text">
                Opcional. La fecha debe ser futura.
              </div>
            </div>

            <!-- Estado completado (solo en edición) -->
            <div v-if="isEditing" class="mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="taskCompleted"
                  v-model="form.completed"
                  :disabled="loading"
                >
                <label class="form-check-label" for="taskCompleted">
                  Marcar como completada
                </label>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="handleCancel"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="handleSubmit"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status">
              <span class="visually-hidden">Guardando...</span>
            </span>
            <i v-else :class="`bi bi-${isEditing ? 'check-lg' : 'plus-lg'} me-1`"></i>
            {{ isEditing ? 'Actualizar' : 'Crear' }} Tarea
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Backdrop -->
  <div 
    v-if="show" 
    class="modal-backdrop fade show"
    @click="handleCancel"
  ></div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskType, TaskPriority } from '@/types/Task'
import { TASK_TYPES, TASK_PRIORITIES } from '@/types/Task'

// Props
interface Props {
  show: boolean
  task?: Task | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  task: null,
  loading: false
})

// Emits
interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'save-task', data: CreateTaskRequest | UpdateTaskRequest): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

// Form data
const form = reactive({
  name: '',
  description: '',
  type: '' as TaskType | '',
  priority: 'media' as TaskPriority,
  deadline: '',
  completed: false
})

// Validation errors
const errors = reactive({
  name: '',
  description: '',
  type: '',
  priority: '',
  deadline: ''
})

// Computed properties
const isEditing = computed(() => !!props.task)

const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})

const isFormValid = computed(() => {
  return form.name.trim() !== '' && 
         form.type !== '' && 
         !Object.values(errors).some(error => error !== '')
})

// Methods
const resetForm = () => {
  form.name = ''
  form.description = ''
  form.type = '' as TaskType | ''
  form.priority = 'media'
  form.deadline = ''
  form.completed = false
  
  // Clear errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const loadTaskData = (task: Task) => {
  form.name = task.name
  form.description = task.description || ''
  form.type = task.type
  form.priority = task.priority
  form.deadline = task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ''
  form.completed = task.completed
}

const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Validate name
  if (!form.name.trim()) {
    errors.name = 'El nombre es obligatorio'
    isValid = false
  } else if (form.name.length > 100) {
    errors.name = 'El nombre no puede exceder 100 caracteres'
    isValid = false
  }

  // Validate description
  if (form.description && form.description.length > 500) {
    errors.description = 'La descripción no puede exceder 500 caracteres'
    isValid = false
  }

  // Validate type
  if (!form.type) {
    errors.type = 'El tipo es obligatorio'
    isValid = false
  }

  // Validate deadline
  if (form.deadline) {
    const deadlineDate = new Date(form.deadline)
    const now = new Date()
    
    if (deadlineDate <= now) {
      errors.deadline = 'La fecha límite debe ser futura'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  const taskData: CreateTaskRequest | UpdateTaskRequest = {
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    type: form.type as TaskType,
    priority: form.priority,
    deadline: form.deadline || undefined
  }

  if (isEditing.value) {
    (taskData as UpdateTaskRequest).completed = form.completed
  }

  emit('save-task', taskData)
}

const handleCancel = () => {
  if (props.loading) return
  
  emit('update:show', false)
  emit('cancel')
}

// Watchers
watch(() => props.show, (newShow) => {
  if (newShow) {
    if (props.task) {
      loadTaskData(props.task)
    } else {
      resetForm()
    }
    
    // Focus on name input
    nextTick(() => {
      const nameInput = document.getElementById('taskName') as HTMLInputElement
      if (nameInput) {
        nameInput.focus()
      }
    })
  }
})

watch(() => props.task, (newTask) => {
  if (newTask && props.show) {
    loadTaskData(newTask)
  }
})

// Prevent body scroll when modal is open
watch(() => props.show, (show) => {
  if (show) {
    document.body.classList.add('modal-open')
    document.body.style.paddingRight = '17px' // Compensate for scrollbar
  } else {
    document.body.classList.remove('modal-open')
    document.body.style.paddingRight = ''
  }
})
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}

.modal.show {
  display: block !important;
}

.modal-dialog {
  margin: 1.75rem auto;
  max-width: 600px;
}

.modal-content {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border-radius: 0.5rem 0.5rem 0 0;
}

.modal-header .btn-close {
  filter: invert(1);
}

.modal-title {
  font-weight: 600;
}

.form-label {
  font-weight: 500;
  color: #495057;
}

.form-control,
.form-select {
  border-radius: 0.375rem;
  border: 1px solid #ced4da;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-text {
  font-size: 0.8rem;
  color: #6c757d;
}

.text-danger {
  color: #dc3545 !important;
}

.invalid-feedback {
  font-size: 0.8rem;
}

.btn {
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:disabled {
  transform: none;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Animations */
.modal.show .modal-dialog {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 576px) {
  .modal-dialog {
    margin: 0.5rem;
    max-width: none;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}
</style>