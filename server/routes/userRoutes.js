const express = require('express');
const {
    signup,
    login,
    logout,
    getCurrentUser,
    googleAuth,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Traditional authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getCurrentUser);

// Google OAuth route
router.get('/google', googleAuth);

module.exports = router;
