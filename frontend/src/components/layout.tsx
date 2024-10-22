// src/components/Layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
        <SidebarTrigger />
    </SidebarProvider>
  );
};
