var xhr = new XMLHttpRequest();
var ttQuestion = [];
var addQuestionMenu = document.getElementById('addQuestionMenu');
var qpcMenu = document.getElementById('qpcMenu');
var chatMenu = document.getElementById('chatMenu');
var vueChat = document.getElementById('vueChat');
var vueQpc = document.getElementById('vueQpc');
var listUsers = document.getElementById('listUsers');
var btnDevenirAnimateur = document.getElementById('btnDevenirAnimateur');
var utilisateur = {};

addQuestionMenu.addEventListener('click', () => {
    window.location.href = 'ajoutQuestion.html';
});

qpcMenu.addEventListener('click', () => {
    xhr.open('GET', 'question');
    xhr.send(null);
    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === 4) {
            let res = JSON.parse(xhr.response);
            if (res.response && res.response.length > 0) {
                ttQuestion = res.response;
            }
        }
    });
    vueQpc.style.display = 'block';
    vueChat.classList.add('col-md-3');
    vueChat.classList.remove('col');
    displayQpc = true;
    socket.emit('checkAnimateur', (response) => { //la reponse ici va etre le retour de la callback coté serveur
        if (!response) { //il n'y a pas d'animateur pour l'instant on peut afficher le bouton pour devenir animateur
            btnDevenirAnimateur.style.display = 'inline-block';
        } else {
            btnDevenirAnimateur.style.display = 'none';
            let affQuizz = document.getElementById('affichageQuiz');
            affQuizz.innerHTML = `<div class="col">En attente de la prochaine question</div>`;
        }
    });
});

chatMenu.addEventListener('click', () => {
    vueQpc.style.display = 'none';
    vueChat.classList.remove('col-md-3');
    vueChat.classList.add('col');
    displayQpc = false;
});

socket.on('updateListUsers', (ttUtilisateur) => {
    setTtUtilisateurHtml(ttUtilisateur)
});

function setTtUtilisateurHtml(ttUtilisateur) {
    ttUtilisateur.sort((a, b) => {
        return a.score - b.score
    })
    listUsers.innerHTML = "";
    ttUtilisateur.forEach(function(user) {
        var li = document.createElement('li');
        if (user.animateur) {
            li.innerHTML = user.pseudo + ' (Animateur)';
        } else {
            li.innerHTML = user.pseudo + ' : ' + user.score;
        }
        listUsers.appendChild(li);
    });
}

function setQpcMenu() {
    if (utilisateur.room || roomClicked) {
        qpcMenu.parentElement.style.display = 'list-item';
    } else {
        qpcMenu.parentElement.style.display = 'none';
    }
}