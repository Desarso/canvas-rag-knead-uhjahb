import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { MoreHorizontal, Trash } from "lucide-react"

interface SidebarButtonProps {
    title: string
    url: string
    index: number
    isSelected: boolean
    onSelect: (index: number) => void
    onDelete: (index: number) => void
  }

export function SidebarButton({title, url, isSelected, onSelect, onDelete, index} : SidebarButtonProps) {
    const hi = () => {
      console.log(`Selected: ${title}`)
      onSelect(index)
    }

    const deleteChat = () => {
      onDelete(index)
    }

    return(
        <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isSelected} onClick={hi} >
        <a href={url}>
            <span>{title}</span>
          </a>
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