"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, ShoppingCart, ChevronDown, Layers } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Basic Configuration",
    icon: Settings,
    subItems: [
      { title: "General Settings", href: "/settings/general" },
      { title: "User Management", href: "/settings/users" },
      { title: "Permissions", href: "/settings/permissions" },
    ],
  },
  {
    title: "Sales Management",
    icon: ShoppingCart,
    subItems: [
      { title: "Orders", href: "/sales/orders" },
      { title: "Customers", href: "/sales/customers" },
      { title: "Products", href: "/sales/products" },
    ],
  },
  {
    title: "System Management",
    icon: Layers,
    subItems: [
      { title: "Logs", href: "/system/logs" },
      { title: "Backups", href: "/system/backups" },
      { title: "Updates", href: "/system/updates" },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Management System</h2>
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

