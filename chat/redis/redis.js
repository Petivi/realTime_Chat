const redis = require('redis');

var redisClient = redis.createClient(6379, '127.0.0.1');

module.exports = {redisClient}

// redisClient.set('student', 'Oui');
// redisClient.get('student', (err, result) => {
//   console.log(result);
// });
//
// var getAsync = (key) => {
//   return new Promise((resolve, reject) => {
//     redisClient.get(key, (err, result) => {
//       if(err) reject(err);
//     })
//   })
// }
