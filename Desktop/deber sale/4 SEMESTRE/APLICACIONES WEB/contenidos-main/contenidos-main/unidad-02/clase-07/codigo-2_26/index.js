const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;

app.use(express.json());

// Base de datos simulada
let productos = [
  { id: 1, nombre: 'Laptop', precio: 900 },
  { id: 2, nombre: 'Teléfono', precio: 500 }
];

// Validaciones reutilizables
const validarProducto = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
];

// Middleware para manejar errores de validación
function manejarErrores(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
}

// GET - Listar productos
app.get('/productos', (req, res) => {
  res.json(productos);
});

// POST - Crear producto
app.post('/productos', validarProducto, manejarErrores, (req, res) => {
  const nuevoProducto = req.body;
  nuevoProducto.id = productos.length + 1;
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// PUT - Actualizar producto
app.put('/productos/:id', validarProducto, manejarErrores, (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
  productos[index] = { id, ...req.body };
  res.json(productos[index]);
});

// DELETE - Eliminar producto
app.delete('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const existe = productos.some(p => p.id === id);
  if (!existe) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
  productos = productos.filter(p => p.id !== id);
  res.status(204).send(); // No Content
});

// Middleware global de manejo de errores internos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
