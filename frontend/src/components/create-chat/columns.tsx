import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type File = {
    name: string,
    type: string,
}

export const columns: ColumnDef<File>[] = [
  {
    accessorKey: "name",
    header: "File Name",
  },
  {
    accessorKey: "type",
    header: "File Type",
  },
]
