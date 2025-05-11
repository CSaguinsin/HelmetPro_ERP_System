"use client";

import { useState, useEffect } from "react";
import { type DeviceList, columns } from "./device-columns";
import { DeviceDataTable } from "./device-datatable";
import Sidebar from "../../../../components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, Search, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LoadingDots } from '../../../../components/loading-dots';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddDeviceInfo from "./add-device-info";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { getDeviceDetails } from "@/lib/hardwareApi";
import SendTransaction from "@/app/components/SendTransaction";
import SendStatus from "@/app/components/SendStatus";
import SendFeedback from "@/app/components/SendFeedback";

export default function DeviceLists() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [data, setData] = useState<DeviceList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    deviceType: "",
    deviceCode: "",
    deviceName: "",
    protocolType: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem('auth_token') || '' : '';
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getDeviceDetails();
        if ('error' in result) {
          throw new Error(result.error);
        }
        if (result.data) {
          setData([result.data]);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Failed to load devices. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <LoadingDots color="#3B82F6" size={8} speed={0.5} />
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Device Lists</h1>
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
              {/* Search Button */}
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Filters and Actions Card */}
          <Card className="mb-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Filters & Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Select
                  value={filters.deviceType}
                  onValueChange={(value) => setFilters({ ...filters, deviceType: value })}
                >
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Device Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700">
                    <SelectItem value="type1" className="hover:bg-gray-100 dark:hover:bg-gray-600">Type 1</SelectItem>
                    <SelectItem value="type2" className="hover:bg-gray-100 dark:hover:bg-gray-600">Type 2</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Device Code"
                  value={filters.deviceCode}
                  onChange={(e) => setFilters({ ...filters, deviceCode: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-700"
                />
                <Input
                  placeholder="Device Name"
                  value={filters.deviceName}
                  onChange={(e) => setFilters({ ...filters, deviceName: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-700"
                />
                <Select
                  value={filters.protocolType}
                  onValueChange={(value) => setFilters({ ...filters, protocolType: value })}
                >
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Protocol Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700">
                    <SelectItem value="type1" className="hover:bg-gray-100 dark:hover:bg-gray-600">Type 1</SelectItem>
                    <SelectItem value="type2" className="hover:bg-gray-100 dark:hover:bg-gray-600">Type 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors">
                  <Search className="mr-2 h-4 w-4" /> Inquiry
                </Button>
                <Button variant="secondary" className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Reset</Button>
                {/* New Device Info Button */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors">
                      <Plus className="mr-2 h-4 w-4" /> New Device Info
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">New Device Information</DialogTitle>
                    </DialogHeader>
                    <AddDeviceInfo onClose={() => setIsModalOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Device Information</CardTitle>
            </CardHeader>
            <CardContent>
              {data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No devices found. Click &quot;New Device Info&quot; to add your first device.
                </div>
              ) : (
                <div>
              <DeviceDataTable columns={columns} data={data} />
                  <div className="mt-8 space-y-8">
                    {data.map(device => (
                      <Card key={device.device_id} className="p-4 bg-gray-50 dark:bg-gray-900">
                        <div className="font-semibold mb-2 flex items-center justify-between">
                          <span>Device: {device.device_name || device.device_id}</span>
                          <Button size="sm" onClick={() => router.push(`/dashboard/device-settings/${device.device_id}`)}>
                            Settings
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <SendTransaction machineId={device.device_id.toString()} />
                          <SendStatus />
                          <SendFeedback machineId={device.device_id.toString()} />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}