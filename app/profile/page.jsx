"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get user data directly from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login"); // Redirect if no user data
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-500">Name</p>
          <p className="font-medium">{user.name || "Not provided"}</p>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-gray-500">Role</p>
          <p className="font-medium capitalize">{user.role?.toLowerCase()}</p>
        </div>
      </div>

      <Button 
        onClick={handleLogout}
        className="w-full mt-8"
        variant="destructive"
      >
        <LogOut className="mr-2" /> Logout
      </Button>
    </div>
  );
}
