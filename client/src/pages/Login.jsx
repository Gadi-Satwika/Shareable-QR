import { motion } from 'framer-motion';
import { Mail, Lock, Globe } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    // 1. Define the Google Login Handler
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                // 'response.access_token' is what we send to the backend
                const res = await API.post('/auth/google', { 
                    idToken: response.access_token 
                });

                if (res.data.success) {
                    // Store the token and user info
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    
                    // Redirect to dashboard
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error("Backend Auth Error:", err);
                alert("Google Sign-In failed to connect to backend.");
            }
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    return (
        <div className="flex h-[80vh] items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#242424]/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/5 w-full max-w-md shadow-2xl"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-slate italic text-sm">Design your digital flow.</p>
                </div>

                <div className="space-y-6">
                    {/* The Google Button - Now Functional! */}
                    <button 
                        onClick={() => handleGoogleLogin()}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Globe size={20} className="text-slate" />
                        Continue with Google
                    </button>

                    <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-white/5"></div>
                        <span className="flex-shrink mx-4 text-white/30 text-xs uppercase tracking-widest">Or login manually</span>
                        <div className="flex-grow border-t border-white/5"></div>
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate" size={20} />
                        <input type="email" placeholder="Email Address" className="w-full bg-darkest/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-slate transition-all" />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate" size={20} />
                        <input type="password" placeholder="Password" className="w-full bg-darkest/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-slate transition-all" />
                    </div>

                    <button className="w-full bg-slate hover:bg-[#4a646f] text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-slate/20">
                        Login
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;