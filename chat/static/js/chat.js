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


btnValiderConnection.addEventListener('click', (e) => {
    if (pseudo.value != "" && room.value != "") {
        connectToRoom(pseudo.value, room.value);
    }
});

room.addEventListener('keyup', (e) => {
    if (e.keyCode === 13 && pseudo.value != "" && room.value != "") {
        connectToRoom(pseudo.value, room.value);
    }
});

pseudo.addEventListener('keyup', (e) => {
    if (e.keyCode === 13 && pseudo.value != "" && room.value != "") {
        connectToRoom(pseudo.value, room.value);
    }
});

btnSendMsg.addEventListener('click', (e) => {
    sendMessage();
});

message.addEventListener('keyup', (e) => { // laisser keyup pour eviter que la zone de text prenne un /n dans sa mere
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
    utilisateur.pseudo = pseudo.value;
    utilisateur.room = room.value;
    setQpcMenu();
    divInfosRooms.style.display = 'none';
    divInfosUser.style.display = 'none';
    contentMessage.style.display = 'block';
    roomNameTitle.innerHTML = '<strong> Room Name : ' + data.room + '</strong>'; // affichage nom room
    displayInfoRoom(data);
});

socket.on('userJoin', (data) => {
    displayInfoRoom(data);
});

socket.on('userLeave', (data) => {
    displayInfoRoom(data);
});

socket.on('roomsInfo', (data) => {
    listRooms.innerHTML = "";
    data.forEach(function(tab) {
        var li = document.createElement('li');
        li.innerHTML = '<a href="#" id="'+tab.name+'">'+tab.name + " (" + tab.users.length + ")"+'</a>';
        listRooms.appendChild(li);

        var roomId = document.getElementById(tab.name);
        roomId.addEventListener('click', (e) => {
            if(pseudo.value != ""){
              connectToRoom(pseudo.value, roomId.id);
            }
        });
    });
});

function displayInfoRoom(data) {
    affichage.innerHTML += '<br><strong>' + data.text + '</strong>'; // affichage user join room
}

function connectToRoom(pseudo, room) {
    socket.emit('connectToRoom', {
        pseudo: pseudo,
        room: room
    });
}

function sendMessage() {
    if (message.value !== '') {
        socket.emit('sendMessage', message.value);
        message.value = '';
    }
}
