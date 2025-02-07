"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, ShoppingCart, ChevronDown, Layers, Sidebar } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Image from "next/image"
import { useState } from 'react'

interface SubItem {
  title: string;
  href: string;
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  subItems?: SubItem[];
}

interface OpenStates {
  [key: string]: boolean;
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
    subItems: [
      { title: "Set User Rights", href: "/system/logs" }
    ],
  },
]

export default function SidebarComponent() {
  const pathname = usePathname()
  
  const [openStates, setOpenStates] = useState<OpenStates>(() => {
    return menuItems.reduce((acc: OpenStates, item) => {
      if (item.subItems) {
        acc[item.title] = true;
      }
      return acc;
    }, {});
  });

  const toggleMenu = (title: string) => {
    setOpenStates(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

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
                <Collapsible 
                  key={index} 
                  open={openStates[item.title]} 
                  defaultOpen={true}
                  className="transition-all duration-300 ease-in-out"
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between group"
                      onClick={() => toggleMenu(item.title)}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </div>
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 transition-transform duration-300 ease-in-out",
                          openStates[item.title] ? "transform rotate-180" : ""
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent 
                    className="px-4 py-2 transition-all duration-300 ease-in-out"
                  >
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={cn(
                          "block py-2 px-2 rounded-lg text-sm transition-colors duration-200",
                          pathname === subItem.href ? "bg-primary text-primary-foreground" : "hover:bg-accent",
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