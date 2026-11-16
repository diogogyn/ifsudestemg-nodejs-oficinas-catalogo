const express = require('express');
const router = express.Router();
const oficinaController = require('../controllers/oficinaController');

router.get('/', oficinaController.pesquisar);
router.post('/', oficinaController.pesquisar);

module.exports = router;