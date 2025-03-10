import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import MusicPlayer from './MusicPlayer';
import MobileNav from './MobileNav';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { t } = useTranslation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;
    if (currentScrollY <= 0) {
      setScrollDirection(null);
      setIsScrolled(false);
    } else if (currentScrollY < lastScrollY) {
      setScrollDirection('up');
      setIsScrolled(true);
    } else if (currentScrollY > lastScrollY) {
      setScrollDirection('down');
      setIsScrolled(true);
    }
    setLastScrollY(currentScrollY);
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logoVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05,
      filter: "drop-shadow(0 0 8px rgba(184, 134, 11, 0.5))",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };

  const menuIconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 90 }
  };

  const barVariants = {
    closed: { 
      width: "100%", 
      rotate: 0, 
      y: 0,
      transition: { duration: 0.3 }
    },
    open: { 
      width: "100%", 
      rotate: 45, 
      y: 6,
      transition: { 
        width: { duration: 0.1, times: [0, 0.5, 1] },
        rotate: { delay: 0.1, duration: 0.2 },
        y: { delay: 0.1, duration: 0.2 }
      }
    }
  };

  const barVariants2 = {
    closed: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    open: { 
      opacity: 0,
      transition: { duration: 0.1 } 
    }
  };

  const barVariants3 = {
    closed: { 
      width: "100%", 
      rotate: 0, 
      y: 0,
      transition: { duration: 0.3 }
    },
    open: { 
      width: "100%", 
      rotate: -45, 
      y: -6,
      transition: { 
        width: { duration: 0.1, times: [0, 0.5, 1] },
        rotate: { delay: 0.1, duration: 0.2 },
        y: { delay: 0.1, duration: 0.2 }
      }
    }
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${
        isScrolled 
          ? 'bg-background/90 shadow-md dark:shadow-primary/5' 
          : 'bg-transparent'
      } transition-all duration-300`}
      initial={{ y: 0, opacity: 1 }}
      animate={{ 
        y: scrollDirection === 'down' ? -100 : 0,
        opacity: scrollDirection === 'down' ? 0 : 1
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto py-4 px-4 md:px-8">
        <div className="flex justify-between items-center">
          <motion.div
            className="relative"
            initial="normal"
            whileHover="hover"
            whileTap="tap"
            variants={logoVariants}
          >
            <a 
              href="#"
              className="text-2xl md:text-3xl font-display font-bold relative z-10"
            >
              <AnimatePresence mode="wait">
                <motion.span 
                  key="logo-text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  <span className="text-foreground">A</span>
                  <span className="text-primary">ka</span>
                </motion.span>
              </AnimatePresence>
            </a>
            <motion.div 
              className="absolute -bottom-1 left-0 h-0.5 bg-primary"
              initial={{ width: "0%" }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          
          <div className="flex items-center space-x-3 md:space-x-6">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <LanguageSwitcher />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <MusicPlayer />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>

            <motion.button 
              id="menu-toggle" 
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center rounded-full bg-primary/5 hover:bg-primary/10 transition-colors duration-300"
              onClick={toggleMenu}
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                rotate: isMenuOpen ? 180 : 0
              }}
              transition={{ 
                opacity: { duration: 0.3, delay: 0.4 },
                y: { duration: 0.3, delay: 0.4 },
                rotate: { duration: 0.3 }
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-5 h-0.5 bg-primary mb-1.5"
                variants={barVariants}
                initial="closed"
                animate={isMenuOpen ? "open" : "closed"}
              />
              <motion.div 
                className="w-5 h-0.5 bg-primary mb-1.5"
                variants={barVariants2}
                initial="closed"
                animate={isMenuOpen ? "open" : "closed"}
              />
              <motion.div 
                className="w-5 h-0.5 bg-primary"
                variants={barVariants3}
                initial="closed"
                animate={isMenuOpen ? "open" : "closed"}
              />
            </motion.button>
          </div>
        </div>
      </div>
      
      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </motion.header>
  );
};

export default Header;
