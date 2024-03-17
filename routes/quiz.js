const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz');

//GET Requests
//GET selected question for the quiz
router.get('/questions', quizController.getQuestions);

module.exports = router;