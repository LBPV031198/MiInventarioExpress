const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');

const router = express.Router();

// Validaciones para crear tarea
const createTaskValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('type')
    .notEmpty()
    .withMessage('El tipo es obligatorio')
    .isIn(['Universidad', 'Casa', 'Trabajo', 'Personal'])
    .withMessage('El tipo debe ser: Universidad, Casa, Trabajo o Personal'),
  
  body('priority')
    .optional()
    .isIn(['alta', 'media', 'baja'])
    .withMessage('La prioridad debe ser: alta, media o baja'),
  
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('La fecha límite debe ser una fecha válida')
    .custom((value) => {
      if (value && new Date(value) <= new Date()) {
        throw new Error('La fecha límite debe ser futura');
      }
      return true;
    }),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('El estado completado debe ser verdadero o falso')
];

// Validaciones para actualizar tarea
const updateTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de tarea inválido'),
  
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('type')
    .optional()
    .isIn(['Universidad', 'Casa', 'Trabajo', 'Personal'])
    .withMessage('El tipo debe ser: Universidad, Casa, Trabajo o Personal'),
  
  body('priority')
    .optional()
    .isIn(['alta', 'media', 'baja'])
    .withMessage('La prioridad debe ser: alta, media o baja'),
  
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('La fecha límite debe ser una fecha válida')
    .custom((value) => {
      if (value && new Date(value) <= new Date()) {
        throw new Error('La fecha límite debe ser futura');
      }
      return true;
    }),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('El estado completado debe ser verdadero o falso')
];

// Validaciones para obtener tarea por ID
const getTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de tarea inválido')
];

// Validaciones para eliminar tarea
const deleteTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de tarea inválido')
];

// Validaciones para filtros de consulta
const getTasksValidation = [
  query('type')
    .optional()
    .isIn(['Universidad', 'Casa', 'Trabajo', 'Personal'])
    .withMessage('El tipo debe ser: Universidad, Casa, Trabajo o Personal'),
  
  query('priority')
    .optional()
    .isIn(['alta', 'media', 'baja'])
    .withMessage('La prioridad debe ser: alta, media o baja'),
  
  query('completed')
    .optional()
    .isBoolean()
    .withMessage('El estado completado debe ser verdadero o falso'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'createdAt', 'updatedAt', 'deadline', 'priority'])
    .withMessage('El campo de ordenamiento no es válido'),
  
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('El orden debe ser asc o desc')
];

// Rutas
router.route('/')
  .get(getTasksValidation, getTasks)
  .post(createTaskValidation, createTask);

router.route('/stats')
  .get(getTaskStats);

router.route('/:id')
  .get(getTaskValidation, getTask)
  .put(updateTaskValidation, updateTask)
  .delete(deleteTaskValidation, deleteTask);

module.exports = router;