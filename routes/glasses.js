const express = require('express');
const router = express.Router();
const glassesController = require('../controllers/glasses');

router.get('/type/:type', glassesController.getByType);

module.exports = router;                