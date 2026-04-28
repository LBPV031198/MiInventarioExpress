require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('hbs');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- CONFIGURACIÓN DEL MOTOR DE PLANTILLAS (HBS) ---
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// --- MIDDLEWARES ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Para que se vean las fotos

// --- CONEXIÓN A MONGO (Usando la variable del .env) ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a la base de datos... listo para trabajar'))
    .catch(err => console.log('Error al conectar Mongo:', err));

// --- RUTAS ---
const productoRoutes = require('./routes/productoRoutes');
app.use('/productos', productoRoutes);

// Si entro a la página principal, que me mande directo al inventario
app.get('/', (req, res) => {
    res.redirect('/productos');
});

// --- CONFIGURACIÓN DE SOCKET.IO ---
io.on('connection', (socket) => {
    console.log('Alguien se conectó al servidor');
});

// --- ENCENDER EL SERVIDOR ---
const PUERTO = process.env.PORT || 3000;
server.listen(PUERTO, () => {
    console.log('Servidor corriendo en: http://localhost:' + PUERTO);
    console.log('Socket.io activo');
});