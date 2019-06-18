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

        client.join(client.room); // on rejoint / créé la room choisie
        io.to(client.id).emit('roomJoin', { room: client.room, text: "You joined the room !" }); // affichage pour le sender
        client.to(client.room).emit('userJoin', {text:client.pseudo + " joined the room !"}); // affichage pour les autres
    });

    client.on('sendMessage', data => {
        io.to(client.id).emit('event', { pseudo: '<span class="colorSender">'+client.pseudo+'</span>', text: data }); // affichage pour le sender
        client.to(client.room).emit('event', { pseudo: client.pseudo, text: data }); // affichage pour les autres
    });
});



/*
CHEAT SHEET : https://socket.io/docs/emit-cheatsheet/

// Le serveur parle :
io.to(client.id).emit()... -> pour envoyer uniquement au sender (à soi-même)
io.emit()... -> pour envoyer à tous le monde

// Le client parle (par l'intermédiaire du serveur) :
client.to(client.room).emit()... -> pour envoyer à une room (ou plusieurs) mais pas au sender
client.broadcast.emit()... -> pour envoyer à tous le monde sauf au sender (quand il n'y a pas de room)

*/
