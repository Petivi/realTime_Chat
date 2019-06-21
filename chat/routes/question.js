const Question = require('./../models/question');
const redis = require('../redis/redis');



module.exports = (app) => {
    app.get('/question', (req, res) => {
        Question.find({}).then(result => {
            res.send({ response: result });
        });
    });

    app.post('/question', (req, res) => {
        if(req.body.data.saveDB){
          var question = new Question(req.body.data);
          question.save().then(result => {
            res.status(201).send({ response: 'created' });
          });
        }else {
          res.status(201).send({ response: 'Not added to db'})
        }

    });

}
