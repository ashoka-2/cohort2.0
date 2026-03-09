const express = require('express');
const { registerUser, loginUser, logoutUser, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateUserRegistration, validateUserLogin } = require('../validations/user.validator');

const router = express.Router();

router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

module.exports = router;
