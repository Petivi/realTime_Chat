var btnDevenirAnimateur = document.getElementById('btnDevenirAnimateur');

btnDevenirAnimateur.addEventListener('click', () => {
    socket.emit('setNewAnimateur');
});