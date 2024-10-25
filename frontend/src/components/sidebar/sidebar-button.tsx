import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { MoreHorizontal, Trash } from "lucide-react"

interface SidebarButtonProps {
    title: string
    chat_id: string
    index: number
    isSelected: boolean
    onSelect: (chat_id: string) => void
    onDelete: (chat_id: string) => void
  }

export function SidebarButton({title, chat_id, isSelected, onSelect, onDelete} : SidebarButtonProps) {
    const set_url = () => {
      //set href to /chat_id dont reload page
      window.history.pushState({}, '', `/${chat_id}`);
      onSelect(chat_id)
    }

    const deleteChat = () => {
      onDelete(chat_id)
    }

    return(
        <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isSelected} onClick={set_url} >
        {/* <a href={url}> */}
            <span>{title}</span>
          {/* </a> */}
        </SidebarMenuButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild >
            <SidebarMenuAction showOnHover={true}>
              <MoreHorizontal />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem className="focus:cursor-pointer" onClick={deleteChat}>
              <span className="text-red-600">Delete Chat</span>
              <Trash className="text-red-600"/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
}