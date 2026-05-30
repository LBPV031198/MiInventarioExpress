const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
  nombre: String,
  edad: Number,
  carrera: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carrera'
  }
});

module.exports = mongoose.model('Estudiante', estudianteSchema);