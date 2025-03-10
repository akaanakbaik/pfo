import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="md:hidden bg-white dark:bg-gray-900 py-4 px-4 shadow-md"
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
        >
          <nav>
            <ul className="space-y-4">
              <li>
                <a 
                  href="#home" 
                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={handleLinkClick}
                >
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={handleLinkClick}
                >
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a 
                  href="#projects" 
                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={handleLinkClick}
                >
                  {t('nav.projects')}
                </a>
              </li>
              <li>
                <a 
                  href="#friends" 
                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={handleLinkClick}
                >
                  {t('nav.friends')}
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={handleLinkClick}
                >
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
