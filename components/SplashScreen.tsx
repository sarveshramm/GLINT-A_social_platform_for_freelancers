import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            <motion.h1
                initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-500 to-orange-500 bg-[length:200%_auto] animate-shine text-center w-full"
                style={{ letterSpacing: '-0.05em' }}
            >
                GLINT
            </motion.h1>
            <style>{`
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-shine {
          animation: shine 3s linear infinite;
        }
      `}</style>
        </motion.div>
    );
};
