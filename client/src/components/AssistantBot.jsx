import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import API from '../api/axios';

const AssistantBot = ({ user, qrs }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', content: `Hey ${user?.name || 'there'}, how can I assist you with your QR-Flow today?` }
    ]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        try {
            // 1. Check if qrs exists. If not, use an empty array [].
            const safeQrs = qrs || []; 

            const { data } = await API.post('/chat/assistant', {
                message: input,
                userName: user?.name || 'User',
                // 2. Use the safe version here
                userContext: safeQrs.map(q => ({ 
                    title: q.title, 
                    scans: q.scanCount, 
                    category: q.category 
                }))
            });
            
            setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
        } catch (err) {
            console.error("Chat Error:", err); // Log the real error to your console
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-[#5C7C89] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
            >
                <MessageSquare color="white" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
                        className="fixed right-0 top-0 h-full w-80 bg-[#1a1a1a] border-l border-white/10 shadow-2xl z-[60] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#242424]">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">QR Assistant</h3>
                            <X className="text-white/40 cursor-pointer" onClick={() => setIsOpen(false)} />
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${msg.role === 'ai' ? 'bg-[#5C7C89]/20 text-white' : 'bg-[#5C7C89] text-white'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[#242424] border-t border-white/5 flex gap-2">
                            <input 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about your QRs..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none"
                            />
                            <button onClick={handleSend} className="text-[#5C7C89]"><Send size={20}/></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AssistantBot;