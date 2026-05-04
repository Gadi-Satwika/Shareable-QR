import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ArrowRight, Zap, BarChart3, Shield, Globe, Layers } from 'lucide-react';

const Landing = () => {
    return (
        <div className="w-full flex flex-col items-center selection:bg-[#5C7C89] bg-[#0D1B2A] min-h-screen overflow-x-hidden">
            
            {/* --- PREMIUM NAVIGATION --- */}
            <nav className="w-full max-w-7xl px-6 md:px-12 h-24 flex justify-between items-center z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-[#5C7C89] p-2 md:p-2.5 rounded-2xl shadow-xl shadow-[#5C7C89]/20">
                        <QrCode size={24} strokeWidth={2.5} className="text-white" />
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase">QR-Flow</span>
                </div>
                <Link to="/login" className="bg-white/5 hover:bg-white text-white hover:text-[#0D1B2A] px-6 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-black transition-all border border-white/10 backdrop-blur-md uppercase tracking-widest">
                    Login
                </Link>
            </nav>

            {/* --- HERO SECTION: HIGH DENSITY & RESPONSIVE --- */}
            <main className="w-full max-w-7xl px-6 md:px-12 pt-12 md:pt-32 pb-24 md:pb-40 flex flex-col items-center text-center">
                
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 md:mb-10 backdrop-blur-md">
                    <div className="w-2 h-2 bg-[#5C7C89] rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5C7C89]">Engine v2.0 Active</span>
                </div>

                {/* Main Heading: Responsive Sizing */}
                <h1 className="text-5xl sm:text-6xl md:text-[8rem] lg:text-[10rem] font-black tracking-[-0.06em] leading-[0.95] md:leading-[0.85] mb-8 md:mb-12 text-white">
                    Smart QRs. <br/>
                    <span className="text-[#5C7C89] italic">Next-Gen.</span>
                </h1>

                {/* Description: Professional Weight */}
                <p className="text-lg md:text-2xl text-white/40 max-w-3xl mb-12 md:mb-16 leading-relaxed font-medium">
                    The elite infrastructure for dynamic link redirection. <br className="hidden md:block" />
                    Host files, manage analytics, and evolve your codes in real-time.
                </p>

                {/* Exclusive CTA: Responsive Padding */}
                <Link to="/login" className="group relative bg-[#5C7C89] text-white px-8 md:px-14 py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] font-black text-xl md:text-2xl flex items-center gap-4 hover:bg-[#4a6570] transition-all shadow-2xl shadow-[#5C7C89]/30 mb-24 md:mb-40">
                    Get Started Free
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
                </Link>

                {/* --- THE "NOT EMPTY" BENTO GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full text-left">
                    
                    {/* Large Card: Fixed Text Color */}
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] flex flex-col justify-between hover:bg-white/[0.07] transition-all group">
                        <BarChart3 className="text-[#5C7C89] mb-12 md:mb-20 group-hover:scale-110 transition-transform" size={48} />
                        <div>
                            <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter text-white">Live Scan Lifecycle</h3>
                            <p className="text-white/30 text-base md:text-lg leading-relaxed">Track device fingerprinting, browser origins, and scan frequency with millisecond accuracy.</p>
                        </div>
                    </div>

                    {/* Accent Card: Fixed Text Color */}
                    <div className="bg-[#5C7C89]/10 border border-[#5C7C89]/20 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] flex flex-col justify-between hover:bg-[#5C7C89]/20 transition-all">
                        <Globe className="text-white mb-12 md:mb-20" size={48} />
                        <h3 className="text-3xl font-black tracking-tighter text-white">Global <br/> Edge</h3>
                    </div>

                    <FeatureCard icon={<Shield />} title="Secure Assets" desc="End-to-end encrypted file hosting for every QR asset." />
                    <FeatureCard icon={<Zap />} title="Dynamic Logic" desc="Change destinations instantly without reprinting codes." />
                    <FeatureCard icon={<Layers />} title="Management" desc="A unified library for all your dynamic flows." />
                </div>
            </main>

            {/* --- EXCLUSIVE FOOTER: Responsive Layout --- */}
            <footer className="w-full max-w-7xl px-6 md:px-12 py-12 md:py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10 opacity-30">
                <div className="flex items-center gap-3">
                    <QrCode size={20} className="text-white" />
                    <span className="text-sm font-black tracking-widest uppercase text-white">QR-Flow Engine</span>
                </div>
                <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-white">
                    <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                    <span className="hover:text-white cursor-pointer transition-colors">Infrastructure</span>
                    <span className="hover:text-white cursor-pointer transition-colors">© 2026</span>
                </div>
            </footer>
        </div>
    );
};

// --- Corrected FeatureCard with Explicit White Text ---
const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] hover:border-[#5C7C89]/50 transition-all group">
        <div className="text-[#5C7C89] mb-6 md:mb-8 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-lg md:text-xl font-black mb-4 tracking-tight uppercase text-white">{title}</h3>
        <p className="text-white/20 text-sm leading-relaxed">{desc}</p>
    </div>
);

export default Landing;