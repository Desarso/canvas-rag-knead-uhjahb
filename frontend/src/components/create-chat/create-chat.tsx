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
import { ReactNode, useState } from "react";
import { CourseSelect } from "./course-select";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface CreateChatProps {
    children: ReactNode
  }

  interface FileData {
    id: number;
    filename: string;
  } 

export function CreateChat({children} : CreateChatProps) {
  const [fileData, setFileData] = useState<FileData[]>([
    {
      id: 0,
      filename: "Syllabus.pdf"
    },
    {
      id: 1,
      filename: "Required Reading 10-23-24.pdf"
    },
    {
      id: 2,
      filename: "Lecture Notes 10-21-24.pdf"
    },
  ])
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
              <DataTable columns={columns} data={fileData} setData={setFileData}/>
            </div>

        </div>
        
        <DialogFooter className="h-[10%]">
          <Button type="submit">Create Chat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
