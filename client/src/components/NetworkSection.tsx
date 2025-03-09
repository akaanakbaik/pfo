import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { usePortfolio } from "@/context/PortfolioContext";

export default function NetworkSection() {
  const { friends } = usePortfolio();

  return (
    <section id="network" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="flex items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-poppins">
              My <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Network</span>
            </h2>
            <div className="h-0.5 bg-gray-200 dark:bg-gray-700 flex-grow ml-6"></div>
          </div>

          <div className="overflow-x-auto pb-4 mb-8 scrollbar-hide">
            <motion.div
              className="flex space-x-6 w-max"
              variants={staggerContainer}
            >
              {friends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  className="friend-card flex flex-col items-center w-48 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-2"
                  variants={fadeIn}
                  custom={index}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-center mb-1">{friend.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">{friend.title}</p>
                  <a
                    href={friend.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline"
                  >
                    Visit Website
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div className="text-center" variants={fadeIn}>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Connect with my network of talented professionals. We collaborate on projects and share knowledge to create amazing digital experiences.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 border border-primary text-primary hover:bg-primary/10 rounded-md font-medium transition-colors"
            >
              <span>Connect With Me</span>
              <i className="fas fa-user-plus ml-2"></i>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
