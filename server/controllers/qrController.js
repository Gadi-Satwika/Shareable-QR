const QR = require('../models/QR');
const { nanoid } = require('nanoid');

const multer = require('multer');
const path = require('path');

const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Create a unique filename: date + original name
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

exports.uploadMiddleware = upload.single('file');

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

exports.deleteQR = async (req, res) => {
    const { id } = req.params;
    
    try {
        // 1. Find the QR first so we can see if it has a file path
        const qrToDelete = await QR.findById(id);
        
        if (!qrToDelete) {
            return res.status(404).json({ success: false, msg: "QR not found" });
        }

        // 2. If it's a File QR, delete the physical file from /uploads
        if (qrToDelete.originalUrl.includes('/uploads/')) {
            // Extract the filename from the URL
            const filename = qrToDelete.originalUrl.split('/').pop();
            const filePath = path.join(__dirname, '../uploads', filename);

            // Physically remove file from the server
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Deleted file: ${filename}`);
            }
        }

        // 3. Now delete the record from MongoDB
        await QR.findByIdAndDelete(id);
        
        res.json({ success: true, msg: "Database record and physical file deleted." });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.getQRStats = async (req, res) => {
    try {
        const { id } = req.params;
        const qr = await QR.findById(id);
        
        if (!qr) return res.status(404).json({ msg: "Not found" });

        // Logic to group scans by date for a chart
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