"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

// Try to import components, but provide fallbacks if they don't exist
let Sidebar: React.FC = () => <div className="w-64 bg-gray-100 h-screen">Sidebar</div>;
let DeviceStateCard: React.FC = () => <Card><CardHeader><CardTitle>Device State</CardTitle></CardHeader><CardContent>Loading...</CardContent></Card>;
let OperatingStatusCard: React.FC = () => <Card><CardHeader><CardTitle>Operating Status</CardTitle></CardHeader><CardContent>Loading...</CardContent></Card>;
let DeviceEndateCard: React.FC = () => <Card><CardHeader><CardTitle>Device Endate</CardTitle></CardHeader><CardContent>Loading...</CardContent></Card>;
let LoadingDots: React.FC<{color?: string, size?: number, speed?: number}> = () => <div className="flex space-x-2"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div></div>;

try {
  // Try to import components dynamically
  import("../../components/Sidebar").then(module => {
    Sidebar = module.default;
  });
  import("../../components/DeviceStateCard").then(module => {
    DeviceStateCard = module.default;
  });
  import("../../components/OperatingStatusCard").then(module => {
    OperatingStatusCard = module.default;
  });
  import("../../components/DeviceEndateCard").then(module => {
    DeviceEndateCard = module.default;
  });
  import("../../components/loading-dots").then(module => {
    LoadingDots = module.LoadingDots;
  });
} catch (error) {
  console.error("Error importing components:", error);
}

// ✅ Type Definitions
type Device = {
  device_id: string;
  device_name: string;
  device_status: string;
  protocol_type: string;
  customer_nan: string;
  is_mobile_logged_in?: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch user devices
  useEffect(() => {
    const fetchUserDevices = async () => {
      if (!user?.user_client_id) return;

      try {
        const { data, error } = await supabase
          .from("device_list")
          .select(`
            device_id, 
            device_name, 
            device_status, 
            protocol_type, 
            customer_nan,
            mobile_sessions:mobile_sessions!inner(is_active)
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

        try {
          const devicesWithStatus = data.map(device => ({
            ...device,
            is_mobile_logged_in: device.mobile_sessions && 
              Array.isArray(device.mobile_sessions) && 
              device.mobile_sessions.some(session => session && session.is_active)
          }));

          setDevices(devicesWithStatus || []);
        } catch (err) {
          console.error("Error processing device data:", err);
          setDevices([]);
        } finally {
          setLoading(false);
        }
      } catch (err) {
        console.error("Unexpected error fetching devices:", err);
        setError("An unexpected error occurred. Please try again later.");
        setLoading(false);
      }
    };

    if (user?.user_client_id) {
      fetchUserDevices();
    } else {
      setLoading(false);
    }
  }, [user]);

  // ✅ Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <LoadingDots color="#3B82F6" size={8} speed={0.5} />
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
        <main className="p-4 md:p-6 lg:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome, {user?.email || 'User'}!
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <DeviceStateCard />
              <OperatingStatusCard />
              <DeviceEndateCard />
              <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{devices.length}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">+20.1% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Device List */}
            <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Vending Machines</h3>
              {devices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {devices.map((device) => (
                    <div 
                      key={device.device_id} 
                      className={`card relative p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                        device.is_mobile_logged_in ? 'border-2 border-green-500' : 'border border-gray-200'
                      }`}
                      onClick={() => router.push(`/dashboard/machine-images/${device.device_id}`)}
                    >
                      {device.is_mobile_logged_in && (
                        <div className="absolute top-2 right-2 flex items-center space-x-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="text-xs text-green-600">Mobile Active</span>
                        </div>
                      )}
                      <h3 className="text-lg font-semibold">{device.device_name}</h3>
                      <p className="text-sm text-gray-600">Status: {device.device_status}</p>
                      <p className="text-sm text-gray-600">Protocol: {device.protocol_type}</p>
                      <p className="text-sm text-gray-600">Customer: {device.customer_nan}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">
                  No devices found. {error ? 'Please try again later.' : ''}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}