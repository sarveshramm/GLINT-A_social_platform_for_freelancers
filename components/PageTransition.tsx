import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    },
    out: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
};

interface PageTransitionProps {
    children: ReactNode;
    className?: string; // Optional wrapper class
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className={`w-full h-full ${className}`}
        >
            {children}
        </motion.div>
    );
};
