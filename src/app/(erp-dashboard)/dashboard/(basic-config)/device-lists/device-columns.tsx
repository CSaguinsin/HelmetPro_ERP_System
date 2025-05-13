"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Laptop, 
  Clock, 
  Check, 
  AlertCircle,
  Settings,
  ExternalLink,
  Trash2,
  Copy,
  Eye
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Define the correct type for the device_list data
export interface DeviceList {
  device_id: number;
  device_name: string;
  device_status: "Disable" | "Enable" | "Maintenance"; // Enum values
  device_type: string;
  status: string; // Online or Offline
  protocol_type: string;
  maturity_time: string; // Timestamp as string (ISO 8601)
  department: string;
  customer_name: string;
  device_reg_id: string;
}

export const getColumns = (
  router: AppRouterInstance, 
  refreshData: () => Promise<void>
): ColumnDef<DeviceList>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "device_id",
    header: ({ column }) => (
      <Button 
        variant="ghost" 
        className="pl-0 font-medium hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
        #{row.getValue("device_id")}
      </div>
    ),
  },
  {
    accessorKey: "device_name",
    header: ({ column }) => (
      <Button 
        variant="ghost" 
        className="pl-0 font-medium hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Device Name
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 rounded-md bg-blue-100 dark:bg-blue-900/30">
          <AvatarFallback className="rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Laptop className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="font-medium">{row.getValue("device_name")}</div>
      </div>
    ),
  },
  {
    accessorKey: "device_status",
    header: ({ column }) => (
      <Button 
        variant="ghost" 
        className="pl-0 font-medium hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Device Status
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("device_status") as string | undefined;
  
      if (!status) {
        return <Badge variant="secondary">Unknown</Badge>; // Handle undefined case
      }
  
      const getStatusProps = () => {
        switch (status) {
          case "Enable":
            return { 
              variant: "outline", 
              className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
              icon: Check
            };
          case "Disable":
            return { 
              variant: "outline", 
              className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
              icon: AlertCircle
            };
          case "Maintenance":
            return { 
              variant: "outline", 
              className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
              icon: Settings
            };
          default:
            return { 
              variant: "outline", 
              className: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
              icon: Clock
            };
        }
      };
  
      const { className, icon: Icon } = getStatusProps();
  
      return (
        <Badge variant="outline" className={`flex items-center gap-1 px-2 py-1 ${className}`}>
          <Icon className="h-3 w-3" />
          <span>{status}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "device_type",
    header: ({ column }) => (
      <Button 
        variant="ghost" 
        className="pl-0 font-medium hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Device Type
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {row.getValue("device_type") || "—"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button 
        variant="ghost" 
        className="pl-0 font-medium hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      const getStatusProps = () => {
        switch (status) {
          case "Online":
            return { 
              variant: "outline", 
              className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
              icon: Check
            };
          case "Offline":
            return { 
              variant: "outline", 
              className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
              icon: AlertCircle
            };
          default:
            return { 
              variant: "outline", 
              className: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
              icon: Clock
            };
        }
      };
  
      const { className, icon: Icon } = getStatusProps();
  
      return (
        <Badge variant="outline" className={`flex items-center gap-1 px-2 py-1 ${className}`}>
          <Icon className="h-3 w-3" />
          <span>{status}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "protocol_type",
    header: ({ column }) => (
      <Button 
        variant="ghost" 
        className="pl-0 font-medium hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Protocol
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {row.getValue("protocol_type") || "—"}
      </div>
    ),
  },
  {
    accessorKey: "maturity_time",
    header: ({ column }) => (
      <Button 
        variant="ghost" 
        className="pl-0 font-medium hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Updated
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("maturity_time"));
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      let formattedDate;
      if (diffInDays === 0) {
        formattedDate = "Today, " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInDays === 1) {
        formattedDate = "Yesterday, " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInDays < 7) {
        formattedDate = `${diffInDays} days ago`;
      } else {
        formattedDate = date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
      }
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm text-gray-600 dark:text-gray-300 cursor-default">
                {formattedDate}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{date.toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "customer_name",
    header: ({ column }) => (
      <Button 
        variant="ghost" 
        className="pl-0 font-medium hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Customer
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("customer_name") as string;
      return (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {value || "—"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const device = row.original;

      const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete device ${device.device_name || device.device_id}?`)) {
          try {
            // Delete from device_list
            const { error } = await supabase
              .from("device_list")
              .delete()
              .eq("device_id", device.device_id);
              
            if (error) {
              console.error("Failed to delete device:", error);
              alert(`Error deleting device: ${error.message}`);
              return;
            }
            
            // Try to also delete from device_settings if it exists
            try {
              await supabase
                .from("device_settings")
                .delete()
                .eq("device_id", device.device_id);
            } catch {
              // It's ok if this fails - the settings might not exist
              console.log("Note: Device settings deletion was skipped or failed");
            }
            
            // Remove from localStorage if this was the active device
            if (localStorage.getItem("device_id") === device.device_id.toString()) {
              localStorage.removeItem("device_id");
            }
            
            // Update stored devices list in localStorage
            const storedDevices = JSON.parse(localStorage.getItem("user_devices") || "[]");
            const updatedDevices = storedDevices.filter(
              (d: { device_id: number | string }) => d.device_id?.toString() !== device.device_id?.toString()
            );
            localStorage.setItem("user_devices", JSON.stringify(updatedDevices));
            
            // Refresh the data to update the UI
            await refreshData();
            
            // Show success message
            alert("Device deleted successfully");
          } catch (error) {
            console.error("Error deleting device:", error);
            alert("An error occurred while deleting the device");
          }
        }
      };

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => navigator.clipboard.writeText(device.device_id.toString())}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Copy className="h-4 w-4" />
                <span>Copy ID</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => router.push(`/dashboard/device-lists/${device.device_id}`)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push(`/dashboard/device-settings/${device.device_id}`)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                <span>Edit Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
