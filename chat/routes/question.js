const Question = require('./../models/question');

module.exports = (app) => {
    app.get('/question', (req, res) => {
        Question.find({}).then(result => {
            res.send({ response: result });
        });
    });

    app.post('/question', (req, res) => {
        var question = new Question(req.body.data);
        question.save().then(result => {
            res.status(201).send({ response: 'created' });
        });
    });

}
