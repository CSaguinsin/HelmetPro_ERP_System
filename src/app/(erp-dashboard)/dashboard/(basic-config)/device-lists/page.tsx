'use client';

import { useState, useEffect, useCallback } from 'react';
import { type DeviceList, getColumns } from './device-columns';
import { DeviceDataTable } from './device-datatable';
import Sidebar from '../../../../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Menu,
  Search,
  Plus,
  Filter,
  RefreshCw,
  X,
  ChevronDown,
  AlertCircle,
  Tablet,
  Bell,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LoadingDots } from '../../../../components/loading-dots';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddDeviceInfo from './add-device-info';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DeviceLists() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [data, setData] = useState<DeviceList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    deviceType: '',
    deviceCode: '',
    deviceName: '',
    protocolType: '',
  });

  // Function to refresh device data
  const refreshData = useCallback(async () => {
    if (!user?.user_client_id) return;

    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);

      const { data, error } = await supabase
        .from('device_list')
        .select(
          `
          device_id, 
          device_name, 
          device_status, 
          device_type,
          protocol_type,
          customer_nan,
          device_reg_id,
          media_configured
        `
        )
        .eq('user_client_id', user.user_client_id);

      if (error) {
        throw error;
      }

      // Add missing fields required by the DeviceList interface
      const formattedData = (data || []).map((device) => ({
        ...device,
        status: device.device_status === 'Enable' ? 'Online' : 'Offline',
        maturity_time: new Date().toISOString(),
        department: '',
        customer_name: device.customer_nan || '',
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh devices. Please try again later.');
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 500);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
      return;
    }

    refreshData();
  }, [user, authLoading, isAuthenticated, router, refreshData]);

  // Filter data based on filters and active tab
  const filteredData = data.filter((device) => {
    // Filter by tab
    if (activeTab === 'online' && device.status !== 'Online') return false;
    if (activeTab === 'offline' && device.status !== 'Offline') return false;

    // Filter by search fields
    if (filters.deviceType && device.device_type !== filters.deviceType) return false;
    if (
      filters.deviceCode &&
      !device.device_id.toString().includes(filters.deviceCode.toLowerCase())
    )
      return false;
    if (
      filters.deviceName &&
      !device.device_name.toLowerCase().includes(filters.deviceName.toLowerCase())
    )
      return false;
    if (
      filters.protocolType &&
      !device.protocol_type.toLowerCase().includes(filters.protocolType.toLowerCase())
    )
      return false;

    return true;
  });

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      deviceType: '',
      deviceCode: '',
      deviceName: '',
      protocolType: '',
    });
    setActiveTab('all');
  };

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Generate columns with router access
  const columns = getColumns(router, refreshData);

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <LoadingDots color="#3B82F6" size={8} speed={0.5} />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Loading devices...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sidebar - Desktop */}
      <div className={`hidden lg:flex`}>
        <Sidebar />
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Device List
              </h1>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hidden sm:flex"
              >
                HelmetPro ERP
              </Badge>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
                onClick={refreshData}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
              >
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
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full sm:w-auto flex justify-between sm:justify-start">
                  <TabsTrigger
                    value="all"
                    className="flex-1 sm:flex-initial data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20"
                  >
                    All Devices
                    <Badge
                      variant="outline"
                      className="ml-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {data.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="online"
                    className="flex-1 sm:flex-initial data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/20"
                  >
                    Online
                    <Badge
                      variant="outline"
                      className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                    >
                      {data.filter((d) => d.status === 'Online').length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="offline"
                    className="flex-1 sm:flex-initial data-[state=active]:bg-gray-50 dark:data-[state=active]:bg-gray-700/50"
                  >
                    Offline
                    <Badge
                      variant="outline"
                      className="ml-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {data.filter((d) => d.status === 'Offline').length}
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

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 h-9"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Device</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      New Device Information
                    </DialogTitle>
                  </DialogHeader>
                  <AddDeviceInfo
                    onClose={() => setIsModalOpen(false)}
                    onDeviceAdded={refreshData}
                  />
                </DialogContent>
              </Dialog>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Device Type
                    </label>
                    <Select
                      value={filters.deviceType}
                      onValueChange={(value) =>
                        setFilters({ ...filters, deviceType: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-700 h-9">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700">
                        <SelectItem value="type1">Type 1</SelectItem>
                        <SelectItem value="type2">Type 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Device Code
                    </label>
                    <Input
                      placeholder="Enter code"
                      value={filters.deviceCode}
                      onChange={(e) =>
                        setFilters({ ...filters, deviceCode: e.target.value })
                      }
                      className="bg-gray-50 dark:bg-gray-700 h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Device Name
                    </label>
                    <Input
                      placeholder="Enter name"
                      value={filters.deviceName}
                      onChange={(e) =>
                        setFilters({ ...filters, deviceName: e.target.value })
                      }
                      className="bg-gray-50 dark:bg-gray-700 h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Protocol Type
                    </label>
                    <Select
                      value={filters.protocolType}
                      onValueChange={(value) =>
                        setFilters({ ...filters, protocolType: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-700 h-9">
                        <SelectValue placeholder="Select protocol" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700">
                        <SelectItem value="type1">Type 1</SelectItem>
                        <SelectItem value="type2">Type 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Table Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Tablet className="h-5 w-5 mr-2 text-blue-500" />
                  Device Information
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {filteredData.length} {filteredData.length === 1 ? 'device' : 'devices'}{' '}
                  found
                </p>
              </div>

              <div className="relative w-full max-w-xs hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search devices..."
                  className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-9"
                  value={filters.deviceName}
                  onChange={(e) => setFilters({ ...filters, deviceName: e.target.value })}
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {filteredData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Tablet className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No devices found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                    {activeTab !== 'all' || Object.values(filters).some((f) => f !== '')
                      ? 'Try adjusting your filters or search criteria.'
                      : "You don't have any devices associated with your account yet."}
                  </p>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add New Device
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <DeviceDataTable columns={columns} data={filteredData} />
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
