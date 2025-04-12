import { Group, LayoutDashboard, Search, Settings, StickyNote, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  adminCategoriesPath,
  adminDashboardPath,
  adminPostsPath,
  adminRoleManagePath,
  adminUsersPath
} from '@/RouteDefinition'
import { Link } from "react-router-dom"
// Menu items.
const items = [
  {
    title: "Dashboard",
    url: adminDashboardPath,
    icon: LayoutDashboard,
  },
  {
    title: "Post management",
    url: adminPostsPath,
    icon: StickyNote,
  },
  {
    title: "User management",
    url: adminUsersPath,
    icon: User,
  },
  {
    title: "Category management",
    url: adminCategoriesPath,
    icon: Search,
  },
  {
    title: "Role management",
    url: adminRoleManagePath,
    icon: Group
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="none" className="w-auto h-auto" >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
