import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const DesktopNav = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 300) {
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'friends', label: t('nav.friends') },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <motion.div 
      className="hidden md:block fixed left-8 top-1/2 transform -translate-y-1/2 z-40"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <nav>
        <ul className="space-y-8">
          {navItems.map(item => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`} 
                className={`nav-link group flex items-center ${activeSection === item.id ? 'text-primary' : ''}`}
              >
                <motion.span 
                  className={`w-2 h-2 rounded-full ${activeSection === item.id ? 'bg-primary' : 'bg-gray-400 dark:bg-gray-600'}`}
                  animate={{ scale: activeSection === item.id ? 1.5 : 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="ml-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default DesktopNav;
