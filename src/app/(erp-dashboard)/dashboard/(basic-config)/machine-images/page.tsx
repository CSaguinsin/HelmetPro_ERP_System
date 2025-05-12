"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LoadingDots } from "../../../../components/loading-dots"
import MediaUploadComponent from "./MediaUploadComponent"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import Sidebar from "../../../../components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Menu, CheckCircle2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Device {
  device_id: string;
  device_name: string;
  device_type: string;
  media_configured: boolean;
  device_status: string;
  device_reg_id: string;
}

export default function MachineImagesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
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
            media_configured: !!device.media_configured,
            device_reg_id: device.device_reg_id || ""
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
    
    // Apply type filter (ignore if "all" is selected)
    if (typeFilter && typeFilter !== "all") {
      result = result.filter(device => device.device_type === typeFilter);
    }
    
    setFilteredDevices(result);
  }, [searchTerm, typeFilter, devices]);

  // Generate the unique device types for the filter dropdown
  const deviceTypes = [...new Set(devices.map(device => device.device_type))]
    .filter(type => type && type.trim() !== '')  // Filter out empty or whitespace-only values
    .sort(); // Sort alphabetically for better UX

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };

  const handleBackToList = () => {
    setSelectedDeviceId(null);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingDots />
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

  // If a device is selected, show the MediaUploadComponent
  if (selectedDeviceId) {
    return <MediaUploadComponent deviceId={selectedDeviceId} onBack={handleBackToList} />;
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Device Media Management</h1>
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
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Device Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700">
                    <SelectItem value="all" className="hover:bg-gray-100 dark:hover:bg-gray-600">All Types</SelectItem>
                    {deviceTypes.map(type => (
                      <SelectItem key={type} value={type} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                        {type}
                      </SelectItem>
                    ))}
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device Name</TableHead>
                        <TableHead>Device ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Media Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDevices.map((device) => (
                        <TableRow key={device.device_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <TableCell className="font-medium">{device.device_name}</TableCell>
                          <TableCell>{device.device_reg_id}</TableCell>
                          <TableCell>
                            {device.device_type === "Unspecified" ? (
                              <span className="text-gray-500 italic">Unspecified</span>
                            ) : (
                              device.device_type
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="default"
                              className={device.device_status === 'Enable' || device.device_status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
                            >
                              {device.device_status === 'Enable' || device.device_status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {device.media_configured ? (
                              <div className="flex items-center">
                                <Badge className="bg-green-500" variant="default">
                                  Configured
                                </Badge>
                                <CheckCircle2 className="h-3.5 w-3.5 ml-1 text-green-500" />
                              </div>
                            ) : (
                              <Badge variant="outline">Not Configured</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              onClick={() => handleDeviceSelect(device.device_id)}
                              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                            >
                              {device.media_configured ? 'Edit Media' : 'Add Media'}
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