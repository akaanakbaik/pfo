import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import DesktopNav from '@/components/DesktopNav';
import StatsBox from '@/components/StatsBox';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import ProjectsSection from '@/sections/ProjectsSection';
import FriendsSection from '@/sections/FriendsSection';
import ContactSection from '@/sections/ContactSection';
import Footer from '@/sections/Footer';
import useVisitorCount from '@/hooks/useVisitorCount';

const Home = () => {
  const { incrementVisitorCount } = useVisitorCount();

  useEffect(() => {
    // Increment visitor count on first visit
    if (!sessionStorage.getItem('visited')) {
      incrementVisitorCount();
      sessionStorage.setItem('visited', 'true');
    }

    // Initialize scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [incrementVisitorCount]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <DesktopNav />
      <StatsBox />
      
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <FriendsSection />
        <ContactSection />
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Home;
