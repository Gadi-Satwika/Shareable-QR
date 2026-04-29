const express = require('express');
const router = express.Router();
const { createQR, redirectQR , getUsersQRs} = require('../controllers/qrController');

// POST: Create a new QR mapping
router.post('/generate', createQR);

router.get('/all', getUsersQRs);

// GET: The redirection engine (for when someone scans)
router.get('/:shortId', redirectQR);

module.exports = router;