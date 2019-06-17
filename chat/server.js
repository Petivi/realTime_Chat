const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');

var app = express();
app.use(express.static('static'));
var server = app.listen(3000);
var io = socketio(server);

io.on('connection', client => {
    client.on('sendMessage', data => {
        io.emit('event', data);
    });
});