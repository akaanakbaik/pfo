import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when page is scrolled down
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 500);

      // Calculate scroll progress for progress bar
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0) {
        setScrollProgress(Math.min((scrolled / scrollable) * 100, 100));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent"
        style={{ pointerEvents: "none" }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ width: "0%" }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ type: "tween" }}
        />
      </div>

      {/* Scroll To Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg"
            aria-label="Scroll to top"
          >
            <i className="fas fa-arrow-up"></i>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
