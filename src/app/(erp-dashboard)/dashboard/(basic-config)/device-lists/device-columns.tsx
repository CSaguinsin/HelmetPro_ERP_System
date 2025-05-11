"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "device_id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Device ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "device_name",
    header: "Device Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("device_name")}</div>,
  },
  {
    accessorKey: "device_status",
    header: "Device Status",
    cell: ({ row }) => {
      const status = row.getValue("device_status") as string | undefined;
  
      if (!status) {
        return <Badge variant="secondary">Unknown</Badge>; // Handle undefined case
      }
  
      return (
        <Badge variant={status === "Enable" ? "default" : "destructive"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "device_type",
    header: "Device Type",
    cell: ({ row }) => <div>{row.getValue("device_type")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Online" ? "default" : "destructive"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "protocol_type",
    header: "Protocol Type",
    cell: ({ row }) => <div>{row.getValue("protocol_type")}</div>,
  },
  {
    accessorKey: "maturity_time",
    header: "Maturity Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("maturity_time"));
      return <div>{date.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => <div>{row.getValue("department")}</div>,
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",
    cell: ({ row }) => <div>{row.getValue("customer_name")}</div>,
  },
  {
    accessorKey: "device_reg_id",
    header: "Device Reg ID",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">View</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.getValue("device_reg_id")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(device.device_id.toString())}>
              Copy Device ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/dashboard/device-lists/${device.device_id}`)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/device-settings/${device.device_id}`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
