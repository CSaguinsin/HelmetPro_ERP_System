'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '../../components/Sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Search,
  Bell,
  Filter,
  RefreshCw,
  Settings,
  Image as ImageIcon,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  BarChart3,
  Menu,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ✅ Type Definitions
type Device = {
  device_id: string;
  device_name: string;
  device_status: string;
  protocol_type: string;
  customer_nan: string;
  is_mobile_logged_in?: boolean;
  device_reg_id: string;
};

// Skeleton loader component for cards
const CardSkeleton = () => (
  <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
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
  <div className="p-6 rounded-xl shadow-md border border-gray-200 bg-white dark:bg-gray-800">
    <Skeleton className="h-6 w-[150px] mb-3" />
    <Skeleton className="h-4 w-[100px] mb-3" />
    <Skeleton className="h-4 w-[120px] mb-3" />
    <Skeleton className="h-4 w-[140px] mb-4" />
    <div className="flex gap-2">
      <Skeleton className="h-9 w-[100px]" />
      <Skeleton className="h-9 w-[100px]" />
    </div>
  </div>
);

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusProps = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return { variant: 'success', icon: CheckCircle };
      case 'inactive':
        return { variant: 'secondary', icon: Clock };
      case 'maintenance':
      case 'error':
        return { variant: 'destructive', icon: AlertCircle };
      default:
        return { variant: 'outline', icon: Clock };
    }
  };

  const { variant, icon: Icon } = getStatusProps();

  return (
    <Badge variant={variant as any} className="flex items-center gap-1 px-2 py-1">
      <Icon className="h-3 w-3" />
      <span>{status}</span>
    </Badge>
  );
};

