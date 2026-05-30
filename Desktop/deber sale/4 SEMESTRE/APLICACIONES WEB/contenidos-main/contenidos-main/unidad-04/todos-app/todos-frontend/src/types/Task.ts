export interface Task {
  id: string;
  name: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  deadline?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskType = 'Universidad' | 'Casa' | 'Trabajo' | 'Personal';

export type TaskPriority = 'alta' | 'media' | 'baja';

export interface CreateTaskRequest {
  name: string;
  description?: string;
  type: TaskType;
  priority?: TaskPriority;
  deadline?: string;
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  type?: TaskType;
  priority?: TaskPriority;
  deadline?: string;
  completed?: boolean;
}

export interface TaskFilters {
  type?: TaskType;
  priority?: TaskPriority;
  completed?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'deadline' | 'priority';
  order?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  errors?: string[];
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  byType: Array<{
    type: TaskType;
    priority: TaskPriority;
    completed: boolean;
  }>;
}

// Constantes para los tipos y prioridades
export const TASK_TYPES: TaskType[] = ['Universidad', 'Casa', 'Trabajo', 'Personal'];

export const TASK_PRIORITIES: TaskPriority[] = ['alta', 'media', 'baja'];

// Utilidades para trabajar con tareas
export const getTaskTypeColor = (type: TaskType): string => {
  const colors = {
    Universidad: 'primary',
    Casa: 'success',
    Trabajo: 'warning',
    Personal: 'info'
  };
  return colors[type];
};

export const getTaskPriorityColor = (priority: TaskPriority): string => {
  const colors = {
    alta: 'danger',
    media: 'warning',
    baja: 'secondary'
  };
  return colors[priority];
};

export const getTaskTypeIcon = (type: TaskType): string => {
  const icons = {
    Universidad: 'mortarboard-fill',
    Casa: 'house-fill',
    Trabajo: 'briefcase-fill',
    Personal: 'person-fill'
  };
  return icons[type];
};

export const getTaskPriorityIcon = (priority: TaskPriority): string => {
  const icons = {
    alta: 'exclamation-triangle-fill',
    media: 'dash-circle-fill',
    baja: 'circle-fill'
  };
  return icons[priority];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.deadline || task.completed) return false;
  return new Date(task.deadline) < new Date();
};