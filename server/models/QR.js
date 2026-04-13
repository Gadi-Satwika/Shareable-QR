const mongoose = require('mongoose');

const QRSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    title: { type: String, required: true },
    originalUrl: { type: String, required: true },
    shortId: { type: String, unique: true, required: true }, // The unique ID for redirection
    scanCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    // Advanced Analytics
    scans: [{
        timestamp: { type: Date, default: Date.now },
        device: String,
        browser: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('QR', QRSchema);