// Modern card components
const ActiveDevicesCard = ({ devices }: { devices: Device[] }) => {
  const activeDevices = devices.filter((d) => d.device_status.toLowerCase() === 'active');
  const percentage =
    devices.length > 0 ? Math.round((activeDevices.length / devices.length) * 100) : 0;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
      <div className="absolute top-0 right-0 h-24 w-24 bg-green-500/10 rounded-bl-full" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Active Devices
        </CardTitle>
        <Zap className="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {activeDevices.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            of {devices.length}
          </div>
        </div>
        <div className="mt-3 w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // ✅ Fetch user devices
  useEffect(() => {
    const fetchUserDevices = async () => {
      if (!user?.user_client_id) return;

      try {
        setLoading(true);
        // First check if mobile_sessions table exists
        const { error: checkError } = await supabase
          .from('mobile_sessions')
          .select('*', { count: 'exact', head: true });

        // If table doesn't exist or we can't access it, just fetch devices without join
        if (checkError) {
          console.log('Mobile sessions table not available:', checkError.message);

          const { data, error } = await supabase
            .from('device_list')
            .select(
              `
              device_id, 
              device_name, 
              device_status, 
              protocol_type, 
              customer_nan,
              device_reg_id
            `
            )
            .eq('user_client_id', user.user_client_id);

          if (error) throw error;
          setDevices(data || []);
          setLoading(false);
          return;
        }

        // If mobile_sessions exists, try with a left join instead of inner join
        const { data, error } = await supabase
          .from('device_list')
          .select(
            `
            device_id, 
            device_name, 
            device_status, 
            protocol_type, 
            customer_nan,
            device_reg_id,
            mobile_sessions(is_active)
          `
          )
          .eq('user_client_id', user.user_client_id);

        if (error) {
          console.error('Error fetching devices:', error);
          setError('Failed to load devices. Please try again later.');
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
          const devicesWithStatus = data.map((device) => ({
            ...device,
            is_mobile_logged_in:
              device.mobile_sessions &&
              Array.isArray(device.mobile_sessions) &&
              device.mobile_sessions.some((session) => session && session.is_active),
          }));

          setDevices(devicesWithStatus || []);
        } catch (err) {
          console.error('Error processing device data:', err);
          setDevices(data || []);
        } finally {
          setLoading(false);
        }
      } catch (err) {
        console.error('Unexpected error fetching devices:', err);
        setError('An unexpected error occurred. Please try again later.');
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
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  // Filter devices based on search and tab
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      searchQuery === '' ||
      device.device_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.customer_nan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && device.device_status.toLowerCase() === 'active') ||
      (activeTab === 'inactive' && device.device_status.toLowerCase() === 'inactive') ||
      (activeTab === 'mobile' && device.is_mobile_logged_in);

    return matchesSearch && matchesTab;
  });

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(async () => {
      if (user?.user_client_id) {
        try {
          const { data, error } = await supabase
            .from('device_list')
            .select(
              `
              device_id, 
              device_name, 
              device_status, 
              protocol_type, 
              customer_nan,
              device_reg_id,
              mobile_sessions(is_active)
            `
            )
            .eq('user_client_id', user.user_client_id);

          if (!error && data) {
            const devicesWithStatus = data.map((device) => ({
              ...device,
              is_mobile_logged_in:
                device.mobile_sessions &&
                Array.isArray(device.mobile_sessions) &&
                device.mobile_sessions.some((session) => session && session.is_active),
            }));
            setDevices(devicesWithStatus);
          }
        } catch (err) {
          console.error('Error refreshing data:', err);
        }
      }
      setRefreshing(false);
    }, 800);
  };

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
                Dashboard
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
                onClick={handleRefresh}
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

        <main className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            {loading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <>
                <ActiveDevicesCard devices={devices} />
                <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-gray-500/10 rounded-bl-full" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Devices
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {devices.length}
                    </div>
                    <div className="flex items-center mt-1">
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        +20.1%
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        from last month
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>Last updated: Today, 9:41 AM</span>
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-2 py-1">
                        View All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Device List Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Vending Machines
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search machines..."
                    className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Button variant="outline" className="flex items-center gap-2 sm:w-auto">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <Tabs
                  defaultValue="all"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="mb-6"
                >
                  <TabsList className="bg-gray-100 dark:bg-gray-700 w-full sm:w-auto flex justify-between sm:justify-start">
                    <TabsTrigger value="all" className="flex-1 sm:flex-initial">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="active" className="flex-1 sm:flex-initial">
                      Active
                    </TabsTrigger>
                    <TabsTrigger value="inactive" className="flex-1 sm:flex-initial">
                      Inactive
                    </TabsTrigger>
                    <TabsTrigger value="mobile" className="flex-1 sm:flex-initial">
                      Mobile
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <DeviceCardSkeleton />
                  <DeviceCardSkeleton />
                  <DeviceCardSkeleton />
                </div>
              ) : filteredDevices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredDevices.map((device) => (
                    <div
                      key={device.device_id}
                      className={`relative p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer 
                        ${
                          device.is_mobile_logged_in
                            ? 'bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border border-green-200 dark:border-green-800'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                        }`}
                      onClick={() =>
                        router.push(`/dashboard/device-settings/${device.device_id}`)
                      }
                    >
                      {device.is_mobile_logged_in && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/50 rounded-full">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">
                            Mobile Active
                          </span>
                        </div>
                      )}

                      <div className="mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold mb-2 pr-20 sm:pr-24">
                          {device.device_name}
                        </h3>
                        <p className="text-sm text-gray-700 mb-2 pr-20 sm:pr-24">
                          {device.device_reg_id}
                        </p>
                        <StatusBadge status={device.device_status} />
                      </div>

                      <div className="space-y-2 mb-4 sm:mb-5">
                        <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          <span className="w-20 sm:w-24 text-gray-500 dark:text-gray-400">
                            Protocol:
                          </span>
                          <span className="font-medium">{device.protocol_type}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          <span className="w-20 sm:w-24 text-gray-500 dark:text-gray-400">
                            Customer:
                          </span>
                          <span className="font-medium">{device.customer_nan}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 sm:gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 flex items-center gap-1 text-xs sm:text-sm py-1 h-8 sm:h-9"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/machine-images/${device.device_id}`);
                          }}
                        >
                          <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Images</span>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm py-1 h-8 sm:h-9"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/device-settings/${device.device_id}`);
                          }}
                        >
                          <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Settings</span>
                        </Button>
                      </div>

                      {/* <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/device-settings/${device.device_id}`);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button> */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 sm:p-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3 sm:mb-4">
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No devices found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {error
                      ? 'There was an error loading your devices. Please try again later.'
                      : searchQuery
                        ? 'No devices match your search criteria. Try adjusting your search.'
                        : "You don't have any devices yet."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
