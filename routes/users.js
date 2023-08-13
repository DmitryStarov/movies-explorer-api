const router = require('express').Router();
const { patchUser, getCurrentUser } = require('../controllers/users');
const { validatePathUser } = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', validatePathUser, patchUser);

module.exports = router;
