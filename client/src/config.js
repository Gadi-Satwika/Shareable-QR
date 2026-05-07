// client/src/config.js

// 1. Determine if we are in production (on Render) or development
const isProduction = import.meta.env.PROD || window.location.hostname !== "localhost";

// 2. Set the BASE_URL dynamically
// In production, we use a relative path '/' so it uses the Render domain
// In development, we use your localhost/IP
export const BASE_URL = isProduction 
    ? window.location.origin 
    : `http://localhost:5000`;

// 3. This is what the QR codes use
// On Render, this becomes "/api/qr"
// On Laptop, this becomes "http://localhost:5000/api/qr"
export const REDIRECT_BASE_URL = `${BASE_URL}/api/qr`;