const Question = require('./../models/question');

module.exports = (app) => {


  app.post('/question', (req, res) => {
    var question = new Question(req.body.data);
    question.save().then(result => {
      res.status(201).send({response: 'created'});
    });
  });
  //
  // app.get('/match', (req, res) => {
  //   Match.find({}, { "__v": 0, "password": 0, "token": 0 })
  //     .then(matches => {
  //         res.send(matches);
  //     });
  // });


  function getQuestions(){
      Question.find({}, { "__v": 0, "token": 0 })
        .then(questions => {
            return questions;
        });
  }

}
