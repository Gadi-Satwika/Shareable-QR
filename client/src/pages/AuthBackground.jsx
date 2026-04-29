import { motion } from 'framer-motion';

const AuthBackground = ({ children }) => {
    return (
        <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-[#0D1B2A] overflow-hidden">
            {/* The Professional Petrol Gradient */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    background: `radial-gradient(circle at center, #1F4959 0%, #0D1B2A 100%)`
                }}
            />
            {/* The Form Content */}
            <div className="relative z-10 w-full max-w-md px-6">
                {children}
            </div>
        </div>
    );
};
export default AuthBackground;
