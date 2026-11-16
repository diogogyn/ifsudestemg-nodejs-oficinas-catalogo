const express = require('express');
const router = express.Router();
const oficinaController = require('../controllers/oficinaController');

router.get('/', oficinaController.listar);

module.exports = router;