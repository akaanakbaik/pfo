import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Slider from '@/components/Slider';

const FriendsSection = () => {
  const { t } = useTranslation();

  // Friends data
  const friends = [
    {
      id: 1,
      name: "Ahmad",
      role: "Full Stack Developer",
      description: "A talented developer who taught me a lot about React and modern web development.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 2,
      name: "Sarah",
      role: "UI/UX Designer",
      description: "An amazing designer who helps me understand the importance of user-centered design.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
      social: {
        github: "#",
        linkedin: "#",
        behance: "#"
      }
    },
    {
      id: 3,
      name: "Michael",
      role: "Backend Developer",
      description: "A brilliant programmer who introduced me to Python and database management.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
      social: {
        github: "#",
        stackoverflow: "#",
        twitter: "#"
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
