import { useEffect } from "react";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import NetworkSection from "@/components/NetworkSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import ScrollToTop from "@/components/ScrollToTop";
import Preloader from "@/components/Preloader";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Home() {
  const { isLoading } = usePortfolio();

  // Custom cursor effect
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor-effect", "bg-primary");

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    // Only add custom cursor on desktop
    if (window.innerWidth > 1024) {
      document.body.appendChild(cursor);
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (cursor.parentNode) {
        document.body.removeChild(cursor);
      }
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <Preloader />
      {/* Background music audio element - optimized for performance */}
      <audio
        id="backgroundMusic"
        src="https://file.btch.rf.gd/file/qayd1gnv82otafiu97py.mp3"
        loop
        preload="metadata"
        style={{ display: 'none' }}
        crossOrigin="anonymous"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
        className="min-h-screen flex flex-col"
      >
        <Header />
        
        <main className="flex-grow">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <NetworkSection />
          <ContactSection />
        </main>
        
        <Footer />
        <MusicPlayer />
        <ScrollToTop />
      </motion.div>
    </>
  );
}
