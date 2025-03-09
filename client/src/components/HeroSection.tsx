import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import StatsBar from "@/components/StatsBar";
import { fadeIn, slideInRight, slideInUp, magneticTextReveal, luxuryCardHover } from "@/lib/animations";
import { usePortfolio } from "@/context/PortfolioContext";

export default function HeroSection() {
  const { profile } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  
  // Parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  // Transform values for parallax elements
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  
  // Magnetic effect for profile picture
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!avatarRef.current) return;
    const rect = avatarRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center (0 to 1)
    mouseX.set((e.clientX - centerX) / 30);
    mouseY.set((e.clientY - centerY) / 30);
  };
  
  // Spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  if (!profile) return null;
  
  // Split text for individual letter animations
  const titleWords = profile.name.split("");

  return (
    <section 
      ref={containerRef}
      id="hero" 
      className="min-h-screen pt-28 pb-16 relative flex items-center overflow-hidden"
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-60 pointer-events-none"
        style={{ y, opacity }}
      />
      <div className="absolute inset-0 backdrop-blur-[1px] pointer-events-none"></div>
      
      {/* Animated Background Shapes */}
      <motion.div 
        className="absolute -bottom-64 -left-64 w-[500px] h-[500px] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl pointer-events-none"
        animate={{ 
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute -top-64 -right-64 w-[500px] h-[500px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-3xl pointer-events-none"
        animate={{ 
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: "easeInOut"
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between">
          <motion.div
            className="lg:w-1/2 mb-10 lg:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            style={{ scale }}
          >
            <motion.span 
              className="inline-block px-4 py-1 mb-4 bg-primary/10 text-primary rounded-full font-inter text-sm backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              {profile.tagline}
            </motion.span>
            
            <h1 className="text-4xl md:text-6xl font-bold font-poppins mb-6 relative">
              <motion.span 
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Hi, I'm
              </motion.span>
              
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent inline-flex">
                {titleWords.map((letter, index) => (
                  <motion.span
                    key={index}
                    className="inline-block relative overflow-hidden"
                    variants={magneticTextReveal}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </span>
            </h1>
            
            <motion.h2 
              className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 mb-8 font-inter"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              {profile.title}
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {profile.description}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <motion.a
                href="#contact"
                className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600/90 text-white rounded-md font-medium transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 8px rgb(255,255,255)",
                  boxShadow: "0 10px 25px -5px rgba(var(--primary), 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Get in Touch
              </motion.a>
              
              <motion.a
                href="#projects"
                className="px-6 py-3 border border-primary text-primary hover:bg-primary/10 rounded-md font-medium transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(var(--primary), 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                View Projects
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:w-1/2 flex justify-center lg:justify-end relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInRight}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              mouseX.set(0);
              mouseY.set(0);
            }}
          >
            <div className="relative">
              {/* Animated glowing orbs */}
              <motion.div
                className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/20 dark:bg-green-500/30 rounded-full blur-3xl z-0"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-3xl z-0"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              
              {/* Magnetic profile picture */}
              <motion.div
                ref={avatarRef}
                className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/30 dark:border-primary/30 relative z-10"
                style={{ 
                  x: springX,
                  y: springY,
                  rotateX: springY,
                  rotateY: springX,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.15), 0 0 0 2px rgba(var(--primary), 0.2)"
                }}
                whileHover={{ scale: 1.02 }}
                animate={{ 
                  boxShadow: [
                    "0 20px 50px rgba(0,0,0,0.15), 0 0 0 2px rgba(var(--primary), 0.2)",
                    "0 20px 50px rgba(0,0,0,0.15), 0 0 0 3px rgba(var(--primary), 0.3)",
                    "0 20px 50px rgba(0,0,0,0.15), 0 0 0 2px rgba(var(--primary), 0.2)"
                  ]
                }}
                transition={{
                  boxShadow: {
                    repeat: Infinity,
                    duration: 2,
                  }
                }}
              >
                <motion.div
                  className="w-full h-full absolute inset-0 bg-gradient-to-tr from-primary/40 to-purple-600/40 opacity-0 z-10"
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                />
                <img
                  src={profile.avatar}
                  alt={`${profile.name} profile picture`}
                  className="w-full h-full object-cover"
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 flex items-end justify-center pb-8"
                  whileHover={{ opacity: 1 }}
                >
                  <motion.span 
                    className="text-white text-sm font-medium px-4 py-2 bg-primary/80 backdrop-blur-sm rounded-full"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Creative Developer
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={slideInUp}
          className="mt-16 lg:mt-24"
        >
          <StatsBar />
        </motion.div>
      </div>
    </section>
  );
}
