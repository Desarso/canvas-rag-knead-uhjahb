import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { useState } from "react";
import { Chat } from "@/App";

interface Props {
  userId: string;
  setSelectedChat: (chatId: string) => void;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
}

export const Layout = (
 { userId, setSelectedChat, chats, setChats }: Props
) => {
  const [open, setOpen] = useState(true)



  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar
        userId={userId}
        setSelectedChat={setSelectedChat}
        chats={chats}
        setChats={setChats}
      />
      <SidebarTrigger className="sticky top-0 z-10 mt-1"/>
    </SidebarProvider>
  );
};
