const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER LOGIC
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ success: true, token, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// LOGIN LOGIC
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find User
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, msg: "Invalid Credentials" });

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, msg: "Invalid Credentials" });

        // 3. Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};


exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body; // This comes from the frontend later

        // 1. Verify the token with Google
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const { name, email, picture } = ticket.getPayload();

        // 2. Check if user already exists in your DB
        let user = await User.findOne({ email });

        if (!user) {
            // If they don't exist, create them!
            user = new User({
                name,
                email,
                avatar: picture, // We can store their Google profile pic
                // Note: No password needed for Google users
            });
            await user.save();
        }

        // 3. Issue your own JWT so they can use your app
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ success: true, token, user });

    } catch (err) {
        console.error("Google Auth Error:", err);
        res.status(400).json({ success: false, msg: "Google Authentication Failed" });
    }
};