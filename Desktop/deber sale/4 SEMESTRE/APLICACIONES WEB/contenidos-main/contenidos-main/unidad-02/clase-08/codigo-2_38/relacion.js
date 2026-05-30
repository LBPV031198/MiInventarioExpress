const mongoose = require('mongoose');
const Estudiante = require('./models/Estudiante');
const Carrera = require('./models/Carrera');

async function relacionar() {
  await mongoose.connect('mongodb://localhost:27017/universidad');

  // 1. Crear una carrera
  const nuevaCarrera = await Carrera.create({
    nombre: 'Ingeniería Informática',
    duracion: 5
  });

  // 2. Crear estudiante relacionado con la carrera
  const nuevoEstudiante = await Estudiante.create({
    nombre: 'Elena',
    edad: 21,
    carrera: nuevaCarrera._id
  });

  // 3. Obtener estudiante con carrera poblada
  const resultado = await Estudiante.findOne({ nombre: 'Elena' }).populate('carrera');

  console.log('Estudiante con carrera:');
  console.log(resultado);

  await mongoose.disconnect();
}

relacionar().catch(console.error);
