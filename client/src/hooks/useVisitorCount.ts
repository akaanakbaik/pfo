import { useState, useEffect } from 'react';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const useVisitorCount = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);

  // Fetch visitor count
  const { data: visitorData, isLoading } = useQuery({
    queryKey: ['/api/visitors'],
    // Using default fetcher from lib/queryClient.ts
  });

  // Mutation to increment visitor count
  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/visitors/increment', {});
      return res.json();
    },
    onSuccess: (data) => {
      setVisitorCount(data.count);
    },
  });

  // Update count when data is fetched
  useEffect(() => {
    if (visitorData && !isLoading) {
      setVisitorCount(visitorData.count);
    }
  }, [visitorData, isLoading]);

  const incrementVisitorCount = () => {
    mutate();
  };

  return { visitorCount, incrementVisitorCount, isLoading };
};

export default useVisitorCount;
