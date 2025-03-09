import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useStats() {
  const [visitorCount, setVisitorCount] = useState<number>(0);

  // Fetch visitor count from API
  const { data: statsData } = useQuery({
    queryKey: ["/api/stats"],
  });

  useEffect(() => {
    if (statsData?.visitorCount) {
      setVisitorCount(statsData.visitorCount);
    }
  }, [statsData]);

  // Register a visit when the component mounts
  useEffect(() => {
    const registerVisit = async () => {
      try {
        await apiRequest("POST", "/api/stats/visit", {});
      } catch (error) {
        console.error("Failed to register visit:", error);
      }
    };

    registerVisit();
  }, []);

  return {
    visitorCount,
  };
}
