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
import { ReactNode, useState, useEffect } from "react";
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
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const populateFileList = async () => {
    if (userId === "" || selectedCourse === "") return;
    
    setLoading(true);

    try {
      const url = new URL("http://127.0.0.1:8000/get_course_files");
      url.searchParams.append("user_id", userId);
      url.searchParams.append("course_id", selectedCourse);
      console.log(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching files: ${response.statusText}`);
      }

      let filedata = await response.json();
      filedata = filedata.map((file: any) => ({
        id: file.file_id,
        filename: file.display_name,
      }));

      setFileData(filedata)

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Hide loading screen
    }
  }

  useEffect(() => {
    populateFileList();
  }, [selectedCourse]);

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
            <div className={selectedCourse ? "h-full max-h-[400px] overflow-y-auto" : ""}>
              {!loading ? (<DataTable
                columns={columns}
                data={fileData}
                setData={populateFileList}
              />) : ( 
              <div className="flex justify-center items-center h-full">
                <DialogDescription>
                  Loading...
                </DialogDescription>
              </div>
            )}
            </div>
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
