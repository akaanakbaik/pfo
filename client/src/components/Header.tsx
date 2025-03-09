import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTheme } from "@/context/ThemeContext";
import { useMusic } from "@/context/MusicContext";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { isPlaying, toggleMusic } = useMusic();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    if (href?.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 100,
          behavior: "smooth",
        });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="#hero" onClick={handleNavClick} className="flex items-center space-x-2">
          <span className="font-poppins font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Portfolio
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="nav-link font-inter font-medium flex items-center space-x-2 hover:text-primary transition-colors dark:hover:text-primary"
            >
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Controls Group */}
        <div className="flex items-center space-x-4">
          {/* Music Control */}
          <button
            onClick={toggleMusic}
            className="relative w-8 h-8 flex justify-center items-center text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle music"
          >
            <i className={`fas ${isPlaying ? "fa-volume-up" : "fa-volume-mute"}`}></i>
            {isPlaying && (
              <div className="music-visualizer absolute top-2 left-1/2 transform -translate-x-1/2">
                {[1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    style={{ width: 3, marginRight: 1, display: "inline-block", backgroundColor: "currentColor" }}
                    animate={{ height: ["5px", "20px", "5px"] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex justify-center items-center text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            <i className={`fas ${isDarkMode ? "fa-moon" : "fa-sun"}`}></i>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden w-8 h-8 flex justify-center items-center text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 absolute w-full left-0 top-full py-4 px-4 shadow-lg z-50"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="nav-link font-inter font-medium flex items-center space-x-2 hover:text-primary py-2 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>{link.label}</span>
                </a>
              ))}
              <Link to="/admin">
                <a className="nav-link font-inter font-medium flex items-center space-x-2 hover:text-primary py-2 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Admin Dashboard</span>
                </a>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
