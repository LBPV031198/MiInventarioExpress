const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
    console.log('Cliente conectado:', socket.id);

    socket.on('mensajeCliente', msg => {
        console.log('Mensaje recibido:', msg);
        socket.emit('mensajeServidor', `Servidor recibió: ${msg}`);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});