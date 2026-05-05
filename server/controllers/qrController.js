const QR = require('../models/QR');
const { nanoid } = require('nanoid');

const multer = require('multer');
const path = require('path');

const fs = require('fs');

const { generateSmartMetadata } = require('../utils/aiHelper');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Create a unique filename: date + original name
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Replace your existing aiMetadata line with this:
const upload = multer({ storage: storage });

exports.uploadMiddleware = upload.single('file');

// Create a new Dynamic QR
exports.createQR = async (req, res) => {
    try {
        const { title, originalUrl, urlToAnalyze } = req.body;
        console.log("Analyzing URL:", urlToAnalyze);

        let aiDescription = "";
        let aiCategory = "General";

       if (urlToAnalyze) {
            try {
                const aiMetadata = await generateSmartMetadata(urlToAnalyze);
                console.log("AI Result:", aiMetadata); // Check your terminal for this!
                aiDescription = aiMetadata.description || "";
                aiCategory = aiMetadata.category || "General";
            } catch (aiErr) {
                console.error("AI unreachable.");
            }
        }

        const newQR = new QR({
            user: req.user.id,
            title: title, // YOUR NAME - NEVER CHANGED.
            category: aiCategory, // AI helper
            description: aiDescription, // AI helper
            originalUrl,
            shortId: require('nanoid').nanoid(6)
        });
        await newQR.save();
        res.status(201).json({ success: true, data: newQR });

    } catch (err) {
        // This only triggers if the Database or something critical fails
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.redirectQR = async (req, res) => {
    try {
        const { shortId } = req.params;
        const qrEntry = await QR.findOne({ shortId });

        if (!qrEntry) return res.status(404).send("QR Not Found");

        // Advanced Tracking
        const scanData = {
            timestamp: new Date(),
            device: req.headers['user-agent'].includes('Mobile') ? 'Mobile' : 'Desktop',
            browser: req.headers['user-agent'].split(' ')[0] // Simple browser detection
        };

        qrEntry.scanCount += 1;
        qrEntry.scans.push(scanData); // Storing the "When" and "How"
        await qrEntry.save();

        return res.redirect(qrEntry.originalUrl);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
// Get all QRs
exports.getUsersQRs = async (req, res) => {
    try {
        // Safety Guard: Check if req.user exists
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const qrs = await QR.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: qrs });
    } catch (err) {
        console.error("Fetch Error:", err); // This shows in your terminal
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteQR = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Find the QR and ensure the 'user' field matches the person asking to delete
        const qrToDelete = await QR.findOne({ _id: id, user: req.user.id });
        
        if (!qrToDelete) {
            // If the ID exists but belongs to someone else, we return 404/401
            return res.status(404).json({ success: false, msg: "QR not found or unauthorized" });
        }

        // Physical file deletion logic remains same
        if (qrToDelete.originalUrl.includes('/uploads/')) {
            const filename = qrToDelete.originalUrl.split('/').pop();
            const filePath = path.join(__dirname, '../uploads', filename);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete the record only after confirming ownership
        await QR.findByIdAndDelete(id);
        
        res.json({ success: true, msg: "Asset deleted successfully." });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.getQRStats = async (req, res) => {
    try {
        const { id } = req.params;
        // Verify this QR belongs to the user
        const qr = await QR.findOne({ _id: id, user: req.user.id });
        
        if (!qr) return res.status(404).json({ msg: "Data not found" });

        const stats = qr.scans.reduce((acc, scan) => {
            const date = scan.timestamp.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        res.json({ success: true, stats, total: qr.scanCount, deviceData: qr.scans });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};