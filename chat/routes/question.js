const Question = require('./../models/question');

module.exports = (app) => {


  app.post('/question', (req, res) => {
    var question = new Question(req.body.data);
    question.save().then(result => {
      res.status(201).send({response: 'created'});
    });
  });




}
