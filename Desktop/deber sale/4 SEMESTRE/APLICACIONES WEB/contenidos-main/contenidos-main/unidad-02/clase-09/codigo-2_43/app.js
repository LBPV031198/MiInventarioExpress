const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// Validación de tipo y tamaño
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Archivo no permitido'));
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

app.use(express.static('public'));

app.post('/upload', upload.single('foto'), (req, res) => {
    if (!req.file) return res.status(400).send('Archivo no recibido.');
    res.send(`Imagen cargada exitosamente: ${req.file.filename}`);
});

app.listen(3000, () => console.log('Servidor iniciado en http://localhost:3000'))