const { Router } = require('express');
const {
    usersGet,
    usersPost,
    usersPut,
    usersDelete
} = require('../controllers/users');

const router = Router();

router.get('/', usersGet);

router.post('/', usersPost);

router.put('/', usersPut);

router.delete('/', usersDelete);

module.exports = router;