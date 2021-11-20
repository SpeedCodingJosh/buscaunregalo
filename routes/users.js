const { Router } = require('express');
const { check } = require('express-validator');
const { userProfile } = require('../controllers/profile');
const { isAuthenticated } = require('../helpers/isAuthenticated');
const validateFields = require('../middlewares/validateFields');

const router = Router();

router.get('/create-gift', [
    isAuthenticated
], (req, res) => {
    res.render('../views/users/create-gift');
});

router.get('/:username', userProfile);

module.exports = router;