// controllers/userController.js

const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { oauth2Client } = require('../utils/googleClient'); // Ensure you create a proper OAuth2 client utility

// Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

       
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


exports.googleAuth = async (req, res) => {
    const code = req.query.code; 
    if (!code) {
        return res.status(400).json({ message: 'Authorization code not provided' });
    }

    try {
        
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);

        // Retrieve user info
        const userInfo = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const { email, name, picture } = userInfo.data;

        let user = await User.findOne({ email });
        if (!user) {
            // Create a new user if not found
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


exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};


