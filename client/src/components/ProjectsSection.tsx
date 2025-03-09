import { motion, useScroll, useTransform, useSpring, useAnimation } from "framer-motion";
import { fadeIn, staggerContainer, staggerFade, premium3DRotate, luxuryEasing, magneticEasing, smoothSpring } from "@/lib/animations";
import { usePortfolio } from "@/context/PortfolioContext";
import { useRef, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ProjectsSection() {
  const { projects } = usePortfolio();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();
  
  // Smooth scroll effect with spring physics - using containerRef for better performance
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false // Prevent layout effect warning
  });
  
  // Premium scrolling animation with spring physics
  const scrollYSpring = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });
  const y = useTransform(scrollYSpring, [0, 1], [0, -50]);
  
  // Horizontal scroll indicators with enhanced effects
  const gradientOverlayLeft = "linear-gradient(to right, rgba(var(--background), 1) 0%, rgba(var(--background), 0) 20%)";
  const gradientOverlayRight = "linear-gradient(to left, rgba(var(--background), 1) 0%, rgba(var(--background), 0) 20%)";
  
  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging && carouselRef.current) {
        const nextIndex = (activeIndex + 1) % projects.length;
        const scrollAmount = nextIndex * 240; // adjusted card width + gap
        
        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
          });
        }
        
        setActiveIndex(nextIndex);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeIndex, projects.length, isDragging]);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollPosition = carouselRef.current.scrollLeft;
        const cardWidth = 240; // adjusted card width + gap
        const newIndex = Math.round(scrollPosition / cardWidth);
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
      }
    };
    
    const carousel = carouselRef.current;
    carousel?.addEventListener('scroll', handleScroll);
    
    return () => {
      carousel?.removeEventListener('scroll', handleScroll);
    };
  }, [activeIndex]);

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-gray-50/70 dark:bg-gray-900/50">
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative', overflow: 'hidden' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          style={{ y }}
          className="transform-gpu" // Use hardware acceleration for better performance
        >
          <div className="flex items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-poppins">
              My <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Projects</span>
            </h2>
            <div className="h-0.5 bg-gradient-to-r from-primary/20 to-purple-600/20 flex-grow ml-6"></div>
          </div>
          
          <div className="relative" style={{ position: 'relative', zIndex: 1 }}>
            {/* Gradient overlays to indicate scrollable content */}
            <div className="absolute top-0 left-0 h-full w-12 z-10 pointer-events-none" 
                 style={{ background: gradientOverlayLeft }}></div>
            <div className="absolute top-0 right-0 h-full w-12 z-10 pointer-events-none"
                 style={{ background: gradientOverlayRight }}></div>
                 
            {/* Premium project carousel with magnetic sliding effect */}
            <motion.div
              ref={carouselRef}
              className="flex overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-pl-6 transform-gpu"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              drag={isMobile ? "x" : false}
              dragConstraints={{ right: 0, left: -2000 }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              whileTap={{ cursor: "grabbing" }}
              style={{ 
                perspective: "1000px",
                transformStyle: "preserve-3d",
                willChange: isMobile ? "transform" : "auto" // Only apply will-change when needed on mobile
              }}
            >
              {/* Indicator for active slide */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1.5 pb-1 z-20">
                {projects.map((_, idx) => (
                  <motion.div 
                    key={idx}
                    className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"
                    animate={{ 
                      scale: activeIndex === idx ? 1.5 : 1
                    }}
                    style={{
                      backgroundColor: activeIndex === idx ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
              
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="project-card flex-shrink-0 w-[220px] mx-2.5 my-2 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden snap-center"
                  variants={fadeIn}
                  custom={index * 0.2}
                  whileHover={{
                    y: -5,
                    rotateY: 3,
                    rotateX: 1.5,
                    scale: 1.02,
                    boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.2)",
                    transition: { 
                      duration: 0.6, 
                      ease: luxuryEasing,
                      boxShadow: { duration: 0.3 }
                    }
                  }}
                  animate={{ 
                    opacity: isDragging ? 0.8 : 1,
                    scale: activeIndex === index ? 1.05 : 1,
                    filter: activeIndex === index ? "brightness(1.05)" : "brightness(1)"
                  }}
                  transition={{
                    scale: { duration: 0.4, ease: "easeOut" },
                    filter: { duration: 0.3 }
                  }}
                  style={{
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Premium gradient overlay for active card */}
                  {activeIndex === index && (
                    <motion.div 
                      className="absolute inset-0 rounded-xl z-0 opacity-30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.05 }}
                      style={{
                        background: "linear-gradient(120deg, hsl(var(--primary)), hsl(var(--accent)))",
                        filter: "blur(10px)"
                      }}
                    />
                  )}
                  
                  <div className="relative overflow-hidden" style={{ height: "130px" }}>
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.08,
                        filter: "contrast(1.05) brightness(1.05)"
                      }}
                      transition={{ 
                        scale: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
                        filter: { duration: 0.3 }
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-all duration-300 flex items-end">
                      <div className="p-3 text-white">
                        <div className="text-xs font-semibold bg-primary/80 backdrop-blur-sm px-2 py-0.5 rounded-full inline-block">
                          {project.category}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3.5">
                    <motion.h3 
                      className="text-base font-bold font-inter mb-1.5 line-clamp-1"
                      style={{ transform: "translateZ(5px)" }}
                    >
                      {project.title}
                    </motion.h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-2.5 line-clamp-2" style={{ transform: "translateZ(2px)" }}>
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {project.technologies.slice(0, 2).map((tech, techIndex) => (
                        <span key={techIndex} className="text-xs bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 2 && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">+{project.technologies.length - 2}</span>
                      )}
                    </div>
                    
                    <motion.div 
                      className="flex justify-between items-center"
                      style={{ transform: "translateZ(8px)" }}
                    >
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:text-primary/80 text-xs font-medium inline-flex items-center group"
                        onClick={(e) => isDragging && e.preventDefault()}
                      >
                        View Project
                        <motion.span 
                          className="ml-1 inline-block"
                          animate={{ x: [0, 2, 0] }}
                          transition={{
                            duration: 1,
                            ease: "easeInOut",
                            times: [0, 0.5, 1],
                            repeat: activeIndex === index ? Infinity : 0,
                            repeatDelay: 1
                          }}
                        >
                          →
                        </motion.span>
                      </a>
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-500 hover:text-primary transition-colors"
                          onClick={(e) => isDragging && e.preventDefault()}
                        >
                          <i className="fab fa-github"></i>
                        </a>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            className="mt-8 text-center" 
            variants={fadeIn}
            whileHover={{ rotateY: 10, rotateX: 5, z: 50 }}
            transition={{ type: "spring", damping: 26, stiffness: 170, mass: 0.6 }}
          >
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/90 to-purple-600/90 hover:from-primary hover:to-purple-600 text-white rounded-md font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>View All Projects</span>
              <i className="fas fa-chevron-right ml-2"></i>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
