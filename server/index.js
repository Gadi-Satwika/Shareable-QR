const path = require("path")
const dns = require('node:dns'); // Add this line
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const qrRoutes = require('./routes/qrRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors({
    origin: '*', // Allow all origins during dev
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'] // EXPLICITLY allow Authorization
}));
app.use(express.json());

app.use('/api/qr', qrRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/chat', require('./routes/chatRoutes'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Connection Error:", err));

// Test Route
app.get('/', (req, res) => res.send("QR-Flow API is Running"));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // The (.*) tells Express to match any string and name it as a parameter
    // This is the modern 'catch-all' syntax
    app.get('/:any*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});