import { motion } from 'framer-motion';
import useDarkMode from '@/hooks/useDarkMode';

const ThemeToggle = () => {
  const { isDark, toggle } = useDarkMode();

  return (
    <motion.button 
      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/20 transition-colors duration-300"
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {isDark ? (
        <motion.i 
          className="fas fa-sun text-primary"
          initial={{ rotate: -45 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.3 }}
        />
      ) : (
        <motion.i 
          className="fas fa-moon text-primary"
          initial={{ rotate: 45 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
