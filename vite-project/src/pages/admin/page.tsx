"use client"

import type * as React from "react"
import { FileText, Flag, Home, LogOut, MessageSquare, Search, Settings, Tag, User, Users, View } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { href, Outlet, useLocation, useNavigate } from "react-router-dom"
import { title } from "process"

export default function Page() {
  // const router = useRouter()
  // const pathname = usePathname()
  const location = useLocation()
  const pathname = location.pathname
  const navigate = useNavigate()
  const handleLogout = () => {
    // Handle logout logic here
    // router.push("/")
  }

  const mainNavItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Posts",
      icon: FileText,
      href: "/dashboard/posts",
    },
    {
      title: "Comments",
      icon: MessageSquare,
      href: "/dashboard/comments",
    },
    {
      title: "Users",
      icon: Users,
      href: "/dashboard/users",
    },
    {
      title: "Categories",
      icon: Tag,
      href: "/dashboard/categories",
    },
    {
      title: "Reports",
      icon: Flag,
      href: "/dashboard/reports",
    }
  ]

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Admin Panel</span>
                <span className="text-xs text-muted-foreground">Content Management</span>
              </div>
            </div>
            <div className="px-2 py-2 flex items-center gap-2">

              <form>
                <div className="relative">
                  <Input type="search" placeholder="Search..." className="h-9 md:w-[100px] lg:w-full" />
                </div>
              </form>
              <Button>
                <Search/>
              </Button>

            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                        <button onClick={() => navigate(item.href)}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {/* <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"} tooltip="Settings">
                      <button onClick={() => navigate("/dashboard/settings")}>
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Edit Profile">
                      <button onClick={() => navigate("/dashboard/profile")}>
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup> */}
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Site">
                  <button onClick={() => navigate("/")}>
                    <View className="h-4 w-4" />
                    <span>View Site</span>
                  </button>
                </SidebarMenuButton>
                <SidebarMenuButton asChild tooltip="Logout">
                  <button onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
                
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <ScrollArea className="h-full"><Outlet /></ScrollArea>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
