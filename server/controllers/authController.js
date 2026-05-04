const axios = require('axios');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const QR = require('../models/QR');
const fs = require('fs');
const path = require('path');

const nodemailer = require('nodemailer');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email (e.g., satwika@gmail.com)
        pass: process.env.EMAIL_PASS  // Your Gmail App Password
    }
});

// REGISTER LOGIC
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        if (user) {
            // 1. IDENTITY COLLISION CHECK:
            // If the user exists but has no password, they signed up with Google.
            // We MUST block manual password creation for Google accounts.
            if (!user.password) {
                return res.status(400).json({ 
                    success: false, 
                    msg: "This email is already linked with Google. Please sign in using the Google button." 
                });
            }

            // 2. Standard check for fully verified manual users
            if (user.isVerified) {
                return res.status(400).json({ success: false, msg: "User already exists. Please login." });
            }

            // 3. Unverified manual user: Refresh OTP and update details
            const salt = await bcrypt.genSalt(10);
            user.name = name;
            user.password = await bcrypt.hash(password, salt);
            user.otp = otp; 
            await user.save();
        } else {
            // 4. Brand new user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = new User({ 
                name, 
                email, 
                password: hashedPassword, 
                otp, 
                isVerified: false 
            });
            await user.save();
        }

        // 5. Send the email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Verification Code',
            text: `Your code is: ${otp}`
        });

        res.status(200).json({ success: true, msg: "OTP sent to email!" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ success: false, msg: "Server error during registration" });
    }
};
//OTP Verification Code

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        // Precise matching: Convert both to string and trim
        if (!user || String(user.otp).trim() !== String(otp).trim()) {
            return res.status(400).json({ success: false, msg: "Invalid OTP code" });
        }

        user.isVerified = true;
        user.otp = undefined; // Wipe it so it's one-time use only
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ success: true, token, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Verification failed" });
    }
};
// LOGIN LOGIC
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ success: false, msg: "Invalid Credentials" });

        // THE SECURE GATE: Block unverified users
        if (!user.isVerified) {
            return res.status(403).json({ 
                success: false, 
                msg: "Account not verified. Please verify your email first." 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, msg: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token, user: { name: user.name, email: user.email } });
    } catch (err) {
        // The 500 error happens here if JWT_SECRET is missing or DB is down
        console.error(err);
        res.status(500).json({ success: false, msg: "Server Error" });
    }
};


exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body; // This is actually the access_token from frontend

        // 1. Fetch user info from Google's API using the token
        const googleRes = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${idToken}`);
        const { name, email, picture } = googleRes.data;

        // 2. Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name,
                email,
                avatar: picture,
            });
            await user.save();
        }

        // 3. Create our own JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ 
            success: true, 
            token, 
            user: { id: user._id, name, email, avatar: picture } 
        });

    } catch (err) {
        console.error("Google Auth Error Detail:", err.response?.data || err.message);
        res.status(400).json({ success: false, msg: "Google Authentication Failed" });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: "User not found" });

        if (name) user.name = name;
        // You can add password update logic here later
        
        await user.save();
        res.json({ success: true, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};


exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Find all QRs belonging to this user
        const userQRs = await QR.find({ user: userId });

        // 2. Loop through and delete physical files
        userQRs.forEach(qr => {
            if (qr.originalUrl.includes('/uploads/')) {
                const filename = qr.originalUrl.split('/').pop();
                const filePath = path.join(__dirname, '../uploads', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        });

        // 3. Delete all QR records from MongoDB
        await QR.deleteMany({ user: userId });

        // 4. Delete the User record
        await User.findByIdAndDelete(userId);

        res.json({ success: true, msg: "Account and all associated data deleted." });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};