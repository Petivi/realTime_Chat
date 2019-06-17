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
    client.on('chosePseudo', data => {
        client.pseudo = data;
    });

    client.on('sendMessage', data => {
        io.emit('event', { pseudo: client.pseudo, text: data });
    });
});