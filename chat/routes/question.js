const Question = require('./../models/question');
const redis = require('../redis/redis');



module.exports = (app) => {
    app.get('/question', (req, res) => {
        Question.find({}).then(result => {
            res.send({ response: result });
        });
    });

    app.post('/question', (req, res) => {
        var data = req.body.data;
        if(data.saveDB){
          var question = new Question(data);
          question.save().then(result => {
            res.status(201).send({ response: 'created' });
          });
        }else {
          res.status(201).send({ response: 'Not added to db'})
        }
        redis.redisClient.lrange('questionsList', 0, -1, function(err, tabQuestions){
          var nbQuestions = tabQuestions.length;
          var questionName = "quest"+nbQuestions;
          tabReponse = data.reponse.toString();
          redis.redisClient.hmset(questionName, {
              'question': data.question,
              'reponse': tabReponse,
              'author': data.author,
              'saveDB': data.saveDB
          });
          redis.redisClient.rpush( 'questionsList', questionName);
        })
    });

}
