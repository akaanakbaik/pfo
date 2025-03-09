import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Footer() {
  const { profile } = usePortfolio();
  const currentYear = new Date().getFullYear();

  if (!profile) return null;

  return (
    <footer className="py-8 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <div className="mb-6 md:mb-0">
            <a href="#" className="text-2xl font-bold font-poppins">
              Portfolio
            </a>
            <p className="text-gray-400 mt-2">Crafting digital experiences with passion.</p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p className="text-gray-400 mb-2">© {currentYear} All rights reserved.</p>
            <a href="#" className="text-primary hover:text-primary/80">
              Privacy Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
