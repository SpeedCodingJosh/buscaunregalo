const { Router } = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/login'); 
const validateFields = require('../middlewares/validateFields');

const router = Router();

router.post('/login', [
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('username', 'El usuario o correo no puede estar vacío').not().isEmpty(),
    validateFields
], login);

router.post('/register', [
    check('email', 'Un correo válido es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('username', 'El usuario no puede estar vacío').not().isEmpty(),
    validateFields
], register);

module.exports = router;