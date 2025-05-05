"use client"

import * as React from "react"
import { Search, UserPlus } from "lucide-react"

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

// Mock data
const users = [
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

const userRoles = ["admin", "editor", "author", "contributor", "subscriber"]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedRole, setSelectedRole] = React.useState("")
  const [dobStart, setDobStart] = React.useState("")
  const [dobEnd, setDobEnd] = React.useState("")
  const [pageSize, setPageSize] = React.useState("10")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [userDetailOpen, setUserDetailOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<(typeof users)[0] | null>(null)

  // Filter users based on filters
  const filteredUsers = React.useMemo(() => {
    let filtered = [...users]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by role
    if (selectedRole) {
      filtered = filtered.filter((user) => user.role === selectedRole)
    }

    // Filter by date of birth range
    if (dobStart) {
      filtered = filtered.filter((user) => user.dob >= dobStart)
    }

    if (dobEnd) {
      filtered = filtered.filter((user) => user.dob <= dobEnd)
    }

    return filtered
  }, [searchQuery, selectedRole, dobStart, dobEnd])

  const handlePreviewUser = (user: (typeof users)[0]) => {
    setSelectedUser(user)
    setUserDetailOpen(true)
  }

  const handleChangeRole = (userId: string, newRole: string) => {
    // In a real app, you would make an API call to update the user role
    console.log(`Changing role for user ${userId} to ${newRole}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
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

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex items-center gap-2">
                <span className="text-sm">DOB From:</span>
                <Input type="date" value={dobStart} onChange={(e) => setDobStart(e.target.value)} className="w-auto" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">DOB To:</span>
                <Input type="date" value={dobEnd} onChange={(e) => setDobEnd(e.target.value)} className="w-auto" />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.description}</TableCell>
                    <TableCell>
                      <Select defaultValue={user.role} onValueChange={(value) => handleChangeRole(user.id, value)}>
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
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handlePreviewUser(user)}>
                        Preview
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Items per page:</p>
                <Select value={pageSize} onValueChange={setPageSize}>
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
                  Showing {Math.min(filteredUsers.length, Number.parseInt(pageSize, 10))} of {filteredUsers.length}{" "}
                  results
                </p>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
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
