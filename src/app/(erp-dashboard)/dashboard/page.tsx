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

import Image from "next/image"

const menuItems = [
  {
    title: "Home",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Basic Configuration",
    icon: Settings,
    subItems: [
      { title: "Set Site Info", href: "/dashboard/set-site-info" },
      { title: "Device Lists", href: "/dashboard/device-lists" },
      { title: "Commodity Category Setting", href: "/dashboard/commodity-category-settings" },
      { title: "Set Material Info", href: "/dashboard/set-material-info" },
      { title: "Add or Edit Machine Images", href: "/dashboard/machine-images" },
    ],
  },
  {
    title: "Sales Management",
    icon: ShoppingCart,
    subItems: [
      { title: "Online Order Inquiry", href: "/sales/orders" },
      { title: "Commodity Distribution Management", href: "/sales/customers" },
      { title: "Products", href: "/sales/products" },
    ],
  },
  {
    title: "System Management",
    icon: Layers,
    subItems: [
      { title: "Set User Rights", href: "/system/logs" }
    ],
  },
]

function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
        <div className="flex justify-center pb-10">
            <Image 
              src="/helmetpro/logo.jpeg" 
              alt="Logo" 
              width={64} 
              height={64} 
              className="h-[5rem] w-auto" 
            />
          </div>
          <div className="space-y-1">
            {menuItems.map((item, index) =>
              item.subItems ? (
                <Collapsible key={index}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 py-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={cn(
                          "block py-2 px-2 rounded-lg text-sm",
                          pathname === subItem.href ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                        )}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link key={index} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

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

