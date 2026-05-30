const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// @desc    Obtener todas las tareas
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
  try {
    const { type, priority, completed, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Construir filtros
    const filter = {};
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (completed !== undefined) filter.completed = completed === 'true';
    
    // Construir ordenamiento
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };
    
    const tasks = await Task.find(filter).sort(sortOptions);
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener las tareas'
    });
  }
};

// @desc    Obtener una tarea por ID
// @route   GET /api/tasks/:id
// @access  Public
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error obteniendo tarea:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de tarea inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener la tarea'
    });
  }
};

// @desc    Crear nueva tarea
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }
    
    const task = await Task.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: task
    });
  } catch (error) {
    console.error('Error creando tarea:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error del servidor al crear la tarea'
    });
  }
};

// @desc    Actualizar tarea
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: task
    });
  } catch (error) {
    console.error('Error actualizando tarea:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de tarea inválido'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error del servidor al actualizar la tarea'
    });
  }
};

// @desc    Eliminar tarea
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente',
      data: task
    });
  } catch (error) {
    console.error('Error eliminando tarea:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de tarea inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error del servidor al eliminar la tarea'
    });
  }
};

// @desc    Obtener estadísticas de tareas
// @route   GET /api/tasks/stats
// @access  Public
const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.getStats();
    
    res.json({
      success: true,
      data: stats[0] || {
        total: 0,
        completed: 0,
        pending: 0,
        byType: []
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener estadísticas'
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};