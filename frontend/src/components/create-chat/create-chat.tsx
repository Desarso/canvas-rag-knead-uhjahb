import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react";
import { CourseSelect } from "./course-select";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface CreateChatProps {
    children: ReactNode
  }

export function CreateChat({children} : CreateChatProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="flex flex-col w-[70%] h-[70%]">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>
            To create a new chat, please choose a course first.
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
            <CourseSelect />
            <div className="container mx-auto p-0 ml-10">
              <DataTable columns={columns} data={[]} />
            <div/>
    </div>
        </div>
        
        <DialogFooter className="h-[10%]">
          <Button type="submit">Create Chat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
