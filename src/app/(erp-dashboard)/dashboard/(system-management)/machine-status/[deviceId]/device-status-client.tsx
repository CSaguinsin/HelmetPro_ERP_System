"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SendStatus from "@/app/components/SendStatus";
import { supabase } from "@/lib/supabase";

interface StatusHistoryItem {
  id: string;
  device_id: string;
  machine_id: string;
  status_code: number;
  status_description: string;
  timestamp: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  device_id: string;
  is_read: boolean;
  created_at: string;
}

interface Device {
  id: string;
  machine_id: string;
  name: string;
  status?: string;
}

interface DeviceStatusClientProps {
  deviceId: string;
}

export function DeviceStatusClient({ deviceId }: DeviceStatusClientProps) {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [device, setDevice] = useState<Device | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load device details, status history, and notifications
  useEffect(() => {
    async function loadData() {
      if (!deviceId) return;
      
      try {
        // Fetch specific device
        const { data: deviceData, error: deviceError } = await supabase
          .from("device_list")
          .select("device_id, device_reg_id, device_name, device_status")
          .eq("device_id", deviceId)
          .single();
        
        if (deviceError) {
          console.error("Error fetching device:", deviceError);
          setError("Failed to fetch device details");
          setLoading(false);
          return;
        }
        
        if (!deviceData) {
          setError("Device not found");
          setLoading(false);
          return;
        }
        
        const deviceInfo = {
          id: deviceData.device_id,
          machine_id: deviceData.device_reg_id || "Unknown",
          name: deviceData.device_name || deviceData.device_reg_id || `Device ${deviceData.device_id}`,
          status: deviceData.device_status
        };
        
        // Store device info in localStorage for the SendStatus component
        localStorage.setItem('device_info', JSON.stringify({
          device_id: deviceInfo.id,
          device_name: deviceInfo.name
        }));
        
        setDevice(deviceInfo);
        
        console.log("Using device ID:", deviceId);
        
        // Fetch status history for this device
        const { data: statusData, error: statusError } = await supabase
          .from("device_status_history")
          .select("*")
          .eq("device_id", deviceId)
          .order("timestamp", { ascending: false })
          .limit(20);
        
        if (statusError) {
          console.error("Error fetching status history:", statusError);
        } else {
          setStatusHistory(statusData || []);
        }
        
        // Fetch notifications for this device
        const { data: notifData, error: notifError } = await supabase
          .from("notifications")
          .select("*")
          .eq("device_id", deviceId)
          .order("created_at", { ascending: false })
          .limit(20);
        
        if (notifError) {
          console.error("Error fetching notifications:", notifError);
        } else {
          setNotifications(notifData || []);
        }
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated && deviceId) {
      loadData();
    }
  }, [isAuthenticated, deviceId]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get status badge color based on code
  const getStatusBadge = (code: number) => {
    if (code < 100) return "bg-gray-500";
    if (code < 200) return "bg-green-500";
    if (code < 300) return "bg-blue-500";
    if (code < 400) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleBackToList = () => {
    router.push('/dashboard/machine-status');
  };

  // Create a test status entry
  const createTestStatusEntry = async () => {
    if (!device) return;

    const testCode = 100;
    const testDescription = "Machine idle (Test Entry)";

    try {
      const { data, error } = await supabase
        .from("device_status_history")
        .insert({
          device_id: device.id,
          machine_id: device.machine_id,
          status_code: testCode,
          status_description: testDescription,
          timestamp: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error("Error creating test status entry:", error);
        return;
      }

      // Add the new entry to the state
      setStatusHistory(prev => [data[0], ...prev]);
    } catch (err) {
      console.error("Failed to create test status entry:", err);
    }
  };

  // Create a test notification
  const createTestNotification = async () => {
    if (!device) return;

    const testTitle = "Test Notification";
    const testMessage = "This is a test notification created by the system.";

    try {
      const { data, error } = await supabase
        .from("notifications")
        .insert({
          device_id: device.id,
          type: "system",
          title: testTitle,
          message: testMessage,
          is_read: false,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error("Error creating test notification:", error);
        return;
      }

      // Add the new entry to the state
      setNotifications(prev => [data[0], ...prev]);
    } catch (err) {
      console.error("Failed to create test notification:", err);
    }
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
        <Button onClick={handleBackToList}>Back to Device List</Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button 
            variant="outline" 
            onClick={handleBackToList}
            className="mb-2"
          >
            ← Back to Device List
          </Button>
          <h1 className="text-2xl font-bold">
            {device?.name}
            {device?.status && (
              <Badge 
                className={`ml-2 ${
                  device.status === 'active' ? 'bg-green-500' : 
                  device.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                }`}
              >
                {device.status}
              </Badge>
            )}
          </h1>
          <p className="text-gray-500">Device ID: {device?.id}</p>
        </div>
      </div>

      <Tabs defaultValue="status">
        <TabsList className="mb-4">
          <TabsTrigger value="status">Status History</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="send-status">Send Status</TabsTrigger>
        </TabsList>

        {/* Status History Tab */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Status History</CardTitle>
                <Button onClick={createTestStatusEntry} variant="outline" size="sm">
                  Create Test Entry
                </Button>
              </div>
              <CardDescription>Recent status updates for this device</CardDescription>
            </CardHeader>
            <CardContent>
              {statusHistory.length > 0 ? (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {statusHistory.map((status) => (
                        <tr key={status.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusBadge(status.status_code)}>
                              {status.status_code}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">{status.status_description}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatDate(status.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">No status history available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notifications</CardTitle>
                <Button onClick={createTestNotification} variant="outline" size="sm">
                  Create Test Notification
                </Button>
              </div>
              <CardDescription>System notifications for this device</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 rounded-lg border ${notification.is_read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          {!notification.is_read && (
                            <Badge className="ml-2 bg-blue-500">New</Badge>
                          )}
                        </div>
                        {!notification.is_read && (
                          <Button 
                            onClick={() => markAsRead(notification.id)} 
                            variant="ghost" 
                            size="sm"
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      <div className="text-xs text-gray-500">{formatDate(notification.created_at)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">No notifications available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Send Status Tab */}
        <TabsContent value="send-status">
          <Card>
            <CardHeader>
              <CardTitle>Send Status Update</CardTitle>
              <CardDescription>Send a status update for this device</CardDescription>
            </CardHeader>
            <CardContent>
              <SendStatus />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 