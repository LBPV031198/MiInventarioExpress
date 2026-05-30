const mongoose = require('mongoose');

const carreraSchema = new mongoose.Schema({
  nombre: String,
  duracion: Number // en años
});

module.exports = mongoose.model('Carrera', carreraSchema);