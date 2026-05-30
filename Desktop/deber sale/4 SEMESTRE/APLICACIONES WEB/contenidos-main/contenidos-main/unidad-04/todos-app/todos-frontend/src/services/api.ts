import type { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilters, 
  ApiResponse, 
  TaskStats 
} from '@/types/Task';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  // Obtener todas las tareas con filtros opcionales
  async getTasks(filters?: TaskFilters): Promise<ApiResponse<Task[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<Task[]>(endpoint);
  }

  // Obtener una tarea por ID
  async getTask(id: string): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`);
  }

  // Crear nueva tarea
  async createTask(task: CreateTaskRequest): Promise<ApiResponse<Task>> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  // Actualizar tarea existente
  async updateTask(id: string, task: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  // Eliminar tarea
  async deleteTask(id: string): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Marcar tarea como completada/incompleta
  async toggleTaskCompletion(id: string, completed: boolean): Promise<ApiResponse<Task>> {
    return this.updateTask(id, { completed });
  }

  // Obtener estadísticas de tareas
  async getTaskStats(): Promise<ApiResponse<TaskStats>> {
    return this.request<TaskStats>('/tasks/stats');
  }

  // Verificar estado de la API
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      throw new Error('API no disponible');
    }
  }
}

// Crear instancia singleton del servicio API
export const apiService = new ApiService();

// Exportar también la clase para casos especiales
export default ApiService;

// Utilidades adicionales para manejo de errores
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
};

// Hook personalizado para manejo de estados de carga
export const createLoadingState = () => {
  return {
    loading: false,
    error: null as string | null,
    setLoading: (loading: boolean) => ({ loading, error: null }),
    setError: (error: string) => ({ loading: false, error }),
    setSuccess: () => ({ loading: false, error: null }),
  };
};

// Interceptor para logging en desarrollo
if (import.meta.env.DEV) {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    console.log('🌐 API Request:', args[0]);
    const response = await originalFetch(...args);
    console.log('📡 API Response:', response.status, response.statusText);
    return response;
  };
}