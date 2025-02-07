"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  site_id: "pending" | "processing" | "success" | "failed"
  site_name: string
  site_type:string
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "site_id",
    header: "Site ID",
  },
  {
    accessorKey: "site_name",
    header: "Site Name"
  },
  {
    accessorKey: "site_type",
    header: "Site Type"
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
