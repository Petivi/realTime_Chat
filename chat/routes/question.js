const Question = require('./../models/question');
const redis = require('../redis/redis');

var hgetall = (key) => {
  return new Promise((resolve, reject) => {
    redis.redisClient.hgetall(key, function(err, result) {
      if(err) reject(err);
      resolve(result);
    });
  })
}

module.exports = (app) => {
    app.get('/question', (req, res) => {
        Question.find({}).then(async (result) => {
            redis.redisClient.lrange('questionsList', 0, -1, async function(err, tabQuestions){

              for(var i = 0; i<tabQuestions.length; i++){
                var questionStored = await hgetall(tabQuestions[i]);
                result.push(questionStored);
              }
              res.send({ response: result });
            })
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
          redis.redisClient.lrange('questionsList', 0, -1, function(err, tabQuestions){
            var nbQuestions = tabQuestions.length;
            var questionName = "quest"+nbQuestions;
            data.reponse._id = 'rep'+questionName+data.reponse.length;
            tabReponse = data.reponse.toString();
            redis.redisClient.hmset(questionName, {
              'question': data.question,
              'reponse': data.reponse,
              'author': data.author,
              'saveDB': data.saveDB
            });
            redis.redisClient.rpush( 'questionsList', questionName);
          })
          res.status(201).send({ response: 'Not added to db'})
        }
    });

}
