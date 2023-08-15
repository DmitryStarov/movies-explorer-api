const router = require('express').Router();
const { patchUser, getUserInfo } = require('../controllers/users');
const { validatePathUser } = require('../middlewares/validation');

router.get('/me', getUserInfo);

router.patch('/me', validatePathUser, patchUser);

module.exports = router;
