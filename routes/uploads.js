const { Router } = require('express');
const { uploadUserPictures, uploadGiftPictures } = require('../controllers/uploads');

const router = Router();

router.post('/users', uploadUserPictures);
router.post('/gifts', uploadGiftPictures);

module.exports = router;