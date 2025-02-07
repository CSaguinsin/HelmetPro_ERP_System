"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { LayoutDashboard, Settings, ShoppingCart, ChevronDown, Layers } from "lucide-react"
import DeviceStateCard from "../../components/DeviceStateCard"
import OperatingStatusCard from "../../components/OperatingStatusCard"
import DeviceEndateCard from "../../components/DeviceEndateCard"
import RecentSalesCard from "../../components/RecentSalesCard"
import { Navbar } from "../../components/Navbar"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader } from "lucide-react" 
import Sidebar from "../../components/Sidebar"

import Image from "next/image"


export default function DashboardPage() {
  const userName = "John Doe" // Replace this with the actual user name, possibly from a context or prop
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
      } else {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth()
    })

    return () => subscription?.unsubscribe()
  }, [router])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar userName={userName} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-background border-r">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DeviceStateCard />
              <OperatingStatusCard />
              <DeviceEndateCard />
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,324</div>
                </CardContent>
              </Card>
            </div>
            <RecentSalesCard />
          </div>
        </main>
      </div>
    </div>
  )
}

