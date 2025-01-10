// controllers/userController.js

const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { oauth2Client } = require('../utils/googleClient'); // Ensure you create a proper OAuth2 client utility




exports.googleAuth = async (req, res) => {
    const code = req.query.code; 
    if (!code) {
        return res.status(400).json({ message: 'Authorization code not provided' });
    }

    try {
        
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);

        const userInfo = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const { email, name, picture } = userInfo.data;

        let user = await User.findOne({ email });
        if (!user) {
            
            user = await User.create({ name, email, image: picture });
        }

        const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: 'Authentication successful',
            token,
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error during Google authentication',
            error: error.message,
        });
    }
};

exports.logout = (req, res) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error: error.message });
    }
};


