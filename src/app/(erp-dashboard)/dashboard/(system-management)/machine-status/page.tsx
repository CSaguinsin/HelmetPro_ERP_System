"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Sidebar from "../../../../components/Sidebar";
import { supabase } from "@/lib/supabase";

interface Device {
  device_id: string;
  device_name: string;
  device_type: string;
  device_status: string;
  device_reg_id: string;
  last_updated?: string;
}

export default function MachineStatusPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();
  const { loading: authLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Don't fetch devices until auth loading is complete
    if (authLoading) return;
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    
    const fetchDevices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Only fetch devices for the current user
        if (!user?.user_client_id) {
          setDevices([]);
          setFilteredDevices([]);
          return;
        }
        
        // Fetch devices for this user from Supabase
        const { data, error } = await supabase
          .from("device_list")
          .select("*")
          .eq("user_client_id", user.user_client_id);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const devicesList = data.map(device => ({
            device_id: device.device_id.toString(),
            device_name: device.device_name || device.device_reg_id || `Device ${device.device_id}`,
            device_type: device.device_type && device.device_type.trim() !== '' ? device.device_type : "Unspecified",
            device_status: device.device_status || "inactive",
            device_reg_id: device.device_reg_id || "",
            last_updated: device.last_updated
          }));
          
          setDevices(devicesList);
          setFilteredDevices(devicesList);
        } else {
          setDevices([]);
          setFilteredDevices([]);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
        setError(error instanceof Error ? error.message : "Failed to load devices");
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [authLoading, isAuthenticated, router, user]);

  // Handle search and filter
  useEffect(() => {
    let result = [...devices];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(device => 
        device.device_name.toLowerCase().includes(term) || 
        device.device_reg_id.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter (ignore if "all" is selected)
    if (statusFilter && statusFilter !== "all") {
      result = result.filter(device => device.device_status === statusFilter);
    }
    
    setFilteredDevices(result);
  }, [searchTerm, statusFilter, devices]);

  const handleDeviceSelect = (deviceId: string) => {
    router.push(`/dashboard/machine-status/${deviceId}`);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Error</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500">Maintenance</Badge>;
      case 'disabled':
      case 'disable':
        return <Badge className="bg-gray-500">Disabled</Badge>;
      default:
        return <Badge className="bg-gray-500">Inactive</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Machine Status & Notifications</h1>
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
            </div>
          </div>

          {/* Filters Card */}
          <Card className="mb-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  placeholder="Search by device name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700"
                />
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700">
                    <SelectItem value="all" className="hover:bg-gray-100 dark:hover:bg-gray-600">All Statuses</SelectItem>
                    <SelectItem value="active" className="hover:bg-gray-100 dark:hover:bg-gray-600">Active</SelectItem>
                    <SelectItem value="error" className="hover:bg-gray-100 dark:hover:bg-gray-600">Error</SelectItem>
                    <SelectItem value="maintenance" className="hover:bg-gray-100 dark:hover:bg-gray-600">Maintenance</SelectItem>
                    <SelectItem value="disabled" className="hover:bg-gray-100 dark:hover:bg-gray-600">Disabled</SelectItem>
                    <SelectItem value="inactive" className="hover:bg-gray-100 dark:hover:bg-gray-600">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
              </div>
            </CardContent>
          </Card>

          {/* Devices List */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Devices</CardTitle>
              <CardDescription>Select a device to view its status history and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredDevices.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mb-4 text-gray-500">
                    No devices found matching your criteria.
                  </div>
                  {devices.length === 0 ? (
                    <div>
                      <p className="mb-4 text-gray-500">
                        You don&apos;t have any devices associated with your account.
                      </p>
                      <Button 
                        onClick={() => router.push('/dashboard/device-lists')}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                      >
                        Add New Device
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={resetFilters}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Device Name</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold hidden md:table-cell">Device ID</TableHead>
                        <TableHead className="font-semibold hidden md:table-cell">Last Updated</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDevices.map((device) => (
                        <TableRow 
                          key={device.device_id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <TableCell className="font-medium">{device.device_name}</TableCell>
                          <TableCell>{getStatusBadge(device.device_status)}</TableCell>
                          <TableCell className="hidden md:table-cell text-gray-500">
                            {device.device_reg_id || device.device_id.substring(0, 8)}...
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-gray-500">
                            {formatDate(device.last_updated)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              onClick={() => handleDeviceSelect(device.device_id)}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 