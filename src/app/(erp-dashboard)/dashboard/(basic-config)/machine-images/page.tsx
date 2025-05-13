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
import { 
  Menu, 
  CheckCircle2, 
  Search, 
  Filter, 
  RefreshCw, 
  Bell, 
  Image as ImageIcon, 
  Settings, 
  AlertCircle, 
  Laptop, 
  Plus, 
  X,
  ChevronRight
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const [activeTab, setActiveTab] = useState("all");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        setRefreshing(true);
        
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
        setTimeout(() => setRefreshing(false), 500);
      }
    };

    fetchDevices();
  }, [authLoading, isAuthenticated, router, user]);

  // Handle search and filter
  useEffect(() => {
    let result = [...devices];
    
    // Apply tab filter
    if (activeTab === "configured") {
      result = result.filter(device => device.media_configured);
    } else if (activeTab === "unconfigured") {
      result = result.filter(device => !device.media_configured);
    }
    
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
  }, [searchTerm, typeFilter, devices, activeTab]);

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
    setActiveTab("all");
  };

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get counts for tabs
  const configuredCount = devices.filter(d => d.media_configured).length;
  const unconfiguredCount = devices.filter(d => !d.media_configured).length;

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <LoadingDots color="#3B82F6" size={8} speed={0.5} />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading devices...</p>
        </div>
      </div>
    );
  }

  // If a device is selected, show the MediaUploadComponent
  if (selectedDeviceId) {
    return <MediaUploadComponent deviceId={selectedDeviceId} onBack={handleBackToList} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sidebar - Desktop */}
      <div className={`hidden lg:flex`}>
        <Sidebar />
      </div>

      {/* Sidebar - Mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <header className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden" 
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Media Manager</h1>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hidden sm:flex">
                HelmetPro ERP
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9" 
                onClick={() => {
                  setRefreshing(true);
                  setTimeout(() => setRefreshing(false), 800);
                }}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 sm:h-9 sm:w-9">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarFallback className="bg-blue-500 text-white text-xs sm:text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.email || 'User'}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </header>
        </div>

        <main className="p-4 sm:p-6 space-y-6">
          {error && (
            <div className="p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Tabs and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="overflow-x-auto -mx-4 sm:mx-0 pb-2 sm:pb-0">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full sm:w-auto flex justify-between sm:justify-start">
                  <TabsTrigger value="all" className="flex-1 sm:flex-initial data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20">
                    All Devices
                    <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {devices.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="configured" className="flex-1 sm:flex-initial data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/20">
                    Configured
                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                      {configuredCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unconfigured" className="flex-1 sm:flex-initial data-[state=active]:bg-gray-50 dark:data-[state=active]:bg-gray-700/50">
                    Unconfigured
                    <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {unconfiguredCount}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 h-9"
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              
              <div className="relative flex-1 md:w-64 hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search devices..." 
                  className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Search bar for mobile */}
          <div className="sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search devices..." 
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filters Card */}
          {filtersVisible && (
            <Card className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Devices
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="h-8 text-xs"
                  >
                    Reset
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => setFiltersVisible(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Device Type</label>
                    <Select
                      value={typeFilter}
                      onValueChange={setTypeFilter}
                    >
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-700 h-9">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700">
                        <SelectItem value="all">All Types</SelectItem>
                        {deviceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Device Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredDevices.length === 0 ? (
              <div className="col-span-full text-center p-8 sm:p-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 shadow-sm">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No devices found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  {devices.length === 0 
                    ? "You don't have any devices associated with your account yet." 
                    : "No devices match your current filters."}
                </p>
                <Button 
                  onClick={devices.length === 0 
                    ? () => router.push('/dashboard/device-lists') 
                    : resetFilters
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {devices.length === 0 
                    ? <><Plus className="mr-2 h-4 w-4" /> Add New Device</> 
                    : "Reset Filters"
                  }
                </Button>
              </div>
            ) : (
              filteredDevices.map((device) => (
                <Card 
                  key={device.device_id} 
                  className={`overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer ${
                    device.media_configured 
                      ? 'bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-white dark:bg-gray-800'
                  }`}
                  onClick={() => handleDeviceSelect(device.device_id)}
                >
                  <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900/30">
                        <AvatarFallback className="rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                          <Laptop className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-medium">{device.device_name}</CardTitle>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {device.device_reg_id || device.device_id}</p>
                      </div>
                    </div>
                    {device.media_configured && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Configured</span>
                      </Badge>
                    )}
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-3">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Type:</span>
                        <span className="text-xs font-medium">{device.device_type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Status:</span>
                        <Badge variant={device.device_status === 'Enable' || device.device_status === 'active' ? 'success' : 'secondary'} className="text-xs">
                          {device.device_status === 'Enable' || device.device_status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <Button 
                        className={`w-full mt-2 ${device.media_configured 
                          ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
                          : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                        }`}
                        size="sm"
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        {device.media_configured ? 'Edit Media' : 'Add Media'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}