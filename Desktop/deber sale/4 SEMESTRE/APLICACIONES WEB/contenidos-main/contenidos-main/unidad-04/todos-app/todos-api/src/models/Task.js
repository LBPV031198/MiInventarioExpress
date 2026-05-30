const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la tarea es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  type: {
    type: String,
    required: [true, 'El tipo de tarea es obligatorio'],
    enum: {
      values: ['Universidad', 'Casa', 'Trabajo', 'Personal'],
      message: 'El tipo debe ser: Universidad, Casa, Trabajo o Personal'
    }
  },
  priority: {
    type: String,
    required: [true, 'La prioridad es obligatoria'],
    enum: {
      values: ['alta', 'media', 'baja'],
      message: 'La prioridad debe ser: alta, media o baja'
    },
    default: 'media'
  },
  deadline: {
    type: Date,
    validate: {
      validator: function(value) {
        // Si se proporciona una fecha límite, debe ser futura
        return !value || value > new Date();
      },
      message: 'La fecha límite debe ser futura'
    }
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para mejorar el rendimiento
taskSchema.index({ type: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ completed: 1 });
taskSchema.index({ deadline: 1 });

// Método estático para obtener estadísticas
taskSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: ['$completed', 1, 0] } },
        pending: { $sum: { $cond: ['$completed', 0, 1] } },
        byType: {
          $push: {
            type: '$type',
            priority: '$priority',
            completed: '$completed'
          }
        }
      }
    }
  ]);
};

// Método de instancia para marcar como completada
taskSchema.methods.markAsCompleted = function() {
  this.completed = true;
  return this.save();
};

module.exports = mongoose.model('Task', taskSchema);