import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.getAttribute('role') === 'button';
      
      setIsHovering(isClickable);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <motion.div 
        className="cursor-dot hidden md:block"
        animate={{ 
          x: position.x,
          y: position.y,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />
      <motion.div 
        className="cursor-outline hidden md:block"
        animate={{ 
          x: position.x,
          y: position.y,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.5 : 1
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 150 }}
      />
    </>
  );
};

export default CustomCursor;
