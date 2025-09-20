import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = true,
  glow = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      className={clsx(
        'glass-card rounded-2xl p-6 transition-all duration-300',
        hover && 'hover:shadow-2xl cursor-pointer',
        glow && 'ring-2 ring-blue-500/20 shadow-blue-500/25',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;