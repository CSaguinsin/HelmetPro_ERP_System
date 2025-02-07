"use client"

import { useState, useEffect } from "react"
import { type Payment, columns } from "./columns"
import { DataTable } from "./data-table"
import Sidebar from "../../../../components/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Menu, Search, Plus } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LoadingDots } from '../../../../components/loading-dots'

async function getData(): Promise<Payment[]> {
  // Simulating an API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return [
    {
      id: "728ed52f",
      amount: 100,
      site_id: "pending",
      site_name: "manila",
      site_type: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      site_id: "pending",
      site_name: "manila",
      site_type: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      site_id: "pending",
      site_name: "manila",
      site_type: "pending",
      email: "m@example.com",
    },
  ]
}

export default function DemoPage() {
  const [data, setData] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    siteType: "",
    siteNumber: "",
    siteName: "",
    deviceCode: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getData()
        setData(result)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingDots color="#3B82F6" size={8} speed={0.5} />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Set Site Info</h1>
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              <Button>
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>

          {/* Filters and Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters & Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Select value={filters.siteType} onValueChange={(value) => setFilters({ ...filters, siteType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Site Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type1">Type 1</SelectItem>
                    <SelectItem value="type2">Type 2</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Site Number"
                  value={filters.siteNumber}
                  onChange={(e) => setFilters({ ...filters, siteNumber: e.target.value })}
                />
                <Input
                  placeholder="Site Name"
                  value={filters.siteName}
                  onChange={(e) => setFilters({ ...filters, siteName: e.target.value })}
                />
                <Input
                  placeholder="Device Code"
                  value={filters.deviceCode}
                  onChange={(e) => setFilters({ ...filters, deviceCode: e.target.value })}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">
                  <Search className="mr-2 h-4 w-4" /> Inquiry
                </Button>
                <Button variant="secondary">Reset</Button>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> New Site Info
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={data} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}