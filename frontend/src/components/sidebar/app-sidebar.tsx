import { Home, Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { SidebarButton } from "./sidebar-button";
import { useState } from "react";
import { CreateChat } from "../create-chat/create-chat";
import { Chat } from "@/App";
import { Link } from "react-router-dom";
interface Props {
  userId: string;
  setSelectedChat: (chatId: string) => void;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
}

export function AppSidebar({ userId, setSelectedChat, chats, setChats  }: Props) {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);

  // set the clicked button as the selected one
  const handleSelect = (chat_id: string) => {
    setSelectedChat(chat_id);
  };

  const handleDelete = async (chat_id: string) => {
    const url = new URL("http://127.0.0.1:8000/chat");
    url.searchParams.append("user_id", userId);
    url.searchParams.append("chat_id", chat_id);

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text();
        throw new Error(`Error deleting chat: ${response.status} ${errorText}`);
      }

      const result = await response.text();
      console.log(result);
    } catch (error) {
      // Handle network errors or other unexpected errors
      console.error("An error occurred while deleting the chat:", error);
    }
    //then remove from the list

    const newChats = chats.filter((chat) => chat.chat_id !== chat_id);
    setChats(newChats);

  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <Link to="/">
            <SidebarMenuButton>
                <Home />
                <span>Home</span>
            </SidebarMenuButton>
          </Link>
          <CreateChat>
            <SidebarMenuButton className="mb-[28px]">
              <Plus />
              <span>New Chat</span>
            </SidebarMenuButton>
          </CreateChat>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((item, index) => (
                <SidebarButton
                  key={index}
                  title={item.collection}
                  chat_id={item.chat_id}
                  index={index}
                  isSelected={selectedButton === index}
                  onSelect={handleSelect}
                  onDelete={handleDelete}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
