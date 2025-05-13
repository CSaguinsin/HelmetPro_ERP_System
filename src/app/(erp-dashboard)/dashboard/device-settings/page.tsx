"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Search, 
  Sliders, 
  AlertCircle, 
  Check, 
  Wifi, 
  WifiOff 
} from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter devices based on search query
  const filteredDevices = devices.filter(device => 
    device.device_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.device_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
      case 'online':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200">
            <Check className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
      case 'inactive':
      case 'offline':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Function to render protocol badge
  const renderProtocolBadge = (protocol: string) => {
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200">
        {protocol === 'wifi' ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
        {protocol}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-6 lg:p-8">
            <div className="space-y-6">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-64" />
              </div>
              
              {/* Search Skeleton */}
              <Skeleton className="h-10 w-full max-w-md" />
              
              {/* Devices Card Skeleton */}
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-1" />
                        <Skeleton className="h-4 w-1/3 mb-1" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <Skeleton className="h-9 w-full" />
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6 lg:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
                <Sliders className="h-7 w-7 mr-2 text-primary" />
                Device Settings
              </h2>
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search devices..."
                  className="pl-10 bg-white dark:bg-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Devices Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Your Devices
                  <Badge className="ml-3 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                    {filteredDevices.length} {filteredDevices.length === 1 ? 'Device' : 'Devices'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {filteredDevices.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                      <Settings className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      {searchQuery ? "No matching devices found" : "No devices found"}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {searchQuery 
                        ? "Try adjusting your search query or clear the search to see all devices."
                        : "Please add devices to your account to configure their settings."}
                    </p>
                    {searchQuery && (
                      <Button 
                        variant="outline"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDevices.map((device) => (
                      <Card 
                        key={device.device_id}
                        className="group overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-md"
                      >
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-lg group-hover:text-primary transition-colors">{device.device_name}</h3>
                            <Settings className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                          
                          <div className="space-y-2 mb-5">
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="font-medium text-gray-700 dark:text-gray-300 w-20">ID:</span>
                              <span className="font-mono">{device.device_id}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="font-medium text-gray-700 dark:text-gray-300 w-20">Status:</span>
                              {renderStatusBadge(device.device_status)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="font-medium text-gray-700 dark:text-gray-300 w-20">Protocol:</span>
                              {renderProtocolBadge(device.protocol_type)}
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                            variant="outline"
                            onClick={() => router.push(`/dashboard/device-settings/${device.device_id}`)}
                          >
                            Configure Settings
                          </Button>
                        </div>
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