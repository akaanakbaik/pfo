import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { useQuery } from "@tanstack/react-query";
import AdminDashboard from "@/components/AdminDashboard";
import Login from "@/components/admin/Login";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check if user is already authenticated
  const { data: authStatus, isLoading } = useQuery({
    queryKey: ["/api/admin/check-auth"],
    onError: () => {
      setIsAuthenticated(false);
    },
    onSuccess: (data) => {
      setIsAuthenticated(data?.authenticated || false);
    },
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout", {});
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen"
    >
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : isAuthenticated ? (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <div className="flex space-x-4">
                <Link href="/">
                  <Button variant="outline">Back to Site</Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
              </div>
            </div>
          </header>
          <main className="container mx-auto py-8">
            <AdminDashboard />
          </main>
        </div>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </motion.div>
  );
}
