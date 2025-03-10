import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className="mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a href="#" className="text-2xl font-display font-bold text-primary">
              <span className="text-white">A</span>ka
            </a>
            <p className="mt-2 text-sm text-gray-400 max-w-xs">{t('footer.description')}</p>
          </motion.div>
          
          <motion.div 
            className="text-center md:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-gray-400">© {currentYear} Aka. All rights reserved.</p>
            <p className="mt-2 text-sm text-gray-500">{t('footer.quote')}</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
