
import * as React from "react"
import { Check, ChevronDown, Eye, MessageSquare, Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const posts = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    author: "John Doe",
    summary: "Learn the basics of Next.js and how to get started with your first project.",
    status: "published",
    date: "2023-05-15",
    category: "Programming",
  },
  {
    id: "2",
    title: "Understanding React Hooks",
    author: "Jane Smith",
    summary: "A deep dive into React Hooks and how they can simplify your code.",
    status: "published",
    date: "2023-05-10",
    category: "React",
  },
  {
    id: "3",
    title: "The Future of AI in Web Development",
    author: "Mike Johnson",
    summary: "Exploring how AI is changing the landscape of web development.",
    status: "pending",
    date: "2023-05-20",
    category: "AI",
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox",
    author: "Sarah Williams",
    summary: "A comparison of CSS Grid and Flexbox for modern layouts.",
    status: "pending",
    date: "2023-05-18",
    category: "CSS",
  },
  {
    id: "5",
    title: "Mobile-First Design Principles",
    author: "David Lee",
    summary: "Best practices for implementing mobile-first design in your projects.",
    status: "published",
    date: "2023-05-12",
    category: "Design",
  },
]

export default function PostsPage() {
//   const router = useRouter()
  const [activeTab, setActiveTab] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [pageSize, setPageSize] = React.useState("10")
  const [currentPage, setCurrentPage] = React.useState(1)

  // Filter posts based on active tab
  const filteredPosts = React.useMemo(() => {
    let filtered = [...posts]

    // Filter by tab (status)
    if (activeTab !== "all") {
      filtered = filtered.filter((post) => post.status === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.summary.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter((post) => post.date >= startDate)
    }

    if (endDate) {
      filtered = filtered.filter((post) => post.date <= endDate)
    }

    return filtered
  }, [activeTab, searchQuery, startDate, endDate, posts])

  const handleApprove = (id: string) => {
    // In a real app, you would make an API call to update the post status
    console.log(`Approving post ${id}`)
  }

  const handleReject = (id: string) => {
    // In a real app, you would make an API call to update the post status
    console.log(`Rejecting post ${id}`)
  }

  const handlePreview = (id: string) => {
    // router.push(`/dashboard/posts/${id}`)
  }

  const handleViewComments = (id: string) => {
    // router.push(`/dashboard/comments?postId=${id}`)
  }

  return (
    <div className="flex  flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
        <Button>Create Post</Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Post Management</CardTitle>
            <CardDescription>Manage, approve, and reject posts. Click on a post to view more details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">From:</span>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-auto"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">To:</span>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-auto"
                    />
                  </div>
                </div>
              </div>

              <TabsContent value="all" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="hidden md:table-cell">Summary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.id}</TableCell>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell className="hidden max-w-[300px] truncate md:table-cell">{post.summary}</TableCell>
                        <TableCell>
                          <Badge variant={post.status === "published" ? "default" : "secondary"}>
                            {post.status === "published" ? "Published" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions <ChevronDown className="ml-1 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handlePreview(post.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Preview</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewComments(post.id)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                <span>View Comments</span>
                              </DropdownMenuItem>
                              {post.status === "pending" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleApprove(post.id)}>
                                    <Check className="mr-2 h-4 w-4" />
                                    <span>Approve</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReject(post.id)}>
                                    <X className="mr-2 h-4 w-4" />
                                    <span>Reject</span>
                                  </DropdownMenuItem>
                                </>
                              )}
                              {post.status === "published" && (
                                <DropdownMenuItem onClick={() => handleReject(post.id)}>
                                  <X className="mr-2 h-4 w-4" />
                                  <span>Unpublish</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="pending" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="hidden md:table-cell">Summary</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.id}</TableCell>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell className="hidden max-w-[300px] truncate md:table-cell">{post.summary}</TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions <ChevronDown className="ml-1 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handlePreview(post.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Preview</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewComments(post.id)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                <span>View Comments</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleApprove(post.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                <span>Approve</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReject(post.id)}>
                                <X className="mr-2 h-4 w-4" />
                                <span>Reject</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="published" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="hidden md:table-cell">Summary</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.id}</TableCell>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell className="hidden max-w-[300px] truncate md:table-cell">{post.summary}</TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions <ChevronDown className="ml-1 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handlePreview(post.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Preview</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewComments(post.id)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                <span>View Comments</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

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
                    Showing {Math.min(filteredPosts.length, Number.parseInt(pageSize, 10))} of {filteredPosts.length}{" "}
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
      </Tabs>
    </div>
  )
}
