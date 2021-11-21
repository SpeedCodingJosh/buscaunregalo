const { Router } = require('express');
const { isAuthenticated } = require('../helpers/isAuthenticated');
const { getProfile, getInitUsers } = require('../controllers/profile');

const router = Router();

router.get('/', getInitUsers);

router.get('/favorites', (req, res) => {
    res.render('../views/favorites', {
        isAuth: req.cookies.jwt ? true : false
    });
});

router.get('/profile', [ isAuthenticated ], getProfile);

router.get('/server/error', (req, res) => {
    res.render('server-error');
});

module.exports = router;