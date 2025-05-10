"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "../../components/Sidebar";
import DeviceStateCard from "../../components/DeviceStateCard";
import OperatingStatusCard from "../../components/OperatingStatusCard";
import DeviceEndateCard from "../../components/DeviceEndateCard";
import { Skeleton } from "@/components/ui/skeleton";

// ✅ Type Definitions
type Device = {
  device_id: string;
  device_name: string;
  device_status: string;
  protocol_type: string;
  customer_nan: string;
  is_mobile_logged_in?: boolean;
};

// Skeleton loader component for cards
const CardSkeleton = () => (
  <Card className="bg-white dark:bg-gray-800 shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-[120px]" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-[60px] mb-2" />
      <Skeleton className="h-4 w-[100px]" />
    </CardContent>
  </Card>
);

// Skeleton loader for device cards
const DeviceCardSkeleton = () => (
  <div className="p-4 rounded-lg shadow-md border border-gray-200">
    <Skeleton className="h-6 w-[150px] mb-2" />
    <Skeleton className="h-4 w-[100px] mb-2" />
    <Skeleton className="h-4 w-[120px] mb-2" />
    <Skeleton className="h-4 w-[140px]" />
  </div>
);

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
              {loading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Device List */}
            <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Vending Machines</h3>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DeviceCardSkeleton />
                  <DeviceCardSkeleton />
                  <DeviceCardSkeleton />
                </div>
              ) : devices.length > 0 ? (
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