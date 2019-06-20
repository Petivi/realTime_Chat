
affichageQuiz = document.getElementById('affichageQuiz');
affichageCompteur = document.getElementById('affichageCompteur');

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
        </div>
        `;
        let listeReponse = document.getElementById('listeReponse');
        question.reponse.forEach(function (reponse) {
            let li = document.createElement('li');
            li.classList.add('reponseList', 'clickable');
            li.innerHTML = reponse.text;
            listeReponse.appendChild(li);
        });
        let listResponseHtml = document.getElementsByClassName('reponseList');
        for (let i = 0; i < listResponseHtml.length; i++) {
            listResponseHtml[i].addEventListener('click', (e) => {
                setResponse(e, listResponseHtml[i], listResponseHtml);
            });
        };
    }
});

function setResponse(e, liReponse, ttLiReponse) {
    if (liReponse.classList.contains('clickable')) {
        let response = e.target.textContent;
        response = question.reponse.find(r => r.text === response);
        if (response.validAnswer) {
            liReponse.classList.add('validAnswer');
        } else {
            liReponse.classList.add('wrongAnswer');
        }
        let bonneReponse = question.reponse.find(r => r.validAnswer);
        for (let i = 0; i < ttLiReponse.length; i++) {
            liReponse.classList.remove('clickable');
            liReponse.removeEventListener('click', () => { });
            if (liReponse.innerHTML === bonneReponse.text) {
                liReponse.classList.add('validAnswer')
            }
        }
    }
}

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

