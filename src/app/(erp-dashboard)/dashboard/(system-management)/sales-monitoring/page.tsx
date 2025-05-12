"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/app/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Plus } from "lucide-react";

interface Device {
  device_id: string;
  device_name: string;
  device_reg_id: string;
  device_status: string;
  last_updated?: string;
}

export default function SalesMonitoringPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated, user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load devices
  useEffect(() => {
    async function loadDevices() {
      if (!isAuthenticated || !user?.user_client_id) return;
      
      try {
        // Fetch devices from Supabase for the current user only
        const { data: deviceData, error: deviceError } = await supabase
          .from("device_list")
          .select("device_id, device_name, device_reg_id, device_status, last_updated")
          .eq("user_client_id", user.user_client_id)
          .order("device_name");
        
        if (deviceError) {
          console.error("Error fetching devices:", deviceError);
          setError("Failed to fetch devices");
          setLoading(false);
          return;
        }
        
        if (deviceData) {
          setDevices(deviceData);
        }
      } catch (err) {
        setError("Failed to load devices");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadDevices();
    }
  }, [isAuthenticated, user]);

  // Navigate to device page
  const handleDeviceClick = (deviceId: string) => {
    router.push(`/dashboard/sales-monitoring/${deviceId}`);
  };

  // Format timestamp to readable date
  const formatDate = (timestamp?: string) => {
    if (!timestamp) return "Never";
    return new Date(timestamp).toLocaleString();
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Sales Monitoring</h1>
            <div className="flex items-center space-x-4">
              {/* Mobile Sidebar Toggle */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              
              {/* Add Device Button */}
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push('/dashboard/device-lists')}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Device
              </Button>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Select a device to view and send transaction data.
          </p>

          {/* Devices List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.length > 0 ? (
              devices.map((device) => (
                <Card 
                  key={device.device_id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleDeviceClick(device.device_id)}
                >
                  <CardHeader className="bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{device.device_name}</CardTitle>
                      <Badge 
                        className={
                          device.device_status === 'active' 
                            ? 'bg-green-500' 
                            : device.device_status === 'error' 
                              ? 'bg-red-500' 
                              : 'bg-gray-500'
                        }
                      >
                        {device.device_status}
                      </Badge>
                    </div>
                    <CardDescription>ID: {device.device_reg_id || 'N/A'}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-sm text-gray-500">
                      <p>Last Activity: {formatDate(device.last_updated)}</p>
                    </div>
                    <Button 
                      variant="outline"
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeviceClick(device.device_id);
                      }}
                    >
                      View Transactions
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                <p className="mb-4">No devices found</p>
                <Button
                  onClick={() => router.push('/dashboard/device-lists')}
                >
                  Add a Device
                </Button>
              </div>
            )}
          </div>

          {/* API Documentation */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">API Endpoints Documentation</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Send Transaction</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><span className="font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">POST /api/hardware/transaction</span></li>
                  <li>Authentication: <span className="font-mono">access_token</span> header required</li>
                  <li>Request body: <span className="font-mono">{"{ machineId: string, amount: number }"}</span></li>
                  <li>Response: <span className="font-mono">{"{ success: boolean, message: string, transaction_id: string }"}</span></li>
                  <li>Status code: 201 on success</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Get Transactions</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><span className="font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">GET /api/hardware/transaction</span></li>
                  <li>Authentication: <span className="font-mono">access_token</span> header required</li>
                  <li>Response: List of transactions for the authenticated device</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 