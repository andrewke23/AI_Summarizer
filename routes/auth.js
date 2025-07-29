const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { displayName, email, password } = req.body;
    const validationResult = validateRegister(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ success: false, message: validationResult.message });
    }
    const existingUser = await User.findOne({ email: email});
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use'})
    }
    const user = new User({ displayName, email, password });
    await user.save();
    const token = jwt.sign(
        { userId: user._id, displayName: user.displayName},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    );
    res.status(201).json({ success: true, token: token, message: 'User registered successfully' });
    
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const validationResult = validateLogin(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ success: false, message: validationResult.message });
    }
    const existingUser = await User.findOne({email: email});
    if (!existingUser) {
        return res.status(400).json({success: false, message: "Invalid email"});
    }
    const existingPwd = await bcrypt.compare(password, existingUser.password);
    if (!existingPwd) {
        return res.status(400).json({success: false, message: 'Invalid password'});
    }

    const token = jwt.sign(
        { userId: existingUser._id, displayName: existingUser.displayName},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
        );
    return res.status(200).json({success: true, token: token, message: "Login successful"})
    
    
})
function validateLogin(input) {
    if (!input.email || !input.password) {
        return {
            success: false,
            message: 'All fields are required'
        }
    }
}
function validateRegister(input) {
    if (!input.displayName || !input.email || !input.password) {
        return {
            success: false,
            message: 'All fields are required'
        }
    }
    if (input.password.length < 8) {
        return {
            success: false,
            message: 'Password must be at least 8 characters long'
        }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
        return {
            success: false,
            message: 'Invalid email address'
        }
    }
    return {
        success: true,
        message: 'Input is valid',
    }
}

module.exports = router;
