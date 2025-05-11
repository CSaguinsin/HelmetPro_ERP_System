"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import { useAuth } from "@/lib/auth-context";

type Device = {
  device_id: string;
  device_name: string;
  device_status: string;
  protocol_type: string;
};

export default function DeviceSettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
      return;
    }

    const fetchDevices = async () => {
      if (!user?.user_client_id) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("device_list")
          .select(`
            device_id, 
            device_name, 
            device_status, 
            protocol_type
          `)
          .eq("user_client_id", user.user_client_id);

        if (error) {
          console.error("Error fetching devices:", error);
          setError("Failed to load devices. Please try again later.");
          setLoading(false);
          return;
        }

        // Handle potential null data
        if (!data) {
          setDevices([]);
          setLoading(false);
          return;
        }

        setDevices(data || []);
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError("Failed to load devices. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [user, authLoading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6 lg:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Vendo Settings
              </h2>
            </div>

            {/* Devices Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Your Devices</CardTitle>
              </CardHeader>
              <CardContent>
                {devices.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No devices found. Please add devices to configure their settings.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {devices.map((device) => (
                      <Card 
                        key={device.device_id}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => router.push(`/dashboard/device-settings/${device.device_id}`)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{device.device_name}</h3>
                          <Settings className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          <p>ID: {device.device_id}</p>
                          <p>Status: {device.device_status}</p>
                          <p>Protocol: {device.protocol_type}</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full"
                        >
                          Configure Settings
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 