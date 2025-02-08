"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, ShoppingCart, ChevronDown, Layers, LogOut } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Image from "next/image"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import type React from "react" // Added import for React

interface SubItem {
  title: string
  href: string
}

interface MenuItem {
  title: string
  icon: React.ElementType
  href?: string
  subItems?: SubItem[]
}

interface OpenStates {
  [key: string]: boolean
}

const menuItems: MenuItem[] = [
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
    subItems: [{ title: "Set User Rights", href: "/system/logs" }],
  },
]

export default function SidebarComponent() {
  const router = useRouter()
  const pathname = usePathname()

  const [openStates, setOpenStates] = useState<OpenStates>(() =>
    menuItems.reduce((acc: OpenStates, item) => {
      if (item.subItems) acc[item.title] = true
      return acc
    }, {}),
  )

  const toggleMenu = (title: string) => {
    setOpenStates((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push("/")
    } else {
      console.error("Sign out error:", error.message)
    }
  }

  return (
    <div className="pb-6 min-h-screen flex flex-col justify-between bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-lg">
      <div>
        <div className="px-4 py-6">
          <div className="flex justify-center pb-8">
            <Image
              src="/helmetpro/logo.jpeg"
              alt="Logo"
              width={80}
              height={80}
              className="h-20 w-auto rounded-lg shadow-md"
            />
          </div>

          <div className="space-y-2">
            {menuItems.map((item, index) =>
              item.subItems ? (
                <Collapsible key={index} open={openStates[item.title]} defaultOpen={true}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      onClick={() => toggleMenu(item.title)}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.title}
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          openStates[item.title] ? "rotate-180" : "",
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 py-2 space-y-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={cn(
                          "block py-2 px-3 rounded-md text-sm transition-colors duration-200",
                          pathname === subItem.href
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700",
                        )}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link key={index} href={item.href!}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start transition-colors duration-200",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700",
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.title}
                  </Button>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full bg-red-500 hover:bg-red-600 text-white border-none shadow-md transition-colors duration-200"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}

