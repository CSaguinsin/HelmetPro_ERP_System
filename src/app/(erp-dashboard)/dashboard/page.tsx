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
          .select("device_id, device_name, device_status, protocol_type, customer_nan")
          .eq("user_client_id", userClientId);

        if (error) throw error;

        setDevices(data || []);
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
              {devices.length > 0 ? (
                <ul className="space-y-4">
                  {devices.map((device) => (
                    <li key={device.device_id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Device Name: {device.device_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Status: {device.device_status}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Protocol: {device.protocol_type}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Customer: {device.customer_nan}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No devices found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}