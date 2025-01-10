const express = require('express');
const {googleAuth} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/google', googleAuth);

module.exports = router;
