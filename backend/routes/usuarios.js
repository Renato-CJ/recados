const express = require('express');
const router = express.Router();
const { criarUsuario } = require('../controllers/usuarios');

router.post('/criar', criarUsuario);

module.exports = router;

const { loginUsuario } = require('../controllers/usuarios');

router.post('/login', loginUsuario);
