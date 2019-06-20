const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const questionRoutes = require('./routes/question');
const { getQuestions } = require('./queries/question');
const bodyParser = require('body-parser');



var app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

var server = app.listen(3000, '25.64.228.167', () => {
    console.log('serveur ecoutant sur le port 3000...')
});
/* var server = app.listen(3000, () => {
    console.log('serveur ecoutant sur le port 3000...')
}); */
var io = socketio(server);
var ttRoom = [];
var quizzQuestions = [];

mongoose.connect(
    'mongodb://localhost:27017/chat_db',
    {
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(res => {
        console.log('MongoDB connected');

        questionRoutes(app);
        getQuestions().then(res => {
            quizzQuestions = res;
        });
    });

io.on('connection', client => {
    // PARTIE CHAT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    client.emit('roomInfos', ttRoom);
    client.on('connectToRoom', data => {
        var addUserToRoom = true;
        client.pseudo = data.pseudo;


        let room = ttRoom.find(room => room.name === data.room)
        let newUser = { pseudo: data.pseudo, id: client.id, animateur: false, score: 0 };
        if (room) { //si la salle existe déjà on ajout juste le mec dedans
            let pseudoTaken = room.users.find(pseudoTaken => pseudoTaken.pseudo === client.pseudo);
            if (pseudoTaken) {
                addUserToRoom = false;
            } else {
                room.users.push(newUser);
            }
        } else {
            room = { name: data.room, firstResponse: true, users: [newUser] }
            ttRoom.push(room);
        }

        if (addUserToRoom) {
            client.room = data.room;
            client.join(client.room); // on rejoint / créé la room choisie
            io.to(client.id).emit('roomJoin', { room: client.room, text: "You joined the room !" }); // affichage pour le sender
            client.to(client.room).emit('userJoin', { text: client.pseudo + " joined the room !" }); // affichage pour les autres
            io.to(client.room).emit('updateListUsers', room.users);
            io.emit('roomInfos', ttRoom);
        }

        client.on('leaveRoom', data => {
          disconnectUser();
        });
    });

    client.on('sendMessage', data => {
        io.to(client.id).emit('event', { pseudo: '<span class="colorSender">' + client.pseudo + '</span>', text: data }); // affichage pour le sender
        client.to(client.room).emit('event', { pseudo: client.pseudo, text: data }); // affichage pour les autres
    });

    client.on('disconnect', () => {
        disconnectUser();
    });
    // FIN PARTIE CHAT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // PARTIE JEU !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    client.on('hideBtnDevenirAnimateur', () => {
        io.to(client.room).emit('hideBtnDevenirAnimateur');
    });

    client.on('displayReponses', (data) => {
        let seconde = 3;
        io.to(client.room).emit('getReady', seconde);
        let getReadyInterval = setInterval(() => {
            seconde--;
            if (seconde > 0) {
                io.to(client.room).emit('getReady', seconde);
            } else {
                io.to(client.room).emit('displayReponses', data);
                clearInterval(getReadyInterval);
                seconde = 20;
                io.to(client.room).emit('tempsReponse', seconde);
                let tempsReponseInterval = setInterval(() => {
                    seconde--;
                    if (seconde > 0) {
                        io.to(client.room).emit('tempsReponse', seconde); // on renvoit juste le temps qui defile
                    } else {
                        clearInterval(tempsReponseInterval);
                        let room = ttRoom.find(r => r.name === client.room);
                        io.to(client.room).emit('finReponse', room.users);
                    }
                }, 1000);
            }
        }, 1000);
    });

    client.on('checkAnimateur', (callback) => { // cette callback permet de repondre directement a l'emit du client
        let room = ttRoom.find(room => room.name === client.room);
        if(room) {
            if (room.users.find(u => u.animateur)) {
                callback(true);
            } else {
                callback(false);
            }
        }
    });

    client.on('setNewAnimateur', (callback) => {
        let room = ttRoom.find(room => room.name === client.room);
        if (!room.users.find(u => u.animateur)) {
            let user = room.users.find(u => u.id === client.id);
            user.animateur = true;
            io.to(client.room).emit('updateListUsers', room.users);
            callback(true) //on renvoi a l'utilisateur qu'il est bien animateur
        }
        callback(false);
    });

    client.on('setResponse', bonneReponse => {
        let room = ttRoom.find(r => r.name === client.room);
        if (room) {
            let user = room.users.find(u => u.id === client.id);
            if (user) {
                if (bonneReponse) {
                    if (room.firstResponse) {
                        room.firstResponse = false;
                        user.score += 3;
                    } else {
                        user.score += 2
                    }
                } else {
                    user.score--;
                }
            }
        }
    });


    // FIN PARTIE JEU !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    function disconnectUser(){
      client.to(client.room).emit('userLeave', { text: client.pseudo + ' left the room !' });
      client.leave(client.room); // Pas sur que ça marche :o
      var roomFound = ttRoom.find(function (tab) {
          return tab.name === client.room; // on récupère le nom de la room
      });


      if (typeof roomFound !== 'undefined') {
          var roomUsersToDelete = roomFound.users.find(function (tabUsers) {
              return tabUsers.id === client.id; // on récupère le nom du user à delete
          });
          for (var i = 0; i < roomFound.users.length; i++) {
              if (roomFound.users[i] === roomUsersToDelete) { // si on trouve l'utilisateur
                  roomFound.users.splice(i, 1); // on le supprime de la liste
              }
          }
          io.to(client.room).emit('updateListUsers', roomFound.users);
      }
      io.emit('roomInfos', ttRoom);
      io.to(client.id).emit('roomLeft',);
      io.to(client.id).emit('updateListUsers', []);
    }
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
