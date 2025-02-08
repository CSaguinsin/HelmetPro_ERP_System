import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, ExternalLink } from "lucide-react"
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
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Site ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "site_name",
    header: "Site Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("site_name")}</div>,
  },
  {
    accessorKey: "site_type",
    header: "Site Type",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("site_type")}</Badge>,
  },
  {
    accessorKey: "manager",
    header: "Manager",
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
    accessorKey: "contact_info",
    header: "Contact Info",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">View</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Address: {row.original.site_address}</p>
            <p>Phone: {row.original.site_telephone_number}</p>
            <p>Area Code: {row.original.area_code}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "financial_info",
    header: "Financial Info",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">View</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Currency: {row.original.currency}</p>
            <p>Department: {row.original.department}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "time_info",
    header: "Time Info",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">View</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Time Zone: {row.original.time_zone}</p>
            <p>Zone Offset: {row.original.zone_offset}</p>
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
    accessorKey: "sms_sign",
    header: "SMS Sign",
    cell: ({ row }) => row.getValue("sms_sign") || "N/A",
  },
  {
    accessorKey: "texting_over_time",
    header: "Texting Over Time",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">View</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.getValue("remarks") || "No remarks"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const site = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(site.site_id.toString())}>
              Copy site ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]