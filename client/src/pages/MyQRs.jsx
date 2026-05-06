import { useEffect, useState } from 'react';
import { ExternalLink, BarChart3, Calendar, Trash2, QrCode,X, Monitor, Smartphone , Search} from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import API from '../api/axios';
import { REDIRECT_BASE_URL, BASE_URL } from '../config';

import AssistantBot from '../components/AssistantBot';

const MyQRs = () => {
    const [qrs, setQrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQR, setSelectedQR] = useState(null);
    const [analysisQR, setAnalysisQR] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const user = JSON.parse(localStorage.getItem('user')); // Or however you store your auth data

    useEffect(() => {
        fetchQRs();
    }, []);

    const fetchQRs = async () => {
        try {
            const res = await API.get('/qr/all');
            if (res.data.success) {
                setQrs(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch QRs", err);
        } finally {
            setLoading(false);
        }
    };

   const handleDelete = async (id) => {
    // 1. Professional Confirmation
    if (window.confirm("Are you sure you want to permanently delete this QR flow? This cannot be undone.")) {
        try {
            // 2. THE REAL WORK: Delete from MongoDB via the route we created
            const res = await API.delete(`/qr/${id}`);

            if (res.data.success) {
                // 3. UI SYNC: Filter the local state so the card disappears instantly
                setQrs((prevQrs) => prevQrs.filter((qr) => qr._id !== id));
                alert("QR successfully removed from database.");
            }
        } catch (err) {
            console.error("Delete Error:", err);
            alert("Failed to delete from server. Please check your connection.");
        }
    }
};

    const downloadPopupQR = (title, shortId) => {
        const svg = document.getElementById("modal-qr");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `${title}.png`;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const filteredQrs = qrs.filter(qr => {
        const matchesSearch = qr.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || qr.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories for the dropdown menu
    const categories = ['All', ...new Set(qrs.map(qr => qr.category).filter(Boolean))];

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">My QR Library</h1>
                <p className="text-[#5C7C89]">Monitor performance and manage your digital flows.</p>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3 text-[#5C7C89]" size={20} />
                    <input 
                        type="text"
                        placeholder="Search by title..."
                        className="w-full bg-[#242424]/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#5C7C89]/50"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Category Filter Dropdown */}
                <select 
                    className="bg-[#242424]/40 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-[#5C7C89]/50 appearance-none cursor-pointer"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-[#1a1a1a] text-white">
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-white/20 animate-pulse text-center py-20">Loading assets...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredQrs.map((qr) => (
                        <motion.div 
                            key={qr._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#242424]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 hover:border-[#5C7C89]/30 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-[#5C7C89]/20 p-3 rounded-2xl">
                                    <QrCode className="text-[#5C7C89]" size={24} />
                                </div>
                                
                                {/* Added: AI Category Badge */}
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-[0.15em] bg-[#5C7C89]/10 text-[#5C7C89] px-3 py-1 rounded-lg border border-[#5C7C89]/20">
                                        {qr.category || 'General'}
                                    </span>
                                    
                                    <button 
                                        onClick={() => setAnalysisQR(qr)} 
                                        className="flex items-center gap-2 bg-[#0D1B2A]/60 px-4 py-2 rounded-full border border-white/5 hover:border-[#5C7C89]/50 transition-all cursor-pointer"
                                    >
                                        <BarChart3 size={16} className="text-[#5C7C89]" />
                                        <span className="text-white font-bold">{qr.scanCount}</span>
                                        <span className="text-white/40 text-[10px] uppercase ml-1">Scans</span>
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-white mb-1">{qr.title}</h3>
                            
                            {/* Added: AI Description/Note */}
                            {qr.description && (
                                <p className="text-[#5C7C89] text-[10px] italic mb-2 line-clamp-1 opacity-60">
                                    {qr.description}
                                </p>
                            )}

                            <p className="text-white/40 text-xs mb-8 truncate">
                                {qr.originalUrl.startsWith('http') 
                                    ? qr.originalUrl 
                                    : `${BASE_URL}${qr.originalUrl}`}
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-white/40 text-xs">
                                    <Calendar size={14} />
                                    {new Date(qr.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button 
                                        onClick={() => setSelectedQR(qr)}
                                        className="p-2 hover:text-white text-white/20 transition-colors"
                                    >
                                        <QrCode size={18} />
                                    </button>
                                    <a 
                                        href={qr.originalUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2 hover:text-white text-white/20 transition-colors"
                                        title="Visit Link"
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                    <button 
                                        onClick={() => handleDelete(qr._id)}
                                        className="p-2 hover:text-red-400 text-white/20 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {qrs.length === 0 && !loading && (
                <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                    <p className="text-white/20">No QR codes generated yet.</p>
                </div>
            )}

            {selectedQR && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0D1B2A]/90 backdrop-blur-md p-4">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#242424] border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full text-center relative shadow-2xl"
                    >
                        <button 
                            onClick={() => setSelectedQR(null)}
                            className="absolute top-6 right-6 text-white/40 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-2">{selectedQR.title}</h3>
                        <p className="text-white/40 text-xs mb-8 truncate px-4">{selectedQR.originalUrl}</p>

                        <div className="bg-white p-6 rounded-[2rem] inline-block mb-8">
                            <QRCodeSVG 
                                id="modal-qr" // Important: ID must match the helper
                                value={`${REDIRECT_BASE_URL}/${selectedQR.shortId}`}
                                size={200}
                            />
                        </div>

                        <button 
                            onClick={() => downloadPopupQR(selectedQR.title, selectedQR.shortId)}
                            className="w-full bg-[#5C7C89] py-3 rounded-xl text-white font-bold"
                        >
                            Download PNG
                        </button>
                    </motion.div>
                </div>
            )}

            {analysisQR && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0D1B2A]/90 backdrop-blur-md p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#242424] border border-white/10 p-8 rounded-[2.5rem] max-w-lg w-full relative shadow-2xl"
                    >
                        <button 
                            onClick={() => setAnalysisQR(null)}
                            className="absolute top-6 right-6 text-white/40 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-1">Scan Intelligence</h3>
                            <p className="text-[#5C7C89] text-sm uppercase tracking-widest">{analysisQR.title}</p>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {analysisQR.scans && analysisQR.scans.length > 0 ? (
                                analysisQR.scans.slice().reverse().map((scan, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-[#5C7C89]/20 p-2 rounded-xl">
                                                {scan.device === 'Mobile' ? <Smartphone size={18} className="text-[#5C7C89]" /> : <Monitor size={18} className="text-[#5C7C89]" />}
                                            </div>
                                            <div>
                                                <div className="text-white text-sm font-medium">{scan.device} User</div>
                                                <div className="text-white/30 text-[10px] uppercase">
                                                    {new Date(scan.timestamp).toLocaleDateString()} • {new Date(scan.timestamp).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-mono text-[#5C7C89] bg-[#5C7C89]/10 px-2 py-1 rounded-md">
                                            {scan.browser || 'Chrome'}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-white/20">No scan data recorded yet.</div>
                            )}
                        </div>

                        <button 
                            onClick={() => setAnalysisQR(null)}
                            className="w-full mt-8 bg-white/5 border border-white/10 py-3 rounded-xl text-white/60 font-medium hover:bg-white/10 transition-all"
                        >
                            Close Insights
                        </button>
                    </motion.div>
                </div>
            )}

             <AssistantBot user={user} qrs={qrs} />
        </div>
    );
};

export default MyQRs;