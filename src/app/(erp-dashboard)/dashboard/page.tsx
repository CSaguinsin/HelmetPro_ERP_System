"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../components/Sidebar";
import DeviceStateCard from "../../components/DeviceStateCard";
import OperatingStatusCard from "../../components/OperatingStatusCard";
import DeviceEndateCard from "../../components/DeviceEndateCard";
import RecentSalesCard from "../../components/RecentSalesCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bell, Settings, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { LoadingDots } from "../../components/loading-dots";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid"; // Import UUID Generator

export default function DashboardPage() {
  const userName = "John Doe"; // Replace with actual user data
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deviceUUID, setDeviceUUID] = useState("");
  const [userClientId, setUserClientId] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => subscription?.unsubscribe();
  }, [router]);

  // Fetch the logged-in user's user_client_id from Supabase
  useEffect(() => {
    const fetchUserClientId = async () => {
      const { data, error } = await supabase
        .from("user_clients")
        .select("user_client_id")
        .limit(1)
        .single();
      
      if (error) {
        console.error("Error fetching user_client_id:", error);
      } else {
        setUserClientId(data.user_client_id);
      }
    };

    fetchUserClientId();
  }, []);

  // Function to generate a new UUID
  const generateUUID = () => {
    const newUUID = uuidv4(); // Generate new UUID
    setDeviceUUID(newUUID);
    toast.success("UUID Generated!");
  };

  // Function to insert the generated UUID into device_list
  const saveDeviceUUID = async () => {
    if (!deviceUUID) {
      toast.error("Generate a UUID first!");
      return;
    }
    if (!userClientId) {
      toast.error("User Client ID not found!");
      return;
    }

    const { data, error } = await supabase.from("device_list").insert([
      {
        device_id: deviceUUID,
        user_client_id: userClientId,
        device_name: "Generated Device",
        device_status: "Enable",
        device_type: "Smart storage locker with screen",
        status: "Offline",
        protocol_type: "MQTT",
        maturity_time: new Date().toISOString(),
        department: "Logistics",
        customer_name: "Client A",
        device_reg_id: `DEV-${Math.floor(Math.random() * 10000)}`
      }
    ]);

    if (error) {
      console.error("Error inserting device:", error);
      toast.error("Error saving device!");
    } else {
      toast.success("Device saved successfully!");
      console.log("Inserted device:", data);
    }
  };

  // Function to copy the UUID to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(deviceUUID);
    toast.success("Copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingDots color="#3B82F6" size={8} speed={0.5} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Welcome back, {userName}
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <DeviceStateCard />
              <OperatingStatusCard />
              <DeviceEndateCard />
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,324</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Device UUID Generator Section */}
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Generate Device UUID</h3>
              <Button onClick={generateUUID} className="mr-4">Generate UUID</Button>
              <Button onClick={saveDeviceUUID} disabled={!deviceUUID} className="mr-4">Save Device</Button>
              <Button onClick={copyToClipboard} disabled={!deviceUUID} className="mr-4">Copy UUID</Button>

              {deviceUUID && (
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  Generated UUID: <span className="font-mono">{deviceUUID}</span>
                </p>
              )}
            </div>

            {/* Recent Sales */}
            <RecentSalesCard />
          </div>
        </main>
      </div>
    </div>
  );
}
