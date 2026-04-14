import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const GlowCursor = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    
    // Smooth physics for the "vibration" feel
    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            x.set(e.clientX - 16);
            y.set(e.clientY - 16);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [x, y]);

    return (
    <>
        <motion.div
            style={{ x, y }}
            className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white z-[9999] pointer-events-none"
        />
        <motion.div
            style={{ 
                x: useSpring(x, { damping: 40, stiffness: 120 }), 
                y: useSpring(y, { damping: 40, stiffness: 120 }) 
            }}
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/20 z-[9998] pointer-events-none -translate-x-[12px] -translate-y-[12px]"
        />
    </>
);
};

export default GlowCursor