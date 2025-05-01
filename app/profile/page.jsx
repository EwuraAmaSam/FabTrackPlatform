"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, X } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = () => {
      try {
        // Get the user data directly from localStorage
        const storedUser = localStorage.getItem("userData");
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          throw new Error("No authentication token found");
        }

        if (!storedUser) {
          throw new Error("No user data found");
        }

        // Set the user state with the stored data
        setUser(JSON.parse(storedUser));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load user data",
        });
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [router, toast]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  const handleClose = () => {
    router.back(); // Go back to previous page
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No user data available</p>
      </div>
    );
  }

  // Handle different property casing
  const userData = {
    name: user.Name || user.name,
    email: user.Email || user.email,
    role: user.Role || user.role,
    major: user.major,
    yearGroup: user.yearGroup
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto shadow-lg border-0">
        <CardHeader className="bg-gray-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Profile
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClose}
                className="ml-2 text-gray-500 hover:text-gray-700 p-1 h-8 w-8 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 pb-4">
          <div className="space-y-4">
            {userData.name && (
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium mt-1">{userData.name}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-500 font-semibold">Email</p>
              <p className="font-medium mt-1 text-gray-800">{userData.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 font-semibold">Role</p>
              <p className="font-medium mt-1 capitalize text-gray-800">{userData.role?.toLowerCase() || 'user'}</p>
            </div>


            
            {userData.major && (
              <div>
                <p className="text-sm text-gray-500">Major</p>
                <p className="font-medium mt-1">{userData.major}</p>
              </div>
            )}
            
            {userData.yearGroup && (
              <div>
                <p className="text-sm text-gray-500">Year Group</p>
                <p className="font-medium mt-1">{userData.yearGroup}</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-100">
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="w-full shadow-sm hover:shadow-md transition-all"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
