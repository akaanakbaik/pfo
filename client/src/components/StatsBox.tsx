import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import useVisitorCount from '@/hooks/useVisitorCount';

const StatsBox = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ipAddress, setIpAddress] = useState('Loading...');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const { i18n } = useTranslation();
  const { visitorCount } = useVisitorCount();

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get IP address
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        setIpAddress('Unavailable');
      }
    };
    fetchIP();

    // Get battery status
    if ('getBattery' in navigator) {
      // @ts-ignore - getBattery is not in the TypeScript definitions
      navigator.getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          const level = Math.floor(battery.level * 100);
          setBatteryLevel(level);
          setBatteryCharging(battery.charging);
        };
        
        updateBatteryStatus();
        
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
        
        return () => {
          battery.removeEventListener('levelchange', updateBatteryStatus);
          battery.removeEventListener('chargingchange', updateBatteryStatus);
        };
      });
    }

    return () => clearInterval(timeInterval);
  }, []);

  // Format date according to current language
  const formatDate = () => {
    return currentTime.toLocaleDateString(
      i18n.language === 'id' ? 'id-ID' : 'en-US', 
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  // Format time
  const formatTime = () => {
    return currentTime.toLocaleTimeString(
      i18n.language === 'id' ? 'id-ID' : 'en-US',
      { hour: '2-digit', minute: '2-digit', second: '2-digit' }
    );
  };

  const toggleStats = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle dragging
  const onDragStart = () => {
    setIsDragging(true);
  };
  
  const onDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    setPosition({
      x: position.x + info.offset.x,
      y: position.y + info.offset.y
    });
  };
  
  const mainVariants = {
    open: { 
      height: 'auto', 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    closed: { 
      height: '40px', 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    open: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.2 }
    },
    closed: { 
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="fixed right-4 md:right-8 bottom-4 md:bottom-8 z-40 bg-background/60 dark:bg-gray-900/60 backdrop-blur-md p-2 rounded-lg border border-primary/10 shadow-md text-xs md:text-sm cursor-move"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        x: position.x,
        y: position.y,
        boxShadow: isHovered ? "0 0 10px rgba(184, 134, 11, 0.2)" : "0 2px 8px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ 
        duration: 0.3,
        x: { type: "spring", stiffness: 300, damping: 25 },
        y: { type: "spring", stiffness: 300, damping: 25 }
      }}
      drag
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ cursor: "grabbing" }}
    >
      <motion.div
        className="flex flex-col space-y-0.5 w-64"
        variants={mainVariants}
        initial="open"
        animate={isOpen ? "open" : "closed"}
      >
        {/* Header row */}
        <div 
          className="flex justify-between items-center cursor-pointer rounded p-1.5"
          onClick={toggleStats}
        >
          <div className="flex items-center gap-2">
            <i className="fas fa-chart-line text-primary text-xs"></i>
            <span className="font-medium text-xs">Statistics</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-primary"
          >
            <i className="fas fa-chevron-up"></i>
          </motion.div>
        </div>
        
        {/* Time & Date */}
        <motion.div variants={itemVariants} className="flex items-center px-2 py-1.5">
          <div className="flex items-center">
            <i className="fas fa-clock text-primary w-5 text-xs"></i>
            <span className="ml-2 font-mono">{formatTime()}</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex items-center px-2 py-1.5">
          <div className="flex items-center">
            <i className="fas fa-calendar-alt text-primary w-5 text-xs"></i>
            <span className="ml-2">{formatDate()}</span>
          </div>
        </motion.div>
        
        {/* IP & Visitors */}
        <motion.div variants={itemVariants} className="flex items-center px-2 py-1.5">
          <div className="flex items-center">
            <i className="fas fa-network-wired text-primary w-5 text-xs"></i>
            <span className="ml-2">{ipAddress}</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex items-center px-2 py-1.5">
          <div className="flex items-center w-full">
            <i className="fas fa-eye text-primary w-5 text-xs"></i>
            <div className="flex justify-between items-center ml-2 w-full">
              <span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`visitor-${visitorCount}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {visitorCount}
                  </motion.span>
                </AnimatePresence>
                <span className="text-xs opacity-70 ml-1">visitors</span>
              </span>
              <motion.div 
                className="h-1 bg-primary/20 rounded-full w-1/3"
                whileHover={{ width: "40%" }}
              >
                <motion.div 
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1 }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Battery */}
        {batteryLevel !== null && (
          <motion.div variants={itemVariants} className="flex items-center px-2 py-1.5">
            <div className="flex items-center w-full">
              <i className={`fas fa-${batteryCharging ? 'plug' : 'battery-half'} text-primary w-5 text-xs`}></i>
              <div className="flex justify-between items-center ml-2 w-full">
                <span>{batteryLevel}%</span>
                <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3 overflow-hidden">
                  <motion.div 
                    className={`h-full ${batteryCharging ? 'bg-green-500' : 'bg-primary'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${batteryLevel}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Admin link */}
        <motion.div variants={itemVariants} className="flex items-center justify-between px-2 py-1.5">
          <Link href="/admin" className="flex items-center w-full group">
            <i className="fas fa-lock text-primary w-5 text-xs"></i>
            <div className="ml-2 flex justify-between w-full">
              <span className="group-hover:text-primary transition-colors">Admin Panel</span>
              <i className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StatsBox;
