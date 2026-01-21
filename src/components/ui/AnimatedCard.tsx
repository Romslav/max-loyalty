import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onClick,
  hoverEffect = 'lift',
  delay = 0,
  className,
  style,
}) => {
  const getHoverVariant = () => {
    switch (hoverEffect) {
      case 'lift':
        return {
          y: -8,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        };
      case 'glow':
        return {
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
        };
      case 'scale':
        return {
          scale: 1.05,
        };
      case 'none':
      default:
        return {};
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={getHoverVariant()}
      onClick={onClick}
      className={className}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
