import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ContentEditor from "@/components/admin/ContentEditor";
import { usePortfolio } from "@/context/PortfolioContext";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { profile, projects, friends, refreshData } = usePortfolio();
  const [selectedTab, setSelectedTab] = useState("profile");

  // Query to get visitor stats
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  // Mutation for clearing visitor count
  const resetVisitorsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/reset-visitors", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "Visitor count has been reset to zero.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reset visitor count.",
        variant: "destructive",
      });
    },
  });

  const handleResetVisitors = () => {
    resetVisitorsMutation.mutate();
  };

  return (
    <div className="p-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>
            Manage your portfolio content and view website statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Visitors</h3>
              <p className="text-3xl font-bold">{stats?.visitorCount || 0}</p>
              <Button 
                onClick={handleResetVisitors} 
                variant="outline" 
                size="sm" 
                className="mt-2"
                disabled={resetVisitorsMutation.isPending}
              >
                {resetVisitorsMutation.isPending ? "Resetting..." : "Reset Count"}
              </Button>
            </div>
            <div className="bg-primary/10 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Projects</h3>
              <p className="text-3xl font-bold">{projects.length}</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Network</h3>
              <p className="text-3xl font-bold">{friends.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="friends">Network</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ContentEditor 
            contentType="profile" 
            initialData={profile}
            onSaveSuccess={() => {
              refreshData();
              toast({
                title: "Success",
                description: "Profile data saved successfully",
              });
            }}
          />
        </TabsContent>
        
        <TabsContent value="projects">
          <ContentEditor 
            contentType="projects" 
            initialData={projects}
            onSaveSuccess={() => {
              refreshData();
              toast({
                title: "Success",
                description: "Projects saved successfully",
              });
            }}
          />
        </TabsContent>
        
        <TabsContent value="friends">
          <ContentEditor 
            contentType="friends" 
            initialData={friends}
            onSaveSuccess={() => {
              refreshData();
              toast({
                title: "Success",
                description: "Network data saved successfully",
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
