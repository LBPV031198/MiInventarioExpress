const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Ruta para ver los productos en la tabla
router.get('/', async (req, res) => {
    const todosLosProductos = await Producto.find().lean();
    res.render('index', { productos: todosLosProductos });
});

// Ruta para guardar un repuesto nuevo
router.post('/agregar', async (req, res) => {
    const nuevoArticulo = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        imagen: req.file ? req.file.filename : 'sin-foto.jpg'
    });
    await nuevoArticulo.save();
    res.redirect('/');
});

module.exports = router;