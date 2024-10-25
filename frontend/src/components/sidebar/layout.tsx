import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { useState } from "react";
import { Chat } from "@/App";

interface Props {
  userId: string;
  setUserId: (userId: string) => void;
  setSelectedChat: (chatId: string) => void;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
}

export const Layout = (
 { userId, setUserId, setSelectedChat, chats, setChats }: Props
) => {
  const [open, setOpen] = useState(true)



  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar
        userId={userId}
        setUserId={setUserId}
        setSelectedChat={setSelectedChat}
        chats={chats}
        setChats={setChats}
      />
      <SidebarTrigger className="sticky top-0 z-10 mt-1"/>
    </SidebarProvider>
  );
};
