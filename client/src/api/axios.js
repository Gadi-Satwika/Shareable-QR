import axios from 'axios';

const API = axios.create({
    baseURL: 'http://10.95.239.6:5000/api',
});

// This automatically attaches your JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;