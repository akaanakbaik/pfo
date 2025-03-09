import { useDeviceInfo } from "@/hooks/useDeviceInfo";
import { useStats } from "@/hooks/useStats";
import { motion } from "framer-motion";

export default function StatsBar() {
  const { currentTime, batteryInfo, ipAddress } = useDeviceInfo();
  const { visitorCount } = useStats();

  return (
    <motion.div
      className="stats-bar py-4 px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="stat-item flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <i className="fas fa-clock"></i>
          </div>
          <div>
            <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">Current Time</h4>
            <p id="current-time" className="font-mono text-sm">{currentTime}</p>
          </div>
        </div>

        <div className="stat-item flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <i className="fas fa-network-wired"></i>
          </div>
          <div>
            <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">Your IP</h4>
            <p id="visitor-ip" className="font-mono text-sm">{ipAddress}</p>
          </div>
        </div>

        <div className="stat-item flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">Visitors</h4>
            <p id="visitor-count" className="font-mono text-sm">{visitorCount}</p>
          </div>
        </div>

        <div className="stat-item flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <i className={`fas fa-battery-${batteryInfo.icon}`}></i>
          </div>
          <div>
            <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">Battery</h4>
            <p id="battery-level" className="font-mono text-sm">{batteryInfo.level}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
