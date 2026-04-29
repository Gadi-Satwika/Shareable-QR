const QR = require('../models/QR');
const { nanoid } = require('nanoid');

// Create a new Dynamic QR
exports.createQR = async (req, res) => {
    try {
        const { title, originalUrl } = req.body;
        const shortId = nanoid(6);

        const newQR = new QR({
            // Remove the user line entirely for now
            title,
            originalUrl,
            shortId
        });

        await newQR.save();
        res.status(201).json({ success: true, data: newQR });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.redirectQR = async (req, res) => {
    try {
        const { shortId } = req.params;
        const qrEntry = await QR.findOne({ shortId });

        if (!qrEntry) {
            return res.status(404).send("QR Not Found");
        }

        // Increment scan count and save
        qrEntry.scanCount += 1;
        await qrEntry.save();

        // Redirect to the actual destination
        return res.redirect(qrEntry.originalUrl);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// Get all QRs
exports.getUsersQRs = async (req, res) => {
    try {
        // Fetch all QRs from the database
        const qrs = await QR.find().sort({ createdAt: -1 });
        
        res.status(200).json({ 
            success: true, 
            data: qrs 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch QR library" 
        });
    }
};