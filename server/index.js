const dns = require('node:dns'); // Add this line
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const qrRoutes = require('./routes/qrRoutes');
const authRoutes = require('./routes/authRoutes')

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/qr', qrRoutes);
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Connection Error:", err));

// Test Route
app.get('/', (req, res) => res.send("QR-Flow API is Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));