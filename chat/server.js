const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');

var app = express();
app.use(express.static('static'));
var server = app.listen(3000, () => {
    console.log('serveur ecoutant sur le port 3000...')
});
var io = socketio(server);

io.on('connection', client => {
    client.on('connectToRoom', data => {
        client.pseudo = data.pseudo;
        client.room = data.room;

        client.join(client.room);
    });

    client.on('sendMessage', data => {
        io.emit('event', { pseudo: client.pseudo, text: data });
    });
});
