import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would submit the form data to a backend service
    toast({
      title: "Message Sent",
      description: "Thank you for your message. I will get back to you soon!",
      variant: "default",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          className="text-center mb-12 fade-in"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            <span className="text-primary">{t('contact.title')}</span>
          </h2>
          <div className="flex items-center justify-center mt-4">
            <div className="h-0.5 w-6 bg-primary"></div>
            <p className="mx-3 text-base md:text-lg">{t('contact.subtitle')}</p>
            <div className="h-0.5 w-6 bg-primary"></div>
          </div>
        </motion.div>
        
        <motion.div 
          className="max-w-4xl mx-auto fade-in"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:p-8 bg-primary bg-opacity-10">
                <h3 className="text-xl font-display font-bold text-primary mb-4">{t('contact.getInTouch')}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white mr-3">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">{t('contact.location')}</h4>
                      <p>West Sumatra, Indonesia</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white mr-3">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">{t('contact.email')}</h4>
                      <p>aka@example.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white mr-3">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">{t('contact.phone')}</h4>
                      <p>+62 123 456 7890</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium mb-3">{t('contact.followMe')}</h4>
                  <div className="flex space-x-3">
                    <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 text-primary hover:bg-primary hover:text-white transition-colors duration-300">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 text-primary hover:bg-primary hover:text-white transition-colors duration-300">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 text-primary hover:bg-primary hover:text-white transition-colors duration-300">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 text-primary hover:bg-primary hover:text-white transition-colors duration-300">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-display font-bold text-primary mb-4">{t('contact.messageme')}</h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">{t('contact.form.name')}</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">{t('contact.form.email')}</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">{t('contact.form.subject')}</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">{t('contact.form.message')}</label>
                      <textarea 
                        id="message" 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4} 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                        required
                      ></textarea>
                    </div>
                    
                    <motion.button 
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/80 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{t('contact.form.send')}</span>
                      <i className="fas fa-paper-plane ml-2"></i>
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
