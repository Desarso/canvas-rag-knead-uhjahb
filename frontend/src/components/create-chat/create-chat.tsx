import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { CourseSelect } from "./course-select";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { v4 as uuidv4 } from "uuid";

interface Props {
  children: ReactNode;
  userId: string;
  setUserId: (userId: string) => void;
}

interface FileData {
  id: number;
  filename: string;
}

export function CreateChat({ children, userId, setUserId}: Props) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [fileData, setFileData] = useState<FileData[]>([
    {
      id: 0,
      filename: "Syllabus.pdf",
    },
    {
      id: 1,
      filename: "Required Reading 10-23-24.pdf",
    },
    {
      id: 2,
      filename: "Lecture Notes 10-21-24.pdf",
    },
  ]);

  const handleCreateChat = async () => {
    if (userId === "") return;
    try {
      const url = new URL("http://127.0.0.1:8000/create_chat");
      const chat_id = uuidv4();
      url.searchParams.append("user_id", userId);
      url.searchParams.append("course_id", selectedCourse);
      url.searchParams.append("chat_id", chat_id);
      console.log(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching chats: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("created chat?:", data);
      //set user ID to same thing to trigger useEffect and retrieve chats
      const user_id = userId;
      setUserId(user_id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col w-[70%] h-[70%]">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>
            To create a new chat, please choose a course first.
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <CourseSelect
            userId={userId}
            course={selectedCourse}
            setSelectedCourse={setSelectedCourse}
          />

          <div className="container mx-auto p-0 ml-10">
            <DataTable
              columns={columns}
              data={fileData}
              setData={setFileData}
            />
          </div>
        </div>

        <DialogFooter className="h-[10%]">
          <Button
            type="submit"
            onClick={() => {
              handleCreateChat();
            }}
          >
            Create Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
