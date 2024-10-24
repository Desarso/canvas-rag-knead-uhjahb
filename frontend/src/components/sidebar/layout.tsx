import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { useState } from "react";

export const Layout = () => {
  const [open, setOpen] = useState(true)



  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarTrigger className="sticky top-0 z-10 mt-1"/>
    </SidebarProvider>
  );
};
