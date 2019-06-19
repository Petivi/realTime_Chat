const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const questionRoutes = require('./routes/question');
const bodyParser = require('body-parser');



var app = express();
app.use(express.static('static'));
app.use(bodyParser.json());
mongoose.connect(
    'mongodb://localhost:27017/chat_db',
    {
        useNewUrlParser: true,
        useFindAndModify: false
    }
).then(res => {
    console.log('MongoDB connected');

    questionRoutes(app);
    console.log(questionRoutes);
});

var server = app.listen(3000, () => {
  console.log('serveur ecoutant sur le port 3000...')
});
var io = socketio(server);
var ttRoom = [];


io.on('connection', client => {
    // PARTIE CHAT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    client.emit('roomsInfo', ttRoom);
    client.on('connectToRoom', data => {
        client.pseudo = data.pseudo;
        client.room = data.room;
        let room = ttRoom.find(room => room.name === data.room)
        if (room) { //si la salle existe déjà on ajout juste le mec dedans
            room.users.push(data.pseudo);
        } else {
            room = { name: data.room, users: [data.pseudo] }
            ttRoom.push(room);
        }

        client.join(client.room); // on rejoint / créé la room choisie
        io.to(client.id).emit('roomJoin', { room: client.room, text: "You joined the room !" }); // affichage pour le sender
        client.to(client.room).emit('userJoin', { text: client.pseudo + " joined the room !" }); // affichage pour les autres
        io.to(client.room).emit('updateListUsers', room.users);
    });

    client.on('sendMessage', data => {
        io.to(client.id).emit('event', { pseudo: '<span class="colorSender">' + client.pseudo + '</span>', text: data }); // affichage pour le sender
        client.to(client.room).emit('event', { pseudo: client.pseudo, text: data }); // affichage pour les autres
    });

    client.on('disconnect', () => {
        client.to(client.room).emit('userLeave', { text: client.pseudo + ' left the room !' });
        client.leave(client.room); // Pas sur que ça marche :o
        var roomFound = ttRoom.find(function(tab) {
            return tab.name === client.room; // on récupère le nom de la room
        });


        if (typeof roomFound !== 'undefined') {
            var roomUsersToDelete = roomFound.users.find(function(tabUsers) {
                return tabUsers === client.pseudo; // on récupère le nom du user à delete
            });
            for (var i = 0; i < roomFound.users.length; i++) {
                if (roomFound.users[i] === roomUsersToDelete) { // si on trouve l'utilisateur
                    roomFound.users.splice(i, 1); // on le supprime de la liste
                }
            }
            io.to(client.room).emit('updateListUsers', roomFound.users);
        }
    });
    // FIN PARTIE CHAT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // PARTIE JEU !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    client.on('newJoueur', () => {
        console.log(client.room)
    });


    // FIN PARTIE JEU !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
