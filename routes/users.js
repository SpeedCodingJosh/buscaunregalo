const { Router } = require('express');
const { userProfile } = require('../controllers/profile');
const { isAuthenticated } = require('../helpers/isAuthenticated');
const { validateJWT } = require('../helpers/validate-jtw');
const { createPublicGift, getPublicGiftData } = require('../controllers/gifts');

const router = Router();

router.get('/create-gift', [isAuthenticated], (req, res) => {
    res.render('users/create-gift', {
        uploadGiftsPictures: process.env.UPLOADGIFTSURL,
        isAuth: true
    });
});

router.post('/create-gift', createPublicGift);

router.get('/:username', userProfile);

router.get('/:username/:giftID', [isAuthenticated], getPublicGiftData);

module.exports = router;