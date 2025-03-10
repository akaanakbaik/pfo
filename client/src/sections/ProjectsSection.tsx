import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Slider from '@/components/Slider';

const ProjectsSection = () => {
  const { t } = useTranslation();

  // Project data (sample projects)
  const projects = [
    {
      id: 1,
      title: "Personal Portfolio",
      description: "A responsive portfolio website built with modern web technologies.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      technologies: ["HTML", "CSS", "JavaScript"],
      liveUrl: "#",
      codeUrl: "#"
    },
    {
      id: 2,
      title: "Task Manager App",
      description: "A full-stack application for managing tasks and daily activities.",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "MongoDB"],
      liveUrl: "#",
      codeUrl: "#"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Real-time weather information app with location services.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      technologies: ["JavaScript", "API", "CSS"],
      liveUrl: "#",
      codeUrl: "#"
    }
  ];

  // Generate project slides
  const projectSlides = projects.map(project => (
    <div key={project.id} className="w-full px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-48 object-cover object-center" 
        />
        <div className="p-6">
          <h3 className="text-xl font-display font-bold text-primary">{project.title}</h3>
          <p className="mt-2 opacity-90">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map(tech => (
              <span key={tech} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{tech}</span>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <a href={project.liveUrl} className="text-primary hover:text-primary-dark flex items-center">
              <span>{t('projects.viewLive')}</span>
              <i className="fas fa-external-link-alt ml-1"></i>
            </a>
            <a href={project.codeUrl} className="text-primary hover:text-primary-dark flex items-center">
              <span>{t('projects.viewCode')}</span>
              <i className="fab fa-github ml-1"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          className="text-center mb-12 fade-in"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            <span className="text-primary">{t('projects.title')}</span>
          </h2>
          <div className="flex items-center justify-center mt-4">
            <div className="h-0.5 w-6 bg-primary"></div>
            <p className="mx-3 text-base md:text-lg">{t('projects.subtitle')}</p>
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
          <Slider slides={projectSlides} id="project-slider" />
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
