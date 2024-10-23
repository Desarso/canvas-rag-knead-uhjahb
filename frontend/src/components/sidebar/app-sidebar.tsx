import { Plus } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

import { SidebarButton } from "./sidebar-button"
import { useState } from "react"

export function AppSidebar() {
  const [selectedButton, setSelectedButton] = useState<number | null>(null)

  // Menu items.
  const [chats, setChats] = useState([
    {
      title: "Chat 1",
      url: "#",
    },
    {
      title: "Chat 2",
      url: "#",
    },
    {
      title: "Chat 3",
      url: "#",
    },
  ])

  // set the clicked button as the selected one
  const handleSelect = (index: number) => {
    setSelectedButton(index);
  }

  const handleDelete = (index: number) => {
    setChats(chats.filter((_, i) => i !== index))
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuButton className="mb-[28px]">
            <span>New Chat</span>
            <Plus />
          </SidebarMenuButton>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((item, index) => (
                <SidebarButton 
                  key={index}
                  title={item.title} 
                  url={item.url} 
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
  )
}
