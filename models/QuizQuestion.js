const mongoose = require('mongoose');

const QuizQuestionSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        enum: ["slider","choice","tier"],
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    property: {
        type: String,
        enum: ["acidity","body","alcohol","tannin","sweetness"],
        required: true
    },
    answers: {
        type: [{
            score: {type: Number, required: true, min:1, max: 5},
            text: {type: String, required: true}
        }],
        required: () => this.type === "choice" || this.type === "tier"
    }
});

module.exports = mongoose.model('QuizQuestion', QuizQuestionSchema);