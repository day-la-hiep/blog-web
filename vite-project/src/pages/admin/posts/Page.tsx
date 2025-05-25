
import * as React from "react"
import { ArrowDown, ArrowDownIcon, ArrowDownUp, ArrowUp, ArrowUpIcon, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, MessageSquare, Search, Undo2, View, X } from "lucide-react"

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
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptPost as acceptPost, fetchPost, fetchPosts, fetchPostsByCategory, rejectPost, unacceptPost } from "@/service/PostApi"
import { Label } from "@/components/ui/label"
import { useNavigate, useSearchParams } from "react-router"
import { useEffect } from "react"
import { DatePicker } from "@/components/ui/DatePicker"

// Mock data
const mockPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    author: "John Doe",
    summary: "Learn the basics of Next.js and how to get started with your first project.",
    status: "published",
    date: "2023-05-15",
  },
  {
    id: "2",
    title: "Understanding React Hooks",
    author: "Jane Smith",
    summary: "A deep dive into React Hooks and how they can simplify your code.",
    status: "published",
    date: "2023-05-10",
  },
  {
    id: "3",
    title: "The Future of AI in Web Development",
    author: "Mike Johnson",
    summary: "Exploring how AI is changing the landscape of web development.",
    status: "pending",
    date: "2023-05-20",
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox",
    author: "Sarah Williams",
    summary: "A comparison of CSS Grid and Flexbox for modern layouts.",
    status: "pending",
    date: "2023-05-18",
  },
  {
    id: "5",
    title: "Mobile-First Design Principles",
    author: "David Lee",
    summary: "Best practices for implementing mobile-first design in your projects.",
    status: "published",
    date: "2023-05-12",
  },
]

