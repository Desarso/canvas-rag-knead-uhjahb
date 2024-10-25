import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function CourseSelect() {
  const [course, setCourse] = useState("bottom")


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Course Select</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Courses</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={course} onValueChange={setCourse}>
          <DropdownMenuRadioItem value="CSC 133">CSC 133</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="CSC 135">CSC 135</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="CSC 139">CSC 139</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
