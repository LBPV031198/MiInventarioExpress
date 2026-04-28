const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Producto = require('../models/Producto');

// Configuración de Multer para guardar imágenes en la carpeta uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Usamos la fecha para que el nombre sea único
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// RUTA: Mostrar todos los productos
router.get('/', async (req, res) => {
    try {
        // .lean() es clave para que Handlebars pueda leer los datos de Mongo
        const misProductos = await Producto.find().lean();
        res.render('index', { productos: misProductos });
    } catch (err) {
        res.status(500).send('Error al cargar productos');
    }
});

// RUTA: Ver el formulario de creación
router.get('/nuevo', (req, res) => {
    res.render('crear');
});

// RUTA: Guardar el producto con la imagen
router.post('/guardar', upload.single('imagen'), async (req, res) => {
    try {
        // --- PEQUEÑO AJUSTE AQUÍ ---
        // Convertimos el precio a número para que en la base de datos no se guarde como texto
        const { nombre, precio, descripcion } = req.body;
        
        const nuevoProd = new Producto({
            nombre: nombre,
            precio: Number(precio), // Aseguramos que sea número
            descripcion: descripcion,
            imagen: req.file ? req.file.filename : 'default.jpg' // Si no sube foto, ponemos una por defecto
        });

        await nuevoProd.save();
        console.log('Producto guardado con éxito');
        res.redirect('/productos');
    } catch (err) {
        console.log("Error al guardar:", err);
        res.send('Error al guardar el producto');
    }
});

// --- RUTA EXTRA: ELIMINAR (Por si te la pide el profe) ---
router.get('/eliminar/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.redirect('/productos');
    } catch (err) {
        res.send('No se pudo eliminar');
    }
});

module.exports = router;