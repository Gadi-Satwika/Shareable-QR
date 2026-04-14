import { useState } from 'react';
import { LayoutDashboard, QrCode, BarChart3, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={24} />, path: '/dashboard' },
        { name: 'My QRs', icon: <QrCode size={24} />, path: '/my-qrs' },
        { name: 'Analytics', icon: <BarChart3 size={24} />, path: '/analytics' },
        { name: 'Settings', icon: <Settings size={24} />, path: '/settings' },
    ];

    return (
        <motion.div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ width: 80 }}
            animate={{ width: isHovered ? 260 : 80 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="fixed left-6 top-6 bottom-6 z-50 bg-[#242424]/60 backdrop-blur-xl text-white flex flex-col p-4 rounded-[2rem] shadow-[10px_0_30px_rgba(0,0,0,0.5)] border border-white/5"
        >
            {/* Logo Section - Updated to Royal Purple */}
            <div className="flex items-center gap-4 mb-10 pl-2">
    <div className="bg-[#5C7C89] p-2 rounded-xl shadow-lg shadow-[#5C7C89]/20">
        <QrCode size={28} className="text-white" />
    </div>
    <AnimatePresence>
        {isHovered && (
            <motion.span 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-bold tracking-tight whitespace-nowrap text-white"
            >
                QR-<span className="text-[#5C7C89]">Flow</span>
            </motion.span>
        )}
    </AnimatePresence>
</div>
            
            {/* Navigation */}
            <nav className="flex-1 space-y-3">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.name} 
                            to={item.path}
                            className={`relative flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 ${
                                // Replace the purple with the Slate blue from your palette
isActive ? 'bg-[#5C7C89] text-white shadow-lg shadow-[#5C7C89]/30' : 'hover:bg-white/5'
                            }`}
                        >
                            <div className="min-w-[24px]">{item.icon}</div>
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.span 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="font-medium whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <button className="flex items-center gap-4 p-3 mt-auto text-[#D8D8F6]/50 hover:text-[#7E3F8F] transition-colors pl-3">
                <LogOut size={24} />
                <AnimatePresence>
                    {isHovered && (
                        <motion.span 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="font-medium"
                        >
                            Logout
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>
        </motion.div>
    );
};

export default Sidebar;