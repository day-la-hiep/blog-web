"use client"

import * as React from "react"
import { ArrowDownIcon, ArrowDownUp, ArrowUpIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, UserPlus } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { fetch } from "@cloudinary/url-gen/qualifiers/source"
import { fetchUsers, udpateUserRole } from "@/service/UserApi"
import { Description } from "@radix-ui/react-dialog"
import { toast } from "sonner"
import { useEffect } from "react"

// Mock data
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    description: "Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    dob: "1990-05-15",
    joinDate: "2022-01-10",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    description: "UX Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "editor",
    dob: "1988-07-22",
    joinDate: "2022-03-15",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    description: "Backend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "author",
    dob: "1992-11-08",
    joinDate: "2022-02-05",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    description: "Content Writer",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "contributor",
    dob: "1995-03-30",
    joinDate: "2022-04-20",
  },
  {
    id: "5",
    name: "David Lee",
    email: "david@example.com",
    description: "Full Stack Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    dob: "1991-09-14",
    joinDate: "2021-12-15",
  },
]

const userRoles = ["ADMIN", "USER"]

export default function UsersPage() {
  // pagination and filtering state
  const [sortBy, setSortBy] = React.useState("id")
  const [searchQuery, setSearchQuery] = React.useState("")
  const currentPageInputRef = React.useRef<HTMLInputElement>(null)
  const [selectedRole, setSelectedRole] = React.useState("all")
  const [pageLimit, setPageLimit] = React.useState(10)
  const [currentPage, setCurrentPage] = React.useState(0)
  const totalItems = React.useRef<number>(0)
  const totalPages = React.useRef<number>(0)
  // UI state
  const [userDetailOpen, setUserDetailOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<(typeof mockUsers)[0] | null>(null)
  const [filteredUsers, setFilteredUsers] = React.useState<{
    id: string,
    name: string,
    email: string,
    description: string,
    dob: Date,
    role: string,
    username: string
  }[]>([])
  useEffect(() => {
    updateUser()
  }, [currentPage, pageLimit, searchQuery, selectedRole, sortBy])

  const updateUser = async () => {
    const res = await fetchUsers({
      page: currentPage,
      limit: pageLimit,
      searchBy: searchQuery,
      role: selectedRole === "all" ? undefined : selectedRole,
      sortBy: sortBy,
    })
    if (!res || !res.items) {
      toast.error("Failed to fetch users")
      return
    }
    setFilteredUsers(res.items.map((item) => ({
      id: item.id,
      name: item.firstName + ' ' + item.lastName,
      username: item.username,
      email: item.mail,
      description: item.description,
      role: item.userRole,
      avatarUrl: item.avatarUrl || "/placeholder.svg?height=40&width=40",
    })))
    currentPageInputRef.current.value = (currentPage + 1).toString()
    totalPages.current = res.totalPages
    totalItems.current = res.totalItems
  }



  // Filter users based on filters

  const handlePreviewUser = (user: (typeof mockUsers)[0]) => {
    setSelectedUser(user)
    setUserDetailOpen(true)
  }

  const handleUpdateRole = async (username: string, newRole: string) => {
    // In a real app, you would make an API call to update the user role
    try {
      const res = await udpateUserRole(username, newRole)
      toast.success(`User role updated to ${newRole}`)
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === username ? { ...user, role: newRole } : user
        )
      )
    } catch (error) {
      toast.error(`Failed to update user role: ${error.message}`)
    }
    console.log(`Changing role for user ${username} to ${newRole}`)
  }

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {

      const value = parseInt(e.currentTarget.value, 10)
      if (!isNaN(value) && value > 0 && value <= totalPages.current) {
        setCurrentPage(value - 1)
        currentPageInputRef.current.value = (currentPage + 1).toString()
      } else {
        currentPageInputRef.current.value = (currentPage + 1).toString()
      }
    }


  }
  const handlePageInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {

    currentPageInputRef.current.value = (currentPage + 1).toString()
  }

  const getSortIcon = (key: string) => {
    if (sortBy.includes(key)) {
      if (sortBy.includes('-')) {
        return <ArrowDownIcon onClick={() => setSortBy(key)} className="h-4 w-4" />;
      } else {
        return <ArrowUpIcon onClick={() => setSortBy('-' + key)} className="h-4 w-4" />;
      }
    }
    return <ArrowDownUp onClick={() => setSortBy(key)} className="h-4 w-4 opacity-50" />;
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage users, assign roles, and view detailed user information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Role:</span>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    {userRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>

                    <div className="flex items-center gap-1">
                      ID
                      {getSortIcon('id')}
                    </div>
                  </TableHead>
                  <TableHead>

                    <div className="flex items-center gap-1">
                      Full Name
                      {getSortIcon('firstName')}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      Username
                      {getSortIcon('username')}
                    </div></TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Email
                      {getSortIcon('mail')}
                    </div></TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Role
                      {getSortIcon('userRole')}
                    </div></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="max-w-3 truncate" title={user.id}>{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.description}</TableCell>
                    <TableCell>
                      <Select value={user.role} onValueChange={(value) => handleUpdateRole(user.username, value)}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {userRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Items per page:</p>
                <Select value={pageLimit.toString()} onValueChange={(value) => {
                  setPageLimit(Number(value))
                }}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Showing {Math.min(filteredUsers.length, Number.parseInt(pageLimit, 10))} of {filteredUsers.length}{" "}
                  results
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(0)}
                  disabled={currentPage === 0}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.min(currentPage - 1, totalPages.current - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Input

                      ref={currentPageInputRef}
                      className="w-16 h-9 text-center"
                      onKeyDown={handlePageInputKeyDown}
                      onBlur={handlePageInputBlur}
                    />
                    <span className="text-sm mx-2">/ {totalPages.current}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages.current - 1))}
                  disabled={currentPage === totalPages.current - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages.current - 1)}
                  disabled={currentPage === totalPages.current - 1}
                  aria-label="Trang cuối cùng"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <Sheet open={userDetailOpen} onOpenChange={setUserDetailOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>User Details</SheetTitle>
              <SheetDescription>View detailed information about this user.</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="flex flex-col items-center gap-4 text-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <span className="font-medium">Email:</span>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <span className="font-medium">Description:</span>
                  <span>{selectedUser.description}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <span className="font-medium">Date of Birth:</span>
                  <span>{selectedUser.dob}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <span className="font-medium">Joined:</span>
                  <span>{selectedUser.joinDate}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline">Edit User</Button>
                <Button variant="destructive">Delete User</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
