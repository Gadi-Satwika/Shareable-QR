const express = require('express');
const router = express.Router();
const { createQR, redirectQR , getUsersQRs, deleteQR, uploadMiddleware} = require('../controllers/qrController');

// POST: Create a new QR mapping
router.post('/generate', createQR);

router.get('/all', getUsersQRs);

// GET: The redirection engine (for when someone scans)
router.get('/:shortId', redirectQR);

router.delete('/:id', deleteQR)

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

module.exports = router;