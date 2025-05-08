"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "../../../../components/Sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

// Define device type
type Device = {
  device_id: string;
  device_name: string;
  device_model: string;
  last_connection?: string;
  status: string;
};

export default function MachineImagesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, loading: authLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    // Check if user is authenticated first
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchDevices = async () => {
      try {
        setLoading(true);
        
        // Use authenticated user from our custom auth context
        if (!user || !user.user_client_id) {
          throw new Error("User not authenticated");
        }

        // Get all devices for the user
        const { data: deviceData, error: deviceError } = await supabase
          .from("device_list")
          .select("*")
          .eq("user_client_id", user.user_client_id);

        if (deviceError) {
          throw new Error("Failed to fetch devices");
        }

        if (!deviceData || deviceData.length === 0) {
          setDevices([]);
        } else {
          setDevices(deviceData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [user, isAuthenticated, authLoading, router]);

  const handleDeviceSelect = (deviceId: string) => {
    router.push(`/dashboard/machine-images/${deviceId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">{error}</p>
          <Button 
            onClick={() => router.push("/dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Device Media Management</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Select a device to manage its media files
              </p>
            </div>

            {/* Mobile Sidebar Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>

          {/* Device List */}
          {devices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 className="text-xl font-semibold mb-4">No Devices Found</h2>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  You dont have any devices registered. Please add a device first.
                </p>
                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Go back to Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <Card 
                  key={device.device_id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleDeviceSelect(device.device_id)}
                >
                  <CardHeader>
                    <CardTitle>{device.device_name || `Device ${device.device_id}`}</CardTitle>
                    <CardDescription>Model: {device.device_model || "Unknown"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        device.status === 'active' ? 'bg-green-100 text-green-800' : 
                        device.status === 'offline' ? 'bg-gray-100 text-gray-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {device.status || "Unknown"}
                      </span>
                      <Button size="sm">Manage Media</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}