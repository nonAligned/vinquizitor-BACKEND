const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mail');

router.post('/send', mailController.sendMail);

module.exports = router;