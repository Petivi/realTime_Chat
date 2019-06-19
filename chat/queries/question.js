const Question = require('./../models/question');

var getQuestions = () =>{

  return new Promise((resolve, reject) => {
    Question.find({}, { "__v": 0, "token": 0 })
    .then(questions => {
      resolve(questions);
    });
  })
}

module.exports = {getQuestions}
