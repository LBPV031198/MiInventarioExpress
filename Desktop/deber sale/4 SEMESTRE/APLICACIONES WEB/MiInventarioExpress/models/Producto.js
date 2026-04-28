const mongoose = require('mongoose');

// Este es el esquema para guardar los productos del inventario
const productoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    precio: { 
        type: Number, 
        required: true 
    },
    descripcion: { 
        type: String 
    },
    imagen: { 
        type: String // Aquí se guarda el nombre del archivo que sube multer
    }
});

// Lo exportamos como 'Producto'
module.exports = mongoose.model('Producto', productoSchema);
