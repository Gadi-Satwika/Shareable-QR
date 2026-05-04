import React, { useState, useEffect } from 'react';
import API from '../api/axios'; // Adjust path to your axios instance
import { User, Trash2, Save, Loader2 } from 'lucide-react';

const Settings = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // 1. Load current user data on mount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setName(userData.name);
            setEmail(userData.email);
        }
    }, []);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const res = await API.put('/auth/update-profile', { name });
            if (res.data.success) {
                // Update local storage so the sidebar name changes too
                const updatedUser = { ...JSON.parse(localStorage.getItem('user')), name };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert("Profile updated successfully!");
                window.location.reload(); // Refresh to sync UI
            }
        } catch (err) {
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "CRITICAL WARNING: This will permanently delete your account, all your QR codes, and all uploaded files. This action cannot be undone. Proceed?"
        );

        if (confirmed) {
            try {
                const res = await API.delete('/auth/delete-account');
                if (res.data.success) {
                    alert("Account deleted successfully. We're sorry to see you go!");
                    localStorage.clear(); // Wipe token and user data
                    window.location.href = '/login'; // Redirect to login
                }
            } catch (err) {
                alert("Error deleting account. Please try again.");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 p-6">
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">System Preferences</h1>
                <p className="text-[#5C7C89]">Manage your account identity and system security.</p>
            </header>

            <div className="space-y-6">
                <section className="bg-[#242424]/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#5C7C89]/20 p-3 rounded-2xl">
                                <User className="text-[#5C7C89]" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Profile Identity</h2>
                        </div>
                        <button 
                            onClick={handleUpdate}
                            disabled={loading}
                            className="flex items-center gap-2 bg-[#5C7C89] hover:bg-[#4a6570] text-white px-6 py-2 rounded-xl transition-all font-bold text-sm disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Save Changes
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40 ml-2">Display Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#5C7C89] outline-none transition-all" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40 ml-2">Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                disabled 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white/30 cursor-not-allowed" 
                            />
                        </div>
                    </div>
                </section>

                <section className="border border-red-500/20 bg-red-500/5 p-8 rounded-[2.5rem]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-red-400 mb-1">Danger Zone</h2>
                            <p className="text-red-400/40 text-sm">Permanently delete your account and all QR flows.</p>
                        </div>
                        <button 
                            onClick={handleDeleteAccount}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-3 rounded-xl border border-red-500/20 transition-all flex items-center gap-2 text-sm font-bold"
                        >
                            <Trash2 size={18} /> Delete Account
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;