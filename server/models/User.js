const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if they use Google
    googleId: { type: String }, // To link their Google account
    avatar: { type: String }   // Their profile picture
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);