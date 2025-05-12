"use client";

import { useState, useEffect } from "react";
import SendTransaction from "@/app/components/SendTransaction";
import { getDeviceDetails } from "@/lib/hardwareApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "../../../../components/Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function SalesMonitoringPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<Array<{ id: number; machine_id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    async function loadDevices() {
      try {
        const response = await getDeviceDetails();
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          // For demonstration purposes, creating an array with the device
          // In a real application, you might fetch multiple devices
          setDevices([
            {
              id: response.data.device_id,
              machine_id: response.data.device_reg_id,
              name: response.data.device_name
            }
          ]);
        }
      } catch (err) {
        setError("Failed to load devices");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDevices();
  }, []);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
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
                Sales Monitoring
              </h2>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300">
              Monitor and send transactions to your devices
            </p>

            {/* Content */}
            {loading ? (
              <div className="text-center py-8">Loading devices...</div>
            ) : error ? (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg">{error}</div>
            ) : devices.length === 0 ? (
              <div className="text-center py-8">No devices found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) => (
                  <Card key={device.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <CardTitle>{device.name}</CardTitle>
                      <CardDescription>Machine ID: {device.machine_id}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <SendTransaction machineId={device.machine_id} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">API Endpoints Documentation</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Send Transaction</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><span className="font-mono bg-gray-100 p-1 rounded">POST /api/hardware/transaction</span></li>
                    <li>Authentication: <span className="font-mono">access_token</span> header required</li>
                    <li>Request body: <span className="font-mono">{"{ machineId: string, amount: number }"}</span></li>
                    <li>Response: <span className="font-mono">{"{ success: boolean, message: string, transaction_id: string }"}</span></li>
                    <li>Status code: 201 on success</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium">Get Transactions</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><span className="font-mono bg-gray-100 p-1 rounded">GET /api/hardware/transaction</span></li>
                    <li>Authentication: <span className="font-mono">access_token</span> header required</li>
                    <li>Response: List of transactions for the authenticated device</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 