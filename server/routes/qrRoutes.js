const express = require('express');
const router = express.Router();
const { createQR, redirectQR , getUsersQRs, deleteQR, uploadMiddleware, getQRStats} = require('../controllers/qrController');
const { protect } = require('../middleware/auth');

// POST: Create a new QR mapping
router.post('/generate', protect, createQR);
router.get('/all', protect, getUsersQRs);
router.delete('/:id', protect, deleteQR);
router.get('/stats/:id', protect, getQRStats);
// GET: The redirection engine (for when someone scans)
router.get('/:shortId', redirectQR);

router.post('/upload', uploadMiddleware, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, msg: "No file received" });
    }
    
    // Return the path so the frontend can use it as the originalUrl
    res.json({ 
        success: true, 
        filePath: `/uploads/${req.file.filename}` 
    });
});

console.log("Checking imports:");
console.log("createQR:", typeof createQR);
console.log("protect:", typeof protect);
console.log("uploadMiddleware:", typeof uploadMiddleware);

module.exports = router;