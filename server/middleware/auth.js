// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, msg: "No token, access denied" });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach user data to request object
        // Since your controller uses { id: user._id }, decoded will have .id
        req.user = decoded; 
        
        next();
    } catch (err) {
        console.error("Token Validation Error:", err.message);
        res.status(401).json({ success: false, msg: "Token is not valid" });
    }
};

module.exports = { protect };