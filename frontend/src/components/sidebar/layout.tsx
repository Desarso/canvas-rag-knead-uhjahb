import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { PanelLeft, PanelRight } from 'lucide-react'
import { useState } from "react";
import { Button } from "../ui/button";

export const Layout = () => {
  const [open, setOpen] = useState(true)



  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <Button 
            data-sidebar="trigger"
            variant="ghost"
            className="sticky top-0 z-10" onClick={() => {setOpen(!open)}}>
        { open ? <PanelLeft /> : <PanelRight />}
      </Button>
    </SidebarProvider>
  );
};
