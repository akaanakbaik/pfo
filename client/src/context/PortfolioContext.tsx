import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProfileType, ProjectType, FriendType } from "@shared/schema";

interface PortfolioContextType {
  profile: ProfileType | null;
  projects: ProjectType[];
  friends: FriendType[];
  isLoading: boolean;
  refreshData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // Fetch profile data
  const profileQuery = useQuery({
    queryKey: ["/api/profile"],
  });

  // Fetch projects data
  const projectsQuery = useQuery({
    queryKey: ["/api/projects"],
  });

  // Fetch friends data
  const friendsQuery = useQuery({
    queryKey: ["/api/friends"],
  });

  const isLoading = profileQuery.isLoading || projectsQuery.isLoading || friendsQuery.isLoading;

  const refreshData = () => {
    profileQuery.refetch();
    projectsQuery.refetch();
    friendsQuery.refetch();
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile: profileQuery.data || null,
        projects: projectsQuery.data || [],
        friends: friendsQuery.data || [],
        isLoading,
        refreshData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio(): PortfolioContextType {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
