
affichageQuiz = document.getElementById('affichageQuiz');
affichageCompteur = document.getElementById('affichageCompteur');
var listeReponse, responseTextHtml, listResponseHtml;

btnDevenirAnimateur.addEventListener('click', () => {
    socket.emit('setNewAnimateur', (animateur) => {
        if (animateur) {
            utilisateur.animateur = true;
        }
    });
    socket.emit('hideBtnDevenirAnimateur');
});

socket.on('hideBtnDevenirAnimateur', () => {
    btnDevenirAnimateur.style.display = 'none';
    setQuizzAffichage();
});

socket.on('getReady', (seconde) => {
    affichageCompteur.style.display = 'block';
    affichageCompteur.innerHTML = seconde;
});

socket.on('displayReponses', (question) => {
    affichageCompteur.style.display = 'none';
    if (!utilisateur.animateur) {
        affichageQuiz.innerHTML = `
        <div class="col">
            <div class="row">
                <div class="col">
                    <h5>Question !!!</h5>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <strong>`+ question.question + `</strong>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <ul id="listeReponse">
                    </ul>
                </div>
            </div>
            <div class="row" id="responseTextHtml" style="display: 'none';">
            </div>
        </div>
        `;
        listeReponse = document.getElementById('listeReponse');
        responseTextHtml = document.getElementById('responseTextHtml');
        question.reponse.forEach(function (reponse) {
            let li = document.createElement('li');
            li.classList.add('reponseList', 'clickable');
            li.innerHTML = reponse.text;
            listeReponse.appendChild(li);
        });
        listResponseHtml = document.getElementsByClassName('reponseList');
        for (let i = 0; i < listResponseHtml.length; i++) {
            listResponseHtml[i].addEventListener('click', (e) => {
                if (listResponseHtml[i].classList.contains('clickable')) {
                    let response = e.target.textContent;
                    response = question.reponse.find(r => r.text === response);
                    socket.emit('setResponse', response.validAnswer);
                    responseTextHtml.style.display = 'flex';
                    if (response.validAnswer) {
                        listResponseHtml[i].classList.add('validAnswer');
                        responseTextHtml.innerHTML = `
                        <div class="col">
                            <div class="alert alert-success">`+ response.responseText + `</div>
                        </div>
                        `;
                    } else {
                        listResponseHtml[i].classList.add('wrongAnswer');
                        responseTextHtml.innerHTML = `
                        <div class="col">
                            <div class="alert alert-danger">`+ response.responseText + `</div>
                        </div>
                        `;
                    }
                    let bonneReponse = question.reponse.find(r => r.validAnswer);
                    for (let i = 0; i < listResponseHtml.length; i++) {
                        listResponseHtml[i].classList.remove('clickable');
                        if (listResponseHtml[i].innerHTML === bonneReponse.text) {
                            listResponseHtml[i].classList.add('validAnswer')
                        }
                    }
                }
            });
        };
    }
});

socket.on('tempsReponse', (seconde) => {
    affichageCompteur.style.display = 'block';
    affichageCompteur.innerHTML = seconde;
});

socket.on('finReponse', (ttUser) => {
    if (listResponseHtml) {
        for (let i = 0; i < listResponseHtml.length; i++) {
            listResponseHtml[i].classList.remove('clickable');
            affichageCompteur.innerHTML = 'Fin !';
        }
    }
    if (!utilisateur.animateur) {
        affichageQuiz.innerHTML = `
        <div class="row">
            <div class="col">En attente de la prochaine question</div>
        </div>`;
    }
    setTtUtilisateurHtml(ttUser);
});


function setQuizzAffichage() {
    if (utilisateur.animateur) {
        if (ttQuestion.length > 0) {
            affichageQuiz.innerHTML = getTextAnimateur();

            let sendQuestion = document.getElementById('sendQuestion');
            let listQuestionsAnimateur = document.getElementById('listQuestionsAnimateur');
            sendQuestion.addEventListener('click', () => {
                let id_question = listQuestionsAnimateur.value;
                if (id_question != 0) {
                    let question = ttQuestion.find(q => q._id === id_question);
                    socket.emit('displayReponses', question);
                }
            });

        } else {
            affichageQuiz.innerHTML = `
            <div class="col">Il n'y a pas de questions, voir plus tard pour pouvoir en créer</div>
            `;
        }
    } else {
        affichageQuiz.innerHTML = `
        <div class="col">En attente de la prochaine question</div>
        `;
    }
}

function getTextAnimateur() {
    let texte = `
    <div class="col">
        <div class="row mt-2">
            <div class="col">
              <select id="listQuestionsAnimateur">
                <option disabled selected value="0" >Choix de la question</option>`;
    ttQuestion.forEach(q => {
        texte += `<option value="` + q._id + `" >` + q.question + `</option>`;
    });

    texte += `</select>
                <button id="sendQuestion" type="button" name="button">Poser la question</button>
                `;
    texte += `</div></div>`;
    return texte;
}

