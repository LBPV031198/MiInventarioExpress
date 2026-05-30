const mongoose = require('mongoose');
const Estudiante = require('./models/Estudiante');

async function main() {
  await mongoose.connect('mongodb://localhost:27017/universidad', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log('Conectado a MongoDB');

  // 1. Crear
  const nuevo = await Estudiante.create({
    nombre: 'Sofía',
    edad: 21,
    carrera: 'Psicología'
  });
  console.log('Creado:', nuevo);

  // 2. Leer
  const todos = await Estudiante.find();
  console.log('Todos:', todos);

  // 3. Actualizar
  const actualizado = await Estudiante.findOneAndUpdate(
    { nombre: 'Sofía' },
    { edad: 23 },
    { new: true }
  );
  console.log('Actualizado:', actualizado);

  // 4. Eliminar
  const eliminado = await Estudiante.findOneAndDelete({ nombre: 'Sofía' });
  console.log('Eliminado:', eliminado);

  await mongoose.disconnect();
  console.log('Desconectado de MongoDB');
}

main().catch(err => console.error('Error:', err));
