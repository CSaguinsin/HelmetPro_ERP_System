import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type Payment = {
  id: string
  amount: number
  site_id: "pending" | "processing" | "success" | "failed"
  site_name: string
  site_type: string
  email: string
}

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "site_id",
    header: "Site ID",
  },
  {
    accessorKey: "site_name",
    header: "Site Name",
  },
  {
    accessorKey: "site_type",
    header: "Site Type",
  },
  {
    accessorKey: "site_status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="destructive" onClick={() => console.log("Delete", row.original.site_id)}>
        Delete
      </Button>
    ),
  },
];
