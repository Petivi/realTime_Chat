
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

function setQuizzAffichage() {
    if (utilisateur.animateur) {
        if (ttQuestion.length > 0) {
            affichageQuiz.innerHTML = getTextAnimateur();
        } else {
            affichageQuiz.innerHTML = `
            <div class="col">Il n'y a pas de questions, voir plus tard pour pouvoir en créer</div>
            `;
        }
    } else {
        affichageQuiz.innerHTML = `
        <div class="col">Je suis une pute bande d'animateur</div>
        `;
    }
}

function getTextAnimateur() {
    let texte = `
    <div class="col">
        <div class="row">
            <div class="col">
                <h5>Choisissez les questions que vous voulez utiliser pour la partie</h5>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col">`;

    ttQuestion.forEach(q => {
        texte += `
        <div class="questionSelectable clickable">
            <div class="row">
                <div class="col">
                    `+ q.question + `
                </div>
            </div>`+
            /* <div class="row"> //partie réponse ça me fait mal de devoir l'enlever x)
                <div class="col">
                    `+ getResponseTable(q) + `
                </div>
            </div> */
        `</div>`;

    });

    texte += `</div></div>`;
    return texte;
}

function getResponseTable(question) {
    let texte = `<ul>`;
    question.reponse.forEach(r => {
        texte += `
        <li>
            <div class="row">
                <div class="col-md-7">
                    <strong>Réponse : </strong>` + r.text +
                `</div>` +
            /*  `<div class="col">
                    <strong>Texte si choisie : </strong>` + r.responseText + 
                </div>
            */
                `<div class="col">
                    <strong>Bonne réponse : </strong>` + (r.validAnswer ? 'oui' : 'non') + `
                </div>
            </div>
        </li>`;
    });
    texte += `</ul>`;
    return texte;
}


