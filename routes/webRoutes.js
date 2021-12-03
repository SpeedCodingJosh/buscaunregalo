const { Router } = require('express');
const { isAuthenticated } = require('../helpers/isAuthenticated');
const { getProfile, getInitUsers, editProfile, getFavoriteList } = require('../controllers/profile');

const router = Router();

router.get('/', getInitUsers);

router.get('/favorites', [ isAuthenticated ], getFavoriteList);

router.get('/profile', [ isAuthenticated ], getProfile);
router.get('/profile-edit', [ isAuthenticated ], editProfile);

router.get('/server/error', (req, res) => {
    res.render('server-error');
});

module.exports = router;