const { Router } = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/login'); 
const { isAuthenticated } = require('../helpers/isAuthenticated');
const validateFields = require('../middlewares/validateFields');

const router = Router();

router.get('/login', (req, res) => {
    console.log(req.cookies);
    if(req.cookies.jwt)
        res.redirect('/profile');
    else
        res.render('login');
});

router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
});

router.post('/login', [
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('username', 'El usuario o correo no puede estar vacío').not().isEmpty(),
    validateFields
], login);

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', [
    check('email', 'Un correo válido es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('username', 'El usuario no puede estar vacío').not().isEmpty(),
    validateFields
], register);

module.exports = router;