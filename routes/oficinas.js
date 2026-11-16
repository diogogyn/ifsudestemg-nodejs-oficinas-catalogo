const express = require('express');
const router = express.Router();
const oficinaController = require('../controllers/oficinaController');

router.get('/abertas', oficinaController.listarAbertas);

router.get('/nova', oficinaController.formNova);
router.post('/nova', oficinaController.criar);

router.get('/:id', oficinaController.consultar);
router.get('/:id/editar', oficinaController.formEdicao);
router.post('/:id/editar', oficinaController.editar);
router.post('/:id/alternar', oficinaController.alternar);
router.post('/:id/excluir', oficinaController.excluir);

module.exports = router;