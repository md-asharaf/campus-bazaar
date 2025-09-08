// src/components/motion/AnimatedSection.tsx
"use client";
import { motion } from "framer-motion";
import React from "react";

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
    children,
    className,
    delay = 0.2,
}) => {
    return (
        <motion.section
            className={className}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay }}
        >
            {children}
        </motion.section>
    );
};
