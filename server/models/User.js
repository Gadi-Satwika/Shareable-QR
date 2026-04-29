const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google users
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    avatar: { type: String }
});

module.exports = mongoose.model('User', userSchema);