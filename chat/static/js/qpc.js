
affichageQuiz = document.getElementById('affichageQuiz');

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

socket.on('displayReponses', (question) => {
    console.log(question)
    if (utilisateur.animateur) {

    } else {
        affichageQuiz.innerHTML = `
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
                <ul>`;
        ttReponse.forEach(function (reponse) {
            affichageQuiz.innerHTML += `<li class="reponse">` + reponse.text + `<li>`;
        });
        affichageQuiz.innerHTML += `
                </ul>
            </div>
        </div>
        `;
    }
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

