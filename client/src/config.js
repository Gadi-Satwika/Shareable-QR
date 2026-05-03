// client/src/config.js
const SERVER_IP = import.meta.env.VITE_SERVER_IP || "localhost";
export const BASE_URL = `http://${SERVER_IP}:5000`;
export const REDIRECT_BASE_URL = `${BASE_URL}/api/qr`;