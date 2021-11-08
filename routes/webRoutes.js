const { Router } = require('express');
const { validateJWT } = require('../helpers/validate-jtw');

const router = Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/profile', [ validateJWT ], (req, res) => {
    res.render('profile');
});

module.exports = router;