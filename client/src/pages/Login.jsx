import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Globe } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import AuthBackground from './AuthBackground';

const Login = () => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '' });

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await API.post('/auth/google', { idToken: response.access_token });
                if (res.data.success) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    navigate('/dashboard');
                }
            } catch (err) { alert("Google Auth Failed"); }
        }
    });

    const handleAuth = async () => {
        try {
            if (isSignup) {
                const res = await API.post('/auth/register', formData);
                if (res.data.success) setShowOTP(true);
            } else {
                const res = await API.post('/auth/login', formData);
                if (res.data.success) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    navigate('/dashboard');
                }
            }
        } catch (err) { alert(err.response?.data?.msg || "Error"); }
    };

    const handleVerifyOTP = async () => {
        console.log("Sending OTP:", formData.otp);
        try {
            const res = await API.post('/auth/verify-otp', { email: formData.email, otp: formData.otp });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/dashboard');
            }
        } catch (err) { alert("Invalid OTP"); }
    };

    return (
        <AuthBackground>
            <motion.div className="bg-[#242424]/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/5 w-full max-w-md shadow-2xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="text-[#5C7C89] italic text-sm">Design your digital flow.</p>
                </div>

                <div className="space-y-5">
                    {/* Only show Name field during Signup */}
                    <AnimatePresence mode="wait">
                        {isSignup && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative">
                                <User className="absolute left-4 top-3.5 text-[#5C7C89]" size={20} />
                                <input type="text" placeholder="Full Name" className="w-full bg-[#0D1B2A]/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#5C7C89]" 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-[#5C7C89]" size={20} />
                        <input type="email" placeholder="Email Address" className="w-full bg-[#0D1B2A]/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#5C7C89]" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-[#5C7C89]" size={20} />
                        <input type="password" placeholder="Password" className="w-full bg-[#0D1B2A]/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#5C7C89]" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <button onClick={handleAuth} className="w-full bg-[#5C7C89] hover:bg-[#5C7C89]/80 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-[#5C7C89]/20">
                        {isSignup ? 'Register' : 'Login'}
                    </button>

                    {!isSignup && (
                        <button onClick={() => handleGoogleLogin()} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-2xl transition-all flex items-center justify-center gap-3">
                            <Globe size={20} className="text-[#5C7C89]" /> Google Account
                        </button>
                    )}
                </div>

                <p onClick={() => setIsSignup(!isSignup)} className="mt-8 text-center text-white/40 text-sm cursor-pointer hover:text-white transition-colors">
                    {isSignup ? 'Already have an account? Login' : "Don't have an account? Create one"}
                </p>
            </motion.div>

            {/* OTP OVERLAY (Same as before) */}
            <AnimatePresence>
                {showOTP && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0D1B2A]/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#242424] p-8 rounded-[2rem] border border-white/10 w-full max-w-sm text-center">
                            <h3 className="text-2xl font-bold text-white mb-6">Enter OTP</h3>
                            <input type="text" maxLength="6" className="w-full bg-[#0D1B2A]/50 border border-white/10 rounded-xl py-3 text-center text-2xl tracking-[0.5em] text-white mb-6" 
                            onChange={(e) => setFormData({...formData, otp: e.target.value})} />
                            <button onClick={handleVerifyOTP} className="w-full bg-[#5C7C89] py-3 rounded-xl text-white font-bold">Verify</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthBackground>
    );
};

export default Login;