export default function PostsPage() {
  const [sortBy, setSortBy] = React.useState("id")
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const [status, setStatus] = React.useState("ALL")
  const [approvedStatus, setApprovedStatus] = React.useState("ALL")
  const [activeTab, setActiveTab] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [startDate, setStartDate] = React.useState()
  const [endDate, setEndDate] = React.useState()
  const [pageLimit, setPagelimit] = React.useState<number>(10)

  const totalPages = React.useRef<number>(0)
  const totalItems = React.useRef<number>(0)

  const [currentPage, setCurrentPage] = React.useState<number>(0)
  const currentPageInputRef = React.useRef<HTMLInputElement>()
  const [filteredPosts, setFilteredPosts] = React.useState<any[]>(mockPosts)

  useEffect(() => {
    const q = searchParams.get("search") || "";
    setSearchQuery(q)
  }, [searchParams]);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    updatePost()

    return () => {
      controller.abort(); // Dừng request cũ
    };
  }, [status, approvedStatus, pageLimit, currentPage, searchQuery,
    startDate, endDate, searchParams.get("categoryId"), sortBy]);



  const handleApprove = (id: string) => {
    // In a real app, you would make an API call to update the post status
    console.log(`Approving post ${id}`)
  }

  const handleReject = (id: string) => {
    // In a real app, you would make an API call to update the post status
    console.log(`Rejecting post ${id}`)
  }

  const handleAccepted = async (postId: string) => {
    const res = await acceptPost(postId)
    if (res.approvedStatus == 'ACCEPTED') {
      setFilteredPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, approvedStatus: res.approvedStatus, status: res.status } : post
        )
      );
    }
    // router.push(`/dashboard/posts/${id}`)
  }

  const handleUnacceptPost = async (postId: string) => {
    const res = await unacceptPost(postId)
    if (res.approvedStatus == 'NONE') {
      setFilteredPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, approvedStatus: res.approvedStatus, status: res.status } : post
        )
      );
    }
    // router.push(`/dashboard/comments?postId=${id}`)
  }

  const handleRejectPost = async (postId: string) => {
    const res = await rejectPost(postId)
    if (res.approvedStatus == 'REJECTED') {
      setFilteredPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, approvedStatus: res.approvedStatus, status: res.status } : post
        )
      );
    }
  }

  const updatePost = async () => {
    let res;
    if (searchParams.get("categoryId") != null) {
      res = await fetchPostsByCategory(searchParams.get("categoryId") || "", {
        page: currentPage,
        limit: pageLimit,
        search: searchQuery,
        approvedStatus: approvedStatus == 'ALL' ? undefined : approvedStatus,
        status: status == 'ALL' ? undefined : status,
        fromDate: startDate,
        toDate: endDate,
        sortBy: sortBy
      })
    } else {
      res = await fetchPosts({
        page: currentPage,
        limit: pageLimit,
        search: searchQuery,
        approvedStatus: approvedStatus == 'ALL' ? undefined : approvedStatus,
        status: status == 'ALL' ? undefined : status,
        fromDate: startDate,
        toDate: endDate,
        sortBy: sortBy
      })
    }

    setCurrentPage(res.page)
    setPagelimit(res.limit)
    totalItems.current = res.totalItems
    totalPages.current = res.totalPages
    setFilteredPosts(res.items)
    currentPageInputRef.current.value = (currentPage + 1).toString()
  }



  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  const handleInputBLur = (e: React.FocusEvent<HTMLInputElement>) => {

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
    <div className="flex  flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
      </div>

      <Tabs className="w-full" defaultValue="all" onValueChange={(activeTab) => {
        setActiveTab(activeTab)

      }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:cont">
          <Select>
            <div className="flex gap-2">
              <Label>Status: </Label>
              <Select defaultValue={status} value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Post status" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value={"ALL"}>All</SelectItem>
                  <SelectItem value={"PENDING"}>Pending</SelectItem>
                  <SelectItem value={"DRAFT"}>Draft</SelectItem>
                  <SelectItem value={"DONE"}>Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Label>Approved: </Label>
              <Select defaultValue={approvedStatus} value={approvedStatus} onValueChange={setApprovedStatus}>
                <SelectTrigger className="w-[125px]">
                  <SelectValue placeholder="Post status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"ALL"}>All</SelectItem>
                  <SelectItem value={"NONE"}>None</SelectItem>
                  <SelectItem value={"ACCEPTED"}>Accepted</SelectItem>
                  <SelectItem value={"REJECTED"}>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </Select>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <div>
              <CardTitle>Post Management</CardTitle>
              <CardDescription>Manage, approve, and reject posts. Click on a post to view more details.</CardDescription>
            </div>

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
                    <DatePicker
                      value={startDate}
                      onValueChange={(date) => setStartDate(date)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">To:</span>
                    <DatePicker
                      value={endDate}
                      onValueChange={(date) => setEndDate(date)}
                    />
                  </div>
                </div>
              </div>
              <Table >
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <span className="inline-flex items-center gap-1">
                        ID
                        {getSortIcon('id')}

                      </span>


                    </TableHead>
                    <TableHead>
                      <span className="inline-flex items-center gap-1">
                        Title
                        {getSortIcon('title')}
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="inline-flex items-center gap-1">
                        Author
                        {getSortIcon('author')}
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="inline-flex items-center gap-1">
                        Last updated
                        {getSortIcon('lastUpdated')}
                      </span>
                    </TableHead>
                    <TableHead>

                      <span className="inline-flex items-center gap-1">
                        Status
                        {getSortIcon('status')}
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="inline-flex items-center gap-1">
                        approved
                        {getSortIcon('approvedStatus')}
                      </span>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-[50px] truncate whitespace-nowrap" title={post.id}>{post.id}</TableCell>
                      <TableCell className="max-w-[500px] truncate whitespace-nowrap" title={post.title}>{post.title}</TableCell>
                      <TableCell className="max-w-[100px] truncate whitespace-nowrap" title={post.author}>{post.author}</TableCell>
                      <TableCell title={new Date(post.lastUpdated).toLocaleDateString('vi-VN')}>{new Date(post.lastUpdated).toLocaleDateString('vi-VN')}</TableCell>
                      {/* <TableCell className="font-medium max-w-[100px] truncate whitespace-nowrap">
                        {post.summary}
                      </TableCell> */}
                      <TableCell>
                        <Badge
                          className={
                            post.status === 'DRAFT' ? 'bg-yellow-500 text-white' :
                              post.status === 'DONE' ? 'bg-green-600 text-white' :
                                post.status === 'PENDING' ? 'bg-orange-500 text-white' :
                                  'bg-gray-400 text-white' // fallback nếu không khớp
                          }
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          post.approvedStatus === 'ACCEPTED' ? 'bg-green-500 text-white' :
                            post.approvedStatus === 'REJECTED' ? 'bg-red-500 text-white' :
                              post.approvedStatus === 'NONE' ? 'bg-gray-400 text-white' :
                                'bg-blue-500 text-white' // mặc định
                        }>
                          {post.approvedStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>


                          <DropdownMenuTrigger asChild>

                            <span className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                              Action <ChevronDown className="ml-1 h-4 w-4" />
                            </span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              window.open(`preview-post/${post.id}`, '_blank')
                            }}>
                              <View /> Preview
                            </DropdownMenuItem>

                            {
                              post.status == 'PENDING' &&
                              <DropdownMenuItem onClick={() => handleAccepted(post.id)}>
                                <Check />
                                <span>Accept</span>
                              </DropdownMenuItem>
                            }
                            {
                              post.status == 'DONE' && post.approvedStatus == 'ACCEPTED' && <>
                                <DropdownMenuItem onClick={() => window.open(`/posts/${post.id}`, '_blank')}>
                                  <ArrowUpRight /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUnacceptPost(post.id)}>
                                  <Undo2 />
                                  <span>Unaccept</span>
                                </DropdownMenuItem>

                              </>

                            }
                            {
                              post.status == 'PENDING' &&
                              <DropdownMenuItem onClick={() => handleRejectPost(post.id)}>
                                <X />
                                <span>Reject </span>
                              </DropdownMenuItem>
                            }

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

                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>



              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Items per page:</p>
                  <Select defaultValue={pageLimit.toString()} value={pageLimit.toString()} onValueChange={
                    (value) => setPagelimit(Number(value))
                  }>
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
                    Showing {Math.min(filteredPosts.length, pageLimit)} of {totalItems.current}{" "}
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
                        onKeyDown={handleInputKeyDown}
                        onBlur={handleInputBLur}
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
      </Tabs>
    </div>
  )
}


