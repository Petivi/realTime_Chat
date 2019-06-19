var btnValiderConnection = document.getElementById('btn-valider-connection');
var pseudo = document.getElementById('pseudo');
var room = document.getElementById('room');
var divInfosRooms = document.getElementById('divInfosRooms');
var divInfosUser = document.getElementById('divInfosUser');
var message = document.getElementById('message');
var affichage = document.getElementById('affichage');
var roomNameTitle = document.getElementById('roomNameTitle');
var contentMessage = document.getElementById('contentMessage');
var btnSendMsg = document.getElementById('btn-send-msg');
var btnLeave = document.getElementById('btnLeave');
var classSender = "";
var listRooms = document.getElementById('listRooms');
var listUsers = document.getElementById('listUsers');

btnValiderConnection.addEventListener('click', (e) => {
    if (pseudo.value != "" && room.value != "") {
        connectToRoom();
    }
});

room.addEventListener('keyup', (e) => {
    if (e.keyCode === 13 && pseudo.value != "" && room.value != "") {
        connectToRoom();
    }
});

pseudo.addEventListener('keyup', (e) => {
    if (e.keyCode === 13 && pseudo.value != "" && room.value != "") {
        connectToRoom();
    }
});

btnSendMsg.addEventListener('click', (e) => {
    sendMessage();
});

message.addEventListener('keydown', (e) => {
    let value = message.value;
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    console.log(numberOfLineBreaks)
    if (e.keyCode === 13) {
        sendMessage();
    }
});

socket.on('event', (data) => {
    affichage.innerHTML += '<br><strong>' + data.pseudo + '</strong> : ' + data.text; // message
});

socket.on('roomJoin', (data) => {
    roomNameTitle.innerHTML = '<strong> Room Name : ' + data.room + '</strong>'; // affichage nom room
    displayInfoRoom(data);
});

socket.on('userJoin', (data) => {
    displayInfoRoom(data);
});

socket.on('userLeave', (data) => {
    displayInfoRoom(data);
});

socket.on('updateListUsers', (data) => {
    listUsers.innerHTML = "";
    data.forEach(function(tab) {
        var li = document.createElement('li');
        li.innerHTML = tab;
        listUsers.appendChild(li);
    });
});

socket.on('roomsInfo', (data) => {
    data.forEach(function(tab) {
        var li = document.createElement('li');
        li.innerHTML = tab.name + " (" + tab.users.length + ")";
        listRooms.appendChild(li);
    });
});

function displayInfoRoom(data) {
    affichage.innerHTML += '<br><strong>' + data.text + '</strong>'; // affichage user join room
}

function connectToRoom() {
    socket.emit('connectToRoom', {
        pseudo: pseudo.value,
        room: room.value
    });
    divInfosRooms.style.display = 'none';
    divInfosUser.style.display = 'none';
    contentMessage.style.display = 'block';
}

function sendMessage() {
    if (message.value !== '') {
        socket.emit('sendMessage', message.value);
        message.value = '';
    }
}