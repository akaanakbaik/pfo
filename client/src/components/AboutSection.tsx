import { motion } from "framer-motion";
import { fadeIn, staggerContainer, slideInLeft } from "@/lib/animations";
import { usePortfolio } from "@/context/PortfolioContext";

export default function AboutSection() {
  const { profile } = usePortfolio();

  if (!profile) return null;

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="flex items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-poppins">
              About <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Me</span>
            </h2>
            <div className="h-0.5 bg-gray-200 dark:bg-gray-700 flex-grow ml-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn}>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {profile.aboutText}
              </p>

              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {profile.approachText}
              </p>

              <h3 className="text-xl font-bold mb-4 font-inter">My Skills</h3>
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
                variants={staggerContainer}
              >
                {profile.skills.map((skill, index) => (
                  <motion.div 
                    key={index}
                    className="skill-item flex items-center space-x-2"
                    variants={fadeIn}
                    custom={index}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>{skill}</span>
                  </motion.div>
                ))}
              </motion.div>

              <a
                href="#contact"
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
              >
                <span>Let's work together</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </motion.div>

            <motion.div className="relative" variants={slideInLeft}>
              <div className="about-image-container relative z-10">
                <img
                  src={profile.workspaceImage}
                  alt="Developer workspace"
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0"></div>
              <div className="absolute -top-4 -left-4 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl z-0"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
