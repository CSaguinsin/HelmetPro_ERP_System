"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../components/Sidebar";
import DeviceStateCard from "../../components/DeviceStateCard";
import OperatingStatusCard from "../../components/OperatingStatusCard";
import DeviceEndateCard from "../../components/DeviceEndateCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingDots } from "../../components/loading-dots";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [userClientId, setUserClientId] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  // ✅ Fetch user devices
  useEffect(() => {
    const fetchUserDevices = async () => {
      if (!userClientId) return;

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
          .eq("user_client_id", userClientId);

        if (error) throw error;

        const devicesWithStatus = data.map(device => ({
          ...device,
          is_mobile_logged_in: device.mobile_sessions.some(session => session.is_active)
        }));

        setDevices(devicesWithStatus || []);
      } catch (err) {
        console.error("Error fetching devices:", err);
      }
    };

    fetchUserDevices();
  }, [userClientId]);

  // ✅ Check user authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
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

  // ✅ Fetch User Client ID
  useEffect(() => {
    const fetchUserClientId = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
          console.error("Error fetching authenticated user:", authError?.message);
          return;
        }

        const { data, error: userError } = await supabase
          .from("user_clients")
          .select("user_client_id")
          .eq("erp_user_id", authData.user.id)
          .maybeSingle();

        if (userError) throw userError;

        setUserClientId(data?.user_client_id || null);
      } catch (err) {
        console.error("Unexpected error in fetchUserClientId:", err);
      }
    };

    fetchUserClientId();
  }, []);

  if (loading) {
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
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome!
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}