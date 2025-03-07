"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DataTable from "./data-table";
import { columns, SiteInfo } from "./columns"; // ✅ Import SiteInfo type
import AddSiteInfo from "./add-site-info";
import Sidebar from "../../../../components/Sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Menu } from "lucide-react";
import { LoadingDots } from "../../../../components/loading-dots";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Fetch site information from Supabase
async function getData(): Promise<SiteInfo[]> {
  const { data, error } = await supabase.from("site_info").select("*");

  if (error) {
    console.error("Error fetching site_info:", error);
    return [];
  }

  return data as SiteInfo[]; // ✅ Ensure type matches columns.ts
}

export default function DemoPage() {
  const [data, setData] = useState<SiteInfo[]>([]); // ✅ Corrected type
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    siteType: "",
    siteNumber: "",
    siteName: "",
    deviceCode: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getData();
      setData(result);
      setLoading(false);
    };

    fetchData();
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
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Set Site Info</h1>
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

          {/* Filters & Actions Card */}
          <Card className="mb-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Filters & Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Select
                  value={filters.siteType}
                  onValueChange={(value) => setFilters({ ...filters, siteType: value })}
                >
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Site Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700">
                    <SelectItem value="type1" className="hover:bg-gray-100 dark:hover:bg-gray-600">Type 1</SelectItem>
                    <SelectItem value="type2" className="hover:bg-gray-100 dark:hover:bg-gray-600">Type 2</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Site Number"
                  value={filters.siteNumber}
                  onChange={(e) => setFilters({ ...filters, siteNumber: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-700"
                />
                <Input
                  placeholder="Site Name"
                  value={filters.siteName}
                  onChange={(e) => setFilters({ ...filters, siteName: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-700"
                />
                <Input
                  placeholder="Device Code"
                  value={filters.deviceCode}
                  onChange={(e) => setFilters({ ...filters, deviceCode: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-700"
                />
              </div>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors">
                  <Search className="mr-2 h-4 w-4" /> Inquiry
                </Button>
                <Button variant="secondary" className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Reset</Button>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors">
                      <Plus className="mr-2 h-4 w-4" /> New Site Info
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">New Site Information</DialogTitle>
                    </DialogHeader>
                    <AddSiteInfo onClose={() => setIsModalOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Site Information Table */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Site Information</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={data} /> {/* ✅ Corrected type */}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}