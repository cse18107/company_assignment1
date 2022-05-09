const app = require('express');
const userController = require('./userController');

const router = app.Router();

router.route('/signup').post(userController.signup);
router.route('/signin').post(userController.signin);
router.route('/user/me').get(userController.getUser);

module.exports = router;