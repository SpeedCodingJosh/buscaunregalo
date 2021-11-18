const { Router } = require('express');
const { isAuthenticated } = require('../helpers/isAuthenticated');

const router = Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/favorites', (req, res) => {
    res.render('../views/favorites.hbs');
});

router.get('/wishinfo', (req, res) => {
    res.render('../views/users/wish-info.hbs');
});

router.get('/profile', [ isAuthenticated ], (req, res) => {
    res.render('profile');
});

router.get('/server/error', (req, res) => {
    res.render('server-error');
});

module.exports = router;