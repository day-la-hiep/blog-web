import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSideBar";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthService } from "@/hooks/AuthProvider";
import { adminLoginPath } from "@/RouteDefinition";
import { BlobOptions } from "buffer";
import AdminProtectedRoute from "@/routes/AdminProtectedRoutes";


export default function CmsLayout() {
  console.log("Admin page init rendered")


  return (
    (
      <AdminProtectedRoute>
        <SidebarProvider>
          <AppSidebar />
          <Outlet />
        </SidebarProvider>
      </AdminProtectedRoute>
    )
  );
}
