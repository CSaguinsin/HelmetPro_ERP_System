import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


export type SiteInfo = {
  site_id: number
  site_name: string
  site_type: string
  manager: string
  site_address: string
  site_telephone_number: string
  currency: string
  department: string
  time_zone: string
  zone_offset: number
  area_code: string
  deposit_push_url?: string
  withdraw_push_url?: string
  site_status: string
  sms_sign?: string
  texting_over_time: string
  remarks?: string
}

export const columns: ColumnDef<SiteInfo>[] = [
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
    accessorKey: "site_id",
    header: "Site ID",
    cell: ({ row }) => row.getValue("site_id"),
  },
  {
    accessorKey: "site_name",
    header: "Site Name",
    cell: ({ row }) => row.getValue("site_name"),
  },
  {
    accessorKey: "site_type",
    header: "Type",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("site_type")}</Badge>,
  },
  {
    accessorKey: "manager",
    header: "Manager",
    cell: ({ row }) => row.getValue("manager"),
  },
  {
    accessorKey: "site_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("site_status") as string
      return (
        <Badge variant={status === "active" ? "default" : "destructive"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "site_address",
    header: "Address",
    cell: ({ row }) => row.getValue("site_address"),
  },
  {
    accessorKey: "site_telephone_number",
    header: "Phone",
    cell: ({ row }) => row.getValue("site_telephone_number"),
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => row.getValue("currency"),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => row.getValue("department"),
  },
  {
    accessorKey: "time_zone",
    header: "Time Zone",
    cell: ({ row }) => row.getValue("time_zone"),
  },
  {
    accessorKey: "zone_offset",
    header: "Offset",
    cell: ({ row }) => row.getValue("zone_offset"),
  },
  {
    accessorKey: "area_code",
    header: "Area Code",
    cell: ({ row }) => row.getValue("area_code"),
  },
  {
    accessorKey: "sms_sign",
    header: "SMS Sign",
    cell: ({ row }) => row.getValue("sms_sign") || "N/A",
  },
  {
    accessorKey: "texting_over_time",
    header: "Texting Time",
    cell: ({ row }) => row.getValue("texting_over_time"),
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">View</Button>
          </TooltipTrigger>
          <TooltipContent className="bg-white shadow-md p-3 rounded-md">
            <p className="text-sm text-gray-700">{row.getValue("remarks") || "No remarks"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "push_urls",
    header: "Push URLs",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        {row.original.deposit_push_url && (
          <a href={row.original.deposit_push_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              Deposit <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </a>
        )}
        {row.original.withdraw_push_url && (
          <a href={row.original.withdraw_push_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              Withdraw <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </a>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const site = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 flex items-center justify-center">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 shadow-md rounded-md">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(site.site_id.toString())}>
              Copy Site ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
