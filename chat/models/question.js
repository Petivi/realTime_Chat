const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    question: { type: String, required: true },
    reponse: [
      {text: String, responseText: String, validAnswer: Boolean}
    ]
})


const Question = mongoose.model('question', QuestionSchema);


module.exports = Question;
