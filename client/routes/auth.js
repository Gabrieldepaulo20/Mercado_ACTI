const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const login = require('../middlware/login');

// Chamando API referente aos funcionários / acesso.

router.post('/funcionarios/cadastro', authController.register); // register
router.post('/login', authController.login); // login
router.post('/logout', authController.logout); // logout
router.post('/login/usuario', authController.loginUser); // login

module.exports = router;