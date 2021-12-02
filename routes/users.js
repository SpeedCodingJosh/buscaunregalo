const { Router } = require('express');
const { userProfile, addFavorite } = require('../controllers/profile');
const { isAuthenticated } = require('../helpers/isAuthenticated');
const { createPublicGift, getPublicGiftData, editPublicGift, getSpecificGiftData, deletePublicGift } = require('../controllers/gifts');

const router = Router();

router.get('/create-gift', [isAuthenticated], (req, res) => {
    res.render('users/create-gift', {
        uploadGiftsPictures: process.env.UPLOADGIFTSURL,
        isAuth: true
    });
});

router.post('/addFavorite', addFavorite);

router.get('/delete-gift/:giftID', deletePublicGift);

router.post('/create-gift', createPublicGift);
router.post('/edit-gift', editPublicGift);

router.get('/:username', userProfile);

router.get('/:username/edit-gift/:giftID', [isAuthenticated], getSpecificGiftData);
router.get('/:username/edit-gift/:giftID', [isAuthenticated], getSpecificGiftData);
router.get('/:username/:giftID', getPublicGiftData);

module.exports = router;