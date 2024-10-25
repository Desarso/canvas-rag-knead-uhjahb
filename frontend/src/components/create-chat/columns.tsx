import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type File = {
    id: number,
    filename: string
}

export const columns: ColumnDef<File>[] = [
  {
    accessorKey: "filename",
    header: "File Name",
  },
]
