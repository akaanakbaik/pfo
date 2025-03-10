import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AboutSection = () => {
  const { t } = useTranslation();

  const programmingLanguages = [
    "HTML", "CSS", "JavaScript", "Node.js", "Python", "MongoDB", "TypeScript"
  ];

  return (
    <section id="about" className="py-20 bg-gray-100/50 dark:bg-gray-900/20 relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            className="w-full md:w-2/5 fade-in"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-0 border-2 border-primary rounded-lg transform translate-x-4 translate-y-4"></div>
              <img 
                src="https://nauval.mycdn.biz.id/download/1741597554570.jpeg" 
                alt="Aka Profile" 
                className="w-full h-auto max-w-md rounded-lg shadow-xl z-10 relative"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-3/5 fade-in"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              <span className="text-primary">{t('about.title')}</span>
            </h2>
            
            <div className="space-y-4 text-base md:text-lg">
              <p>{t('about.description')}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="flex items-start">
                  <i className="fas fa-user text-primary mt-1 w-5"></i>
                  <div className="ml-3">
                    <h3 className="font-medium">{t('about.name')}</h3>
                    <p>Aka</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt text-primary mt-1 w-5"></i>
                  <div className="ml-3">
                    <h3 className="font-medium">{t('about.location')}</h3>
                    <p>West Sumatra, Indonesia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-graduation-cap text-primary mt-1 w-5"></i>
                  <div className="ml-3">
                    <h3 className="font-medium">{t('about.status')}</h3>
                    <p>{t('about.student')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-code text-primary mt-1 w-5"></i>
                  <div className="ml-3">
                    <h3 className="font-medium">{t('about.role')}</h3>
                    <p>{t('about.developer')}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-display font-bold mb-4 text-primary">{t('about.skills')}</h3>
                <div className="flex flex-wrap gap-3">
                  {programmingLanguages.map((lang, index) => (
                    <motion.span 
                      key={lang}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-md border border-primary/20"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      {lang}
                    </motion.span>
                  ))}
                </div>
              </div>
              
              <motion.div 
                className="mt-8 italic border-l-4 border-primary pl-4 py-2 bg-primary/5"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p>{t('about.quote')}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
