const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
    console.log('Nuevo usuario:', socket.id);

    // Recibir mensaje del cliente y retransmitirlo a los demás
    socket.on('chatMensaje', mensaje => {
        socket.broadcast.emit('chatMensaje', `Otro usuario dice: ${mensaje}`);
    });
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
