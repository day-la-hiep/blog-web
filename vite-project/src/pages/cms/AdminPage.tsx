import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthService } from "@/hooks/AuthProvider";
import { adminLoginPath } from "@/RouteDefinition";
import { BlobOptions } from "buffer";


export default function CmsLayout() {
  console.log("Admin page init rendered")


  return (
    (
      <SidebarProvider>
        <AppSidebar />
        <Outlet />
      </SidebarProvider>
    )
  );
}
