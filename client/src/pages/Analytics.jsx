import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Smartphone, Globe } from 'lucide-react';
import API from '../api/axios';

const Analytics = () => {
    const [qrs, setQrs] = useState([]);
    const totalScans = qrs.reduce((acc, curr) => acc + curr.scanCount, 0);

    useEffect(() => {
        const fetchAll = async () => {
            const res = await API.get('/qr/all');
            setQrs(res.data.data);
        };
        fetchAll();
    }, []);

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Performance Intelligence</h1>
                <p className="text-[#5C7C89]">Data-driven insights for your QR network.</p>
            </header>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { label: 'Total Scans', val: totalScans, icon: TrendingUp },
                    { label: 'Active Flows', val: qrs.length, icon: BarChart3 },
                    { label: 'Mobile Users', val: '84%', icon: Smartphone },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#242424]/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl">
                        <stat.icon className="text-[#5C7C89] mb-4" size={28} />
                        <div className="text-3xl font-bold text-white">{stat.val}</div>
                        <div className="text-white/40 text-xs uppercase tracking-widest mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Traffic Leaderboard */}
            <div className="bg-[#242424]/40 border border-white/5 rounded-[2.5rem] p-8">
                <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
                    <Users className="text-[#5C7C89]" /> Most Active Flows
                </h3>
                
                <div className="space-y-6">
                    {qrs.sort((a, b) => b.scanCount - a.scanCount).slice(0, 5).map((qr, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/80 font-medium">{qr.title}</span>
                                <span className="text-[#5C7C89] font-mono">{qr.scanCount} scans</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-[#5C7C89] h-full transition-all duration-1000" 
                                    style={{ width: `${(qr.scanCount / (totalScans || 1)) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;