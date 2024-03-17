const QuizQuestion = require('../models/QuizQuestion');
const mongoose = require('mongoose');

//Get questions endpoint

const getQuestions = async (req, res) => {

    let questionsPerProperty = 2;
    let selectedQuestions = [];

    try {
        const questions = await QuizQuestion.find()

        if (!questions) throw new Error('No quiz questions found in database');

        let acidityQuestions = selectQuestionsForProperty(questions, 'acidity', questionsPerProperty);
        for (let question of acidityQuestions) selectedQuestions.push(question);

        let bodyQuestions = selectQuestionsForProperty(questions, 'body', questionsPerProperty);
        for (let question of bodyQuestions) selectedQuestions.push(question);

        let sweetnessQuestions = selectQuestionsForProperty(questions, 'sweetness', questionsPerProperty);
        for (let question of sweetnessQuestions) selectedQuestions.push(question);

        let alcoholQuestions = selectQuestionsForProperty(questions, 'alcohol', questionsPerProperty);
        for (let question of alcoholQuestions) selectedQuestions.push(question);

        let tanninQuestions = selectQuestionsForProperty(questions, 'tannin', questionsPerProperty);
        for (let question of tanninQuestions) selectedQuestions.push(question);

        res.status(200).json({results: selectedQuestions, questionsReturned: selectedQuestions.length});
    } catch(err) {
        res.status(400).json({message: err.message});
    }
}

//Function that selects two questions for a property
function selectQuestionsForProperty (questionsArray, property, quantity) {
    let filteredQuestions = questionsArray.filter(question => question.property === property);
    let selectedQuestions = [];
    if (filteredQuestions.length > 2) {
        let selectedQuestionsIndexes = generateRandomInts(quantity, filteredQuestions.length-1);
        for (let i=0; i<selectedQuestionsIndexes.length; i++) {
            selectedQuestions.push(filteredQuestions[selectedQuestionsIndexes[i]]);
        }
        return selectedQuestions;
    } else if (filteredQuestions.length < 2) {
        throw new Error(`Less than minimum amount of questions available in the database for ${property}`);
    } else if (filteredQuestions.length == 2) {
        return filteredQuestions;
    }
}

//Generate random numbers for quiz questions selection
function generateRandomInts(quantity, max) {
    const ints = [];

    while (ints.length < quantity) {
        let randomInt = Math.ceil(Math.random() * max);
        if (ints.indexOf(randomInt) === -1) ints.push(randomInt);
    }
    return (ints);
}

module.exports = {
    getQuestions
}