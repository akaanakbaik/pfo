import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Slider from '@/components/Slider';

const FriendsSection = () => {
  const { t } = useTranslation();

  // Friends data
  const friends = [
    {
      id: 1,
      name: "Youso",
      role: "sesepuh",
      description: "my good friend, who taught me a lot and is a senior programmer ",
      image: "https://nauval.mycdn.biz.id/download/1741883430170.jpeg",
      social: {
        tiktok: "https://www.tiktok.com/@youu_soo?_t=ZS-8ugHFmyX78H&_r=1",
      }
    },
    {
      id: 2,
      name: "Hydra",
      role: "developer bot WhatsApp",
      description: "a WhatsApp bot expert and very kind, friendly d",
      image: "https://nauval.mycdn.biz.id/download/1741970090491.jpeg",
      social: {
        tiktok: "https://www.tiktok.com/@genzo_am?_t=ZS-8ugI0eDEwia&_r=1",
      }
    },
    {
      id: 3,
      name: "Raol",
      role: "full stack enginer",
      description: "a peer of mine who has extraordinary skills in programming",
      image: "https://nauval.mycdn.biz.id/download/1741970484973.jpeg",
      social: {
        github: "https://github.com/latesturl",
      }
    }
  ];

  // Generate friend slides
  const friendSlides = friends.map(friend => (
    <div key={friend.id} className="w-full px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6 text-center">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-2 border-primary">
          <img 
            src={friend.image} 
            alt={friend.name} 
            className="w-full h-full object-cover object-center" 
          />
        </div>
        <h3 className="text-xl font-display font-bold text-primary">{friend.name}</h3>
        <p className="text-sm mt-1 opacity-75">{friend.role}</p>
        <p className="mt-4">{friend.description}</p>
        <div className="mt-6 flex justify-center space-x-3">
          {friend.social.github && (
            <a href={friend.social.github} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary/20 transition-colors duration-300">
              <i className="fab fa-github text-primary"></i>
            </a>
          )}
          {friend.social.tiktok && (
            <a href={friend.social.tiktok} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary/20 transition-colors duration-300">
              <i className="fab fa-tiktok text-primary"></i>
            </a>
          )}
          {friend.social.linkedin && (
            <a href={friend.social.linkedin} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary/20 transition-colors duration-300">
              <i className="fab fa-linkedin-in text-primary"></i>
            </a>
          )}
          {friend.social.twitter && (
            <a href={friend.social.twitter} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary/20 transition-colors duration-300">
              <i className="fab fa-twitter text-primary"></i>
            </a>
          )}
          {friend.social.behance && (
            <a href={friend.social.behance} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary/20 transition-colors duration-300">
              <i className="fab fa-behance text-primary"></i>
            </a>
          )}
          {friend.social.stackoverflow && (
            <a href={friend.social.stackoverflow} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary/20 transition-colors duration-300">
              <i className="fab fa-stack-overflow text-primary"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  ));

  return (
    <section id="friends" className="py-20 bg-gray-100/50 dark:bg-gray-900/20 relative">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          className="text-center mb-12 fade-in"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            <span className="text-primary">{t('friends.title')}</span>
          </h2>
          <div className="flex items-center justify-center mt-4">
            <div className="h-0.5 w-6 bg-primary"></div>
            <p className="mx-3 text-base md:text-lg">{t('friends.subtitle')}</p>
            <div className="h-0.5 w-6 bg-primary"></div>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-12 fade-in"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7 }}
        >
          <Slider slides={friendSlides} id="friend-slider" />
        </motion.div>
      </div>
    </section>
  );
};

export default FriendsSection;
        
