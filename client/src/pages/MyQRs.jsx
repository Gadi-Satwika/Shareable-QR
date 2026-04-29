import { useEffect, useState } from 'react';
import { ExternalLink, BarChart3, Calendar, Trash2, QrCode,X } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import API from '../api/axios';

const MyQRs = () => {
    const [qrs, setQrs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedQR, setSelectedQR] = useState(null);

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

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">My QR Library</h1>
                <p className="text-[#5C7C89]">Monitor performance and manage your digital flows.</p>
            </header>

            {loading ? (
                <div className="text-white/20 animate-pulse text-center py-20">Loading assets...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {qrs.map((qr) => (
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
                                <div className="flex items-center gap-2 bg-[#0D1B2A]/60 px-4 py-2 rounded-full border border-white/5">
                                    <BarChart3 size={16} className="text-[#5C7C89]" />
                                    <span className="text-white font-bold">{qr.scanCount}</span>
                                    <span className="text-white/40 text-xs uppercase ml-1">Scans</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-white mb-1">{qr.title}</h3>
                            <p className="text-white/40 text-sm mb-4 font-mono truncate">{qr.originalUrl}</p>

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
                                    <button className="p-2 hover:text-white text-white/20 transition-colors">
                                        <ExternalLink size={18} />
                                    </button>
                                    <button className="p-2 hover:text-red-400 text-white/20 transition-colors">
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
                    value={`http://10.254.204.6:5000/api/qr/${selectedQR.shortId}`}
                    size={200}
                />
            </div>

            <button 
                className="w-full bg-[#5C7C89] py-3 rounded-xl text-white font-bold hover:bg-[#4a646f] transition-all"
                onClick={() => {
                    // Re-use your download logic here if you want
                    alert("Ready to download!");
                }}
            >
                Download PNG
            </button>
        </motion.div>
    </div>
)}
        </div>
    );
};

export default MyQRs;