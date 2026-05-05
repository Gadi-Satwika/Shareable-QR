import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Download, Plus, Link as LinkIcon, Loader2, CheckCircle } from 'lucide-react';
import API from '../api/axios';
import { REDIRECT_BASE_URL, BASE_URL } from '../config';

const Dashboard = () => {
    const [url, setUrl] = useState('');
    const [qrName, setQrName] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedData, setGeneratedData] = useState(null); 

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [mode, setMode] = useState('link');
    const [file, setFile] = useState(null);

    const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

   // 1. At the top of the component, REMOVE this line:
// const [targetUrl, setTargetUrl] = useState(""); 

    const handleCreateQR = async () => {
        if (!qrName || (mode === 'link' && !url) || (mode === 'file' && !file)) {
            return alert("Please fill in all fields.");
        }

        setLoading(true);
        
        // Only show "AI is analyzing" if we are in link mode
        if (mode === 'link') setIsAnalyzing(true); 

        try {
            let finalUrl = url;

            if (mode === 'file' && file) {
                const formData = new FormData();
                formData.append('file', file);
                
                const uploadRes = await API.post('/qr/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (uploadRes.data.success) {
                    finalUrl = uploadRes.data.filePath;
                } else {
                    throw new Error("File upload failed");
                }
            }

            const res = await API.post('/qr/generate', {
                title: qrName,
                originalUrl: finalUrl,
                // Use 'url' here because that is the variable you defined in your state
                urlToAnalyze: mode === 'link' ? url : '' 
            });

            if (res.data.success) {
                setGeneratedData(res.data.data);
            }
        } catch (err) {
            console.error("Creation failed", err);
            alert("Error creating QR flow");
        } finally {
            setLoading(false);
            setIsAnalyzing(false); // This stops the pulse animation
        }
    };

    const downloadQR = () => {
        const svg = document.getElementById("qr-gen");
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
            downloadLink.download = `${qrName || 'qr-code'}.png`;
            downloadLink.click();
        };
        
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const redirectionUrl = generatedData 
        ? `${REDIRECT_BASE_URL}/${generatedData.shortId}` 
        : url;

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Hello, {user.name.split(' ')[0]}!</h1>
                <p className="text-[#5C7C89]">Your Dynamic QR Engine is active.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 bg-[#242424]/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5">
                    <h2 className="text-xl font-semibold text-white mb-8 flex items-center gap-2">
                        <Plus className="text-[#5C7C89]" /> Generate New Dynamic QR
                    </h2>

                    <div className="space-y-6">
                        <div className="relative">
                            <label className="text-white/40 text-xs uppercase tracking-widest ml-1 mb-2 block">Project Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Portfolio Campaign"
                                className="w-full bg-[#0D1B2A]/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#5C7C89]"
                                onChange={(e) => setQrName(e.target.value)}
                            />
                        </div>

                       {generatedData && (
    <div className="w-full mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
            {/* 1. Show the Category as a Tag */}
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#5C7C89]/20 text-[#5C7C89] px-3 py-1 rounded-md border border-[#5C7C89]/30">
                {generatedData.category || 'General'}
            </span>
            
            <div className="h-1.5 w-1.5 rounded-full bg-[#5C7C89] animate-pulse" />
        </div>

        {/* 2. Show your Title */}
        <h3 className="text-2xl font-black text-white mb-2">{generatedData.title}</h3>

        {/* 3. Show the AI Insight */}
        {generatedData.description && (
            <p className="text-white/40 text-sm italic leading-relaxed">
                <span className="text-[#5C7C89] font-bold not-italic mr-1">AI Note:</span> 
                {generatedData.description}
            </p>
        )}
    </div>
)}
                        <div className="relative">
                            <div className="flex items-center justify-between mb-2 ml-1">
                                <label className="text-white/40 text-xs uppercase tracking-widest block">
                                    {mode === 'link' ? 'Destination URL' : 'Upload Document'}
                                </label>
                                <div className="flex gap-4 bg-[#0D1B2A]/60 p-1 rounded-lg border border-white/5">
                                    <button 
                                        onClick={() => setMode('link')}
                                        className={`text-[10px] px-3 py-1 rounded-md transition-all ${mode === 'link' ? 'bg-[#5C7C89] text-white' : 'text-white/40'}`}
                                    >
                                        LINK
                                    </button>
                                    <button 
                                        onClick={() => setMode('file')}
                                        className={`text-[10px] px-3 py-1 rounded-md transition-all ${mode === 'file' ? 'bg-[#5C7C89] text-white' : 'text-white/40'}`}
                                    >
                                        FILE
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                {mode === 'link' ? (
                                    <>
                                        <LinkIcon className="absolute left-4 top-3.5 text-[#5C7C89]" size={18} />
                                        <input 
                                            type="text" 
                                            placeholder="https://your-link.com"
                                            className="w-full bg-[#0D1B2A]/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#5C7C89]"
                                            onChange={(e) => setUrl(e.target.value)}
                                        />
                                    </>
                                ) : (
                                    <div className="relative group">
                                        <input 
                                            type="file" 
                                            id="file-upload"
                                            className="hidden"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                        <label 
                                            htmlFor="file-upload"
                                            className="w-full bg-[#0D1B2A]/40 border border-dashed border-white/20 rounded-xl py-3 px-4 text-white/60 flex items-center gap-3 cursor-pointer hover:border-[#5C7C89]/50 transition-all"
                                        >
                                            <div className="bg-[#5C7C89]/20 p-1.5 rounded-lg">
                                                <Plus size={16} className="text-[#5C7C89]" />
                                            </div>
                                            {file ? <span className="text-white">{file.name}</span> : "Select PDF, Image or Doc"}
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={handleCreateQR}
                            disabled={loading}
                            className="w-full bg-[#5C7C89] hover:bg-[#4a646f] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Save & Generate Code"}
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="bg-[#1a1a1a]/60 backdrop-blur-xl p-8 rounded-[2rem] border border-[#5C7C89]/20 flex flex-col items-center shadow-2xl">
                    <span className="text-white/40 text-xs uppercase tracking-[0.2em] mb-6">Live Preview</span>
                    
                    <div className="bg-white p-5 rounded-[2.5rem] shadow-[0_0_60px_rgba(92,124,137,0.2)] mb-8 transition-transform hover:scale-105">
                        <QRCodeSVG 
                            id="qr-gen"
                            value={redirectionUrl || "https://qr-flow.com"} 
                            size={200}
                            level={"H"}
                        />
                    </div>

                    {generatedData && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
                            <div className="flex items-center justify-center gap-2 text-green-400 text-sm mb-1">
                                <CheckCircle size={16} /> Saved to Database
                            </div>
                            <p className="text-white/60 text-xs font-mono">ID: {generatedData.shortId}</p>
                        </motion.div>
                    )}

                    <button 
                        onClick={downloadQR}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        <Download size={18} /> Download Asset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;