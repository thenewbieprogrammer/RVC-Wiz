import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export default function GlassCard({ 
  children, 
  className = "", 
  hover = true,
  delay = 0 
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      className={`glass-card ${className}`}
    >
      {children}
    </motion.div>
  );
}
