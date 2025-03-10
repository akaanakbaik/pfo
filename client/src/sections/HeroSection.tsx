import { motion, useMotionValue, useTransform, animate, useScroll } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';

const HeroSection = () => {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  
  // Parallax floating effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Text animation
  const textIndex = useMotionValue(0);
  const [roles] = useState(['Junior Developer', 'UI Enthusiast', 'Problem Solver']);
  const baseText = useTransform(textIndex, (latest) => {
    return roles[latest % roles.length] || roles[0];
  });
  const [displayText, setDisplayText] = useState(roles[0]);
  
  useEffect(() => {
    // Animate through the text options
    const intervalId = setInterval(() => {
      const next = (textIndex.get() + 1) % roles.length;
      animate(textIndex, next, { duration: 0.5 });
      setDisplayText(roles[next]);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [textIndex, roles]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setMousePosition({ x, y });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const avatarVariants = {
    initial: { scale: 0, opacity: 0, rotate: -90 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        damping: 12, 
        stiffness: 100,
        delay: 0.3
      }
    }
  };
  
  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: [0.5, 0.8, 0.5], 
      scale: [1, 1.05, 1],
      transition: { 
        repeat: Infinity, 
        duration: 3,
        ease: "easeInOut"
      }
    }
  };
  
  const underlineVariants = {
    initial: { width: "0%", opacity: 0 },
    animate: { 
      width: "100%", 
      opacity: 1,
      transition: { 
        delay: 1.5,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  const titleCharacters = "Aka".split("");
  
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 pb-12 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent to-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1.5 }}
        />
        {/* Animated particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.3
            }}
            animate={{ 
              y: [null, `${Math.random() * 20 - 10}%`],
              x: [null, `${Math.random() * 20 - 10}%`],
              opacity: [null, Math.random() * 0.3 + 0.1, Math.random() * 0.5 + 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "mirror", 
              duration: Math.random() * 10 + 10,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <motion.div 
        ref={containerRef}
        className="container mx-auto px-4 md:px-8 relative z-10"
        style={{ 
          opacity, 
          scale,
          x: mousePosition.x * -0.02,
          y: mousePosition.y * -0.02
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center">
          <motion.div 
            className="relative inline-block mb-8"
            initial="initial"
            animate="animate"
            variants={avatarVariants}
          >
            <motion.div 
              className="absolute -inset-4 rounded-full bg-primary/20 blur-md z-0"
              variants={glowVariants}
            />
            <div className="relative z-10">
              <div className="rounded-full p-1 bg-gradient-to-tr from-primary/80 via-primary to-primary/80 rotate-0">
                <img 
                  src="https://nauval.mycdn.biz.id/download/1741597554570.jpeg" 
                  alt="Aka" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-background shadow-lg" 
                />
              </div>
            </div>
          </motion.div>
          
          <div className="overflow-hidden mb-2">
            <motion.h1 
              className="text-4xl md:text-6xl font-display font-bold inline-block"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.5,
                ease: [0.165, 0.84, 0.44, 1]
              }}
            >
              <span className="text-foreground">I'm </span>
              {titleCharacters.map((char, index) => (
                <motion.span
                  key={index}
                  className="text-primary inline-block"
                  initial={{ y: 100, opacity: 0, rotateX: -90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.7 + (index * 0.1),
                    ease: [0.215, 0.61, 0.355, 1]
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </div>
          
          <motion.div 
            className="flex items-center justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <motion.div className="h-0.5 w-12 bg-primary/60" variants={underlineVariants} initial="initial" animate="animate" />
            <motion.p 
              className="mx-4 text-lg md:text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              {displayText}
            </motion.p>
            <motion.div className="h-0.5 w-12 bg-primary/60" variants={underlineVariants} initial="initial" animate="animate" />
          </motion.div>
          
          <motion.div 
            className="mt-6 max-w-2xl mx-auto text-base md:text-lg opacity-90"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <p className="leading-relaxed">{t('hero.intro')}</p>
          </motion.div>
          
          <motion.div 
            className="mt-12 flex flex-wrap justify-center gap-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <motion.a 
              href="#about" 
              className="group relative px-7 py-3.5 overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-white font-medium rounded-md shadow-lg flex items-center"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px -5px rgba(184, 134, 11, 0.4), 0 8px 10px -6px rgba(184, 134, 11, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">{t('hero.aboutBtn')}</span>
              <motion.i 
                className="fas fa-arrow-right ml-2 relative z-10"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
              <motion.div 
                className="absolute inset-0 bg-white"
                initial={{ x: "-100%", opacity: 0.1 }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.a>
            
            <motion.a 
              href="#contact" 
              className="group relative px-7 py-3.5 overflow-hidden bg-transparent border-2 border-primary text-primary font-medium rounded-md shadow-md"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(184, 134, 11, 0.1)",
                boxShadow: "0 10px 25px -5px rgba(184, 134, 11, 0.2), 0 8px 10px -6px rgba(184, 134, 11, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">{t('hero.contactBtn')}</span>
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 w-full bg-primary origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ y: -10, opacity: 0 }}
        animate={{ 
          y: [0, 8, 0], 
          opacity: [0, 1, 0.8, 1]
        }}
        transition={{ 
          y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
          opacity: { delay: 2.5, duration: 1 }
        }}
      >
        <motion.a 
          href="#about" 
          className="text-primary flex flex-col items-center"
          whileHover={{ scale: 1.2 }}
        >
          <span className="text-xs mb-1 opacity-80">Scroll</span>
          <i className="fas fa-chevron-down text-base"></i>
        </motion.a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
