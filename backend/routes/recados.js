const express = require('express');
const router = express.Router();
const { listarRecados, criarRecado } = require('../controllers/recados');

router.get('/', listarRecados);
router.post('/criar', criarRecado);

module.exports = router;
