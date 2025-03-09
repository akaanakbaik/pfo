import { useState, useEffect } from "react";

interface BatteryInfo {
  level: string;
  charging: boolean;
  icon: string;
}

export function useDeviceInfo() {
  const [currentTime, setCurrentTime] = useState<string>("Loading...");
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo>({
    level: "Checking...",
    charging: false,
    icon: "three-quarters",
  });
  const [ipAddress, setIpAddress] = useState<string>("Loading...");

  // Get and format the current date and time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setCurrentTime(now.toLocaleDateString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get battery information
  useEffect(() => {
    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        const updateBatteryInfo = () => {
          const level = Math.floor(battery.level * 100);
          let icon = "three-quarters";

          if (level <= 10) icon = "empty";
          else if (level <= 40) icon = "quarter";
          else if (level <= 70) icon = "half";

          setBatteryInfo({
            level: `${level}%${battery.charging ? " (Charging)" : ""}`,
            charging: battery.charging,
            icon: battery.charging ? "charging" : icon,
          });
        };

        updateBatteryInfo();

        battery.addEventListener("levelchange", updateBatteryInfo);
        battery.addEventListener("chargingchange", updateBatteryInfo);

        return () => {
          battery.removeEventListener("levelchange", updateBatteryInfo);
          battery.removeEventListener("chargingchange", updateBatteryInfo);
        };
      });
    } else {
      setBatteryInfo({
        level: "Not supported",
        charging: false,
        icon: "three-quarters",
      });
    }
  }, []);

  // Get IP address
  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        setIpAddress("Not available");
      }
    };

    getIpAddress();
  }, []);

  return {
    currentTime,
    batteryInfo,
    ipAddress,
  };
}
