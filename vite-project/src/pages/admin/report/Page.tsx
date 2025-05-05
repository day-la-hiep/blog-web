"use client"

import * as React from "react"
import { Check, Filter, Search, Trash, Trash2, X } from "lucide-react"
// import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

// Thêm interface cho Note
interface Note {
    id: string
    reportId: string
    content: string
    createdBy: string
    createdAt: string
    isAdmin: boolean
}

// Mock data for post reports
const postReports = [
    {
        id: "1",
        postId: "1",
        postTitle: "Getting Started with Next.js",
        reportedBy: "User123",
        reason: "Misleading content",
        details: "This post contains factually incorrect information about Next.js setup.",
        date: "2023-05-18",
        status: "pending",
        notes: [
            {
                id: "note1",
                reportId: "1",
                content: "Đã kiểm tra nội dung, cần xem xét kỹ phần cài đặt Next.js",
                createdBy: "Admin1",
                createdAt: "2023-05-19",
                isAdmin: true,
            },
            {
                id: "note2",
                reportId: "1",
                content: "Tôi đã thêm thông tin chi tiết về lỗi trong bài viết",
                createdBy: "User123",
                createdAt: "2023-05-19",
                isAdmin: false,
            },
        ],
    },
    {
        id: "2",
        postId: "2",
        postTitle: "Understanding React Hooks",
        reportedBy: "User456",
        reason: "Plagiarism",
        details: "This content appears to be copied from the official React documentation without attribution.",
        date: "2023-05-16",
        status: "accepted",
        notes: [],
    },
    {
        id: "3",
        postId: "1",
        postTitle: "Getting Started with Next.js",
        reportedBy: "User789",
        reason: "Inappropriate content",
        details: "This post contains inappropriate language in the code examples.",
        date: "2023-05-17",
        status: "pending",
        notes: [],
    },
    {
        id: "4",
        postId: "3",
        postTitle: "The Future of AI in Web Development",
        reportedBy: "User101",
        reason: "Spam",
        details: "This post contains multiple promotional links that are not relevant to the topic.",
        date: "2023-05-19",
        status: "rejected",
        notes: [],
    },
    {
        id: "5",
        postId: "4",
        postTitle: "CSS Grid vs Flexbox",
        reportedBy: "User202",
        reason: "Outdated information",
        details: "This post contains outdated information about browser support for CSS Grid.",
        date: "2023-05-20",
        status: "accepted",
        notes: [],
    },
    {
        id: "6",
        postId: "2",
        postTitle: "Understanding React Hooks",
        reportedBy: "User303",
        reason: "Misleading content",
        details: "The examples in this post do not follow React best practices.",
        date: "2023-05-21",
        status: "pending",
        notes: [],
    },
]

// Mock data for comment reports
const commentReports = [
    {
        id: "1",
        commentId: "1",
        commentContent:
            "This is a great article! I learned a lot about Next.js and how to get started with my first project.",
        postId: "1",
        postTitle: "Getting Started with Next.js",
        reportedBy: "User123",
        reason: "Spam",
        details: "This comment contains promotional links that are not relevant to the article.",
        date: "2023-05-18",
        status: "pending",
        notes: [
            {
                id: "note3",
                reportId: "1",
                content: "Bình luận này có chứa liên kết đến trang web bán hàng",
                createdBy: "Admin2",
                createdAt: "2023-05-19",
                isAdmin: true,
            },
        ],
    },
    {
        id: "2",
        commentId: "3",
        commentContent: "I was confused about hooks before, but your explanations really cleared things up for me!",
        postId: "2",
        postTitle: "Understanding React Hooks",
        reportedBy: "User456",
        reason: "Inappropriate language",
        details: "This comment contains offensive language that violates community guidelines.",
        date: "2023-05-16",
        status: "accepted",
        notes: [],
    },
    {
        id: "3",
        commentId: "5",
        commentContent: "Could you write a follow-up article about advanced hooks like useImperativeHandle?",
        postId: "2",
        postTitle: "Understanding React Hooks",
        reportedBy: "User789",
        reason: "Misleading information",
        details: "This comment contains factually incorrect information that could mislead readers.",
        date: "2023-05-17",
        status: "pending",
        notes: [],
    },
    {
        id: "4",
        commentId: "1",
        commentContent:
            "This is a great article! I learned a lot about Next.js and how to get started with my first project.",
        postId: "1",
        postTitle: "Getting Started with Next.js",
        reportedBy: "User101",
        reason: "Harassment",
        details: "This comment targets another user in a harassing manner.",
        date: "2023-05-19",
        status: "pending",
        notes: [],
    },
    {
        id: "5",
        commentId: "4",
        commentContent: "Interesting perspectives on AI. I wonder how this will affect the job market for developers.",
        postId: "3",
        postTitle: "The Future of AI in Web Development",
        reportedBy: "User202",
        reason: "Off-topic",
        details: "This comment is completely unrelated to the article topic.",
        date: "2023-05-20",
        status: "rejected",
        notes: [],
    },
    {
        id: "6",
        commentId: "2",
        commentContent: "Thanks for the detailed explanations. Could you elaborate more on the file-based routing system?",
        postId: "1",
        postTitle: "Getting Started with Next.js",
        reportedBy: "User303",
        reason: "Spam",
        details: "This comment appears to be automated spam.",
        date: "2023-05-21",
        status: "accepted",
        notes: [],
    },
]

// Mock data for posts
const posts = [
    { id: "1", title: "Getting Started with Next.js" },
    { id: "2", title: "Understanding React Hooks" },
    { id: "3", title: "The Future of AI in Web Development" },
    { id: "4", title: "CSS Grid vs Flexbox" },
    { id: "5", title: "Mobile-First Design Principles" },
]

// Mock data for comments
const comments = [
    {
        id: "1",
        content: "This is a great article! I learned a lot about Next.js and how to get started with my first project.",
        postId: "1",
    },
    {
        id: "2",
        content: "Thanks for the detailed explanations. Could you elaborate more on the file-based routing system?",
        postId: "1",
    },
    {
        id: "3",
        content: "I was confused about hooks before, but your explanations really cleared things up for me!",
        postId: "2",
    },
    {
        id: "4",
        content: "Interesting perspectives on AI. I wonder how this will affect the job market for developers.",
        postId: "3",
    },
    {
        id: "5",
        content: "Could you write a follow-up article about advanced hooks like useImperativeHandle?",
        postId: "2",
    },
]

// Mock current user
const currentUser = {
    id: "user1",
    name: "John Doe",
    isAdmin: true,
}

export default function ReportsPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = React.useState("posts")

    // State for post reports
    const [postStatusFilter, setPostStatusFilter] = React.useState("all")
    const [postSearchQuery, setPostSearchQuery] = React.useState("")
    const [selectedPostFilter, setSelectedPostFilter] = React.useState("")
    const [postCurrentPage, setPostCurrentPage] = React.useState(1)
    const [postPageSize, setPostPageSize] = React.useState("10")

    // State for comment reports
    const [commentStatusFilter, setCommentStatusFilter] = React.useState("all")
    const [commentSearchQuery, setCommentSearchQuery] = React.useState("")
    const [selectedCommentFilter, setSelectedCommentFilter] = React.useState("")
    const [selectedPostForComment, setSelectedPostForComment] = React.useState("")
    const [commentCurrentPage, setCommentCurrentPage] = React.useState(1)
    const [commentPageSize, setCommentPageSize] = React.useState("10")

    // Dialog state
    const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false)
    const [selectedReport, setSelectedReport] = React.useState<any>(null)
    const [filterSheetOpen, setFilterSheetOpen] = React.useState(false)

    // Thêm state cho ghi chú
    const [adminNote, setAdminNote] = React.useState("")
    const [userNote, setUserNote] = React.useState("")
    const [reportNotes, setReportNotes] = React.useState<Note[]>([])

    // Filter post reports
    const filteredPostReports = React.useMemo(() => {
        let filtered = [...postReports]

        // Filter by status
        if (postStatusFilter !== "all") {
            filtered = filtered.filter((report) => report.status === postStatusFilter)
        }

        // Filter by search query
        if (postSearchQuery) {
            filtered = filtered.filter(
                (report) =>
                    report.postTitle.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
                    report.reason.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
                    report.details.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
                    report.reportedBy.toLowerCase().includes(postSearchQuery.toLowerCase()),
            )
        }

        // Filter by specific post
        if (selectedPostFilter) {
            filtered = filtered.filter((report) => report.postId === selectedPostFilter)
        }

        return filtered
    }, [postStatusFilter, postSearchQuery, selectedPostFilter])

    // Filter comment reports
    const filteredCommentReports = React.useMemo(() => {
        let filtered = [...commentReports]

        // Filter by status
        if (commentStatusFilter !== "all") {
            filtered = filtered.filter((report) => report.status === commentStatusFilter)
        }

        // Filter by search query
        if (commentSearchQuery) {
            filtered = filtered.filter(
                (report) =>
                    report.commentContent.toLowerCase().includes(commentSearchQuery.toLowerCase()) ||
                    report.postTitle.toLowerCase().includes(commentSearchQuery.toLowerCase()) ||
                    report.reason.toLowerCase().includes(commentSearchQuery.toLowerCase()) ||
                    report.details.toLowerCase().includes(commentSearchQuery.toLowerCase()) ||
                    report.reportedBy.toLowerCase().includes(commentSearchQuery.toLowerCase()),
            )
        }

        // Filter by specific comment
        if (selectedCommentFilter) {
            filtered = filtered.filter((report) => report.commentId === selectedCommentFilter)
        }

        // Filter by specific post
        if (selectedPostForComment) {
            filtered = filtered.filter((report) => report.postId === selectedPostForComment)
        }

        return filtered
    }, [commentStatusFilter, commentSearchQuery, selectedCommentFilter, selectedPostForComment])

    const handleViewDetails = (report: any) => {
        setSelectedReport(report)
        setReportNotes(report.notes || [])
        setDetailsDialogOpen(true)
        setAdminNote("") // Reset admin note when opening details
        setUserNote("") // Reset user note when opening details
    }

    const handleReportAction = (reportId: string, type: string, action: "accept" | "reject") => {
        // In a real app, you would make an API call to update the report status
        console.log(`${action === "accept" ? "Accepting" : "Rejecting"} ${type} report ${reportId}`)
    }

    const handleDeleteContent = (report: any) => {
        // Trong thực tế, bạn sẽ gọi API để xóa bài viết hoặc bình luận
        const contentType = report.commentId ? "bình luận" : "bài viết"
        const contentId = report.commentId || report.postId

        if (confirm(`Bạn có chắc chắn muốn xóa ${contentType} này không?`)) {
            console.log(`Xóa ${contentType} với ID: ${contentId}`)
            // Sau khi xóa thành công, có thể cập nhật trạng thái báo cáo thành "accepted"
            alert(`Đã xóa ${contentType} thành công!`)
        }
    }

    const handleDeleteReport = (reportId: string) => {
        // Trong thực tế, bạn sẽ gọi API để xóa báo cáo
        if (confirm("Bạn có chắc chắn muốn xóa báo cáo này không?")) {
            console.log(`Xóa báo cáo với ID: ${reportId}`)
            alert("Đã xóa báo cáo thành công!")
            setDetailsDialogOpen(false)
        }
    }

    const handleAddNote = (isAdmin: boolean) => {
        if (!selectedReport) return

        const noteContent = isAdmin ? adminNote : userNote
        if (!noteContent.trim()) {
            alert("Vui lòng nhập nội dung ghi chú!")
            return
        }

        // Trong thực tế, bạn sẽ gọi API để lưu ghi chú
        const newNote: Note = {
            id: `note${Date.now()}`,
            reportId: selectedReport.id,
            content: noteContent,
            createdBy: currentUser.name,
            createdAt: new Date().toISOString().split("T")[0],
            isAdmin,
        }

        // Cập nhật danh sách ghi chú
        setReportNotes([...reportNotes, newNote])

        // Reset form
        if (isAdmin) {
            setAdminNote("")
        } else {
            setUserNote("")
        }

        alert("Đã thêm ghi chú thành công!")
    }

    const handleViewPost = (postId: string) => {
        navigate(`/posts/${postId}`)
    }

    const handleViewComment = (postId: string, commentId: string) => {
        navigate(`/posts/${postId}?highlight=${commentId}`)
    }

    const resetPostFilters = () => {
        setPostStatusFilter("all")
        setPostSearchQuery("")
        setSelectedPostFilter("")
    }

    const resetCommentFilters = () => {
        setCommentStatusFilter("all")
        setCommentSearchQuery("")
        setSelectedCommentFilter("")
        setSelectedPostForComment("")
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
                <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Advanced Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Advanced Filters</SheetTitle>
                            <SheetDescription>Customize filters to find reports more precisely.</SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                            {activeTab === "posts" ? (
                                <>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium">Filter by Post</h3>
                                        <Select value={selectedPostFilter} onValueChange={setSelectedPostFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Posts" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Posts</SelectItem>
                                                {posts.map((post) => (
                                                    <SelectItem key={post.id} value={post.id}>
                                                        {post.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium">Report Status</h3>
                                        <Select value={postStatusFilter} onValueChange={setPostStatusFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="accepted">Accepted</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button className="w-full" onClick={resetPostFilters}>
                                        Reset Filters
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium">Lọc theo bài viết</h3>
                                        <Select value={selectedPostForComment} onValueChange={setSelectedPostForComment}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tất cả bài viết" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả bài viết</SelectItem>
                                                {posts.map((post) => (
                                                    <SelectItem key={post.id} value={post.id}>
                                                        {post.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium">Lọc theo bình luận</h3>
                                        <Select value={selectedCommentFilter} onValueChange={setSelectedCommentFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tất cả bình luận" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả bình luận</SelectItem>
                                                {comments.map((comment) => (
                                                    <SelectItem key={comment.id} value={comment.id}>
                                                        {comment.content.substring(0, 30)}...
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium">Trạng thái báo cáo</h3>
                                        <Select value={commentStatusFilter} onValueChange={setCommentStatusFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tất cả trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                                <SelectItem value="pending">Chờ xử lý</SelectItem>
                                                <SelectItem value="accepted">Đã chấp nhận</SelectItem>
                                                <SelectItem value="rejected">Đã từ chối</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button className="w-full" onClick={resetCommentFilters}>
                                        Đặt lại bộ lọc
                                    </Button>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="posts">Post Reports</TabsTrigger>
                    <TabsTrigger value="comments">Comment Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="posts">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Post Reports</CardTitle>
                            <CardDescription>View and process reports about inappropriate post content.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex flex-1 items-center gap-2">
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search reports..."
                                            value={postSearchQuery}
                                            onChange={(e) => setPostSearchQuery(e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Status:</span>
                                        <Select value={postStatusFilter} onValueChange={setPostStatusFilter}>
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="All" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="accepted">Accepted</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Post</TableHead>
                                            <TableHead>Reason</TableHead>
                                            <TableHead className="hidden md:table-cell">Details</TableHead>
                                            <TableHead>Reported By</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPostReports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="font-medium">{report.id}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    <Button
                                                        variant="link"
                                                        className="p-0 h-auto font-normal text-left"
                                                        onClick={() => handleViewPost(report.postId)}
                                                    >
                                                        {report.postTitle}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>{report.reason}</TableCell>
                                                <TableCell className="hidden max-w-[250px] truncate md:table-cell">{report.details}</TableCell>
                                                <TableCell>{report.reportedBy}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            report.status === "accepted"
                                                                ? "default"
                                                                : report.status === "pending"
                                                                    ? "outline"
                                                                    : "secondary"
                                                        }
                                                    >
                                                        {report.status === "accepted"
                                                            ? "Accepted"
                                                            : report.status === "pending"
                                                                ? "Pending"
                                                                : "Rejected"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                Actions
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleViewDetails(report)}>
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleViewPost(report.postId)}>
                                                                View Post
                                                            </DropdownMenuItem>
                                                            {report.status === "pending" && (
                                                                <>
                                                                    <DropdownMenuItem onClick={() => handleReportAction(report.id, "post", "accept")}>
                                                                        <Check className="mr-2 h-4 w-4" />
                                                                        <span>Accept Report</span>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleReportAction(report.id, "post", "reject")}>
                                                                        <X className="mr-2 h-4 w-4" />
                                                                        <span>Reject Report</span>
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                            <DropdownMenuItem onClick={() => handleDeleteContent(report)} className="text-red-600">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                <span>Delete Post</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteReport(report.id)} className="text-red-600">
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                <span>Delete Report</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {filteredPostReports.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center">
                                                    No reports found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-muted-foreground">Items per page:</p>
                                        <Select value={postPageSize} onValueChange={setPostPageSize}>
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
                                            Showing {Math.min(filteredPostReports.length, Number.parseInt(postPageSize, 10))} /{" "}
                                            {filteredPostReports.length} results
                                        </p>
                                    </div>

                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious onClick={() => setPostCurrentPage(Math.max(postCurrentPage - 1, 1))} />
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
                                                <PaginationNext onClick={() => setPostCurrentPage(postCurrentPage + 1)} />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="comments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Comment Reports</CardTitle>
                            <CardDescription>View and process reports about inappropriate comments.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex flex-1 items-center gap-2">
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm kiếm báo cáo..."
                                            value={commentSearchQuery}
                                            onChange={(e) => setCommentSearchQuery(e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Trạng thái:</span>
                                        <Select value={commentStatusFilter} onValueChange={setCommentStatusFilter}>
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Tất cả" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả</SelectItem>
                                                <SelectItem value="pending">Chờ xử lý</SelectItem>
                                                <SelectItem value="accepted">Đã chấp nhận</SelectItem>
                                                <SelectItem value="rejected">Đã từ chối</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Comment</TableHead>
                                            <TableHead>Post</TableHead>
                                            <TableHead>Reason</TableHead>
                                            <TableHead className="hidden md:table-cell">Details</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCommentReports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="font-medium">{report.id}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    <Button
                                                        variant="link"
                                                        className="p-0 h-auto font-normal text-left"
                                                        onClick={() => handleViewComment(report.postId, report.commentId)}
                                                    >
                                                        {report.commentContent.substring(0, 30)}...
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="max-w-[150px] truncate">
                                                    <Button
                                                        variant="link"
                                                        className="p-0 h-auto font-normal text-left"
                                                        onClick={() => handleViewPost(report.postId)}
                                                    >
                                                        {report.postTitle}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>{report.reason}</TableCell>
                                                <TableCell className="hidden max-w-[200px] truncate md:table-cell">{report.details}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            report.status === "accepted"
                                                                ? "default"
                                                                : report.status === "pending"
                                                                    ? "outline"
                                                                    : "secondary"
                                                        }
                                                    >
                                                        {report.status === "accepted"
                                                            ? "Đã chấp nhận"
                                                            : report.status === "pending"
                                                                ? "Chờ xử lý"
                                                                : "Đã từ chối"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                Thao tác
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleViewDetails(report)}>
                                                                Xem chi tiết
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleViewComment(report.postId, report.commentId)}>
                                                                Xem bình luận
                                                            </DropdownMenuItem>
                                                            {report.status === "pending" && (
                                                                <>
                                                                    <DropdownMenuItem onClick={() => handleReportAction(report.id, "comment", "accept")}>
                                                                        <Check className="mr-2 h-4 w-4" />
                                                                        <span>Chấp nhận báo cáo</span>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleReportAction(report.id, "comment", "reject")}>
                                                                        <X className="mr-2 h-4 w-4" />
                                                                        <span>Từ chối báo cáo</span>
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                            <DropdownMenuItem onClick={() => handleDeleteContent(report)} className="text-red-600">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                <span>Xóa bình luận</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteReport(report.id)} className="text-red-600">
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                <span>Xóa báo cáo</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {filteredCommentReports.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center">
                                                    Không tìm thấy báo cáo nào
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-muted-foreground">Số mục mỗi trang:</p>
                                        <Select value={commentPageSize} onValueChange={setCommentPageSize}>
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
                                            Hiển thị {Math.min(filteredCommentReports.length, Number.parseInt(commentPageSize, 10))} /{" "}
                                            {filteredCommentReports.length} kết quả
                                        </p>
                                    </div>

                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => setCommentCurrentPage(Math.max(commentCurrentPage - 1, 1))}
                                                />
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
                                                <PaginationNext onClick={() => setCommentCurrentPage(commentCurrentPage + 1)} />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Report Details</DialogTitle>
                        <DialogDescription>View detailed information about this report.</DialogDescription>
                    </DialogHeader>
                    {selectedReport && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-1 font-medium">ID:</div>
                                <div className="col-span-3">{selectedReport.id}</div>

                                <div className="col-span-1 font-medium">Type:</div>
                                <div className="col-span-3">{selectedReport.commentId ? "Comment Report" : "Post Report"}</div>

                                {selectedReport.commentId ? (
                                    <>
                                        <div className="col-span-1 font-medium">Comment:</div>
                                        <div className="col-span-3">{selectedReport.commentContent}</div>
                                    </>
                                ) : null}

                                <div className="col-span-1 font-medium">Post:</div>
                                <div className="col-span-3">{selectedReport.postTitle}</div>

                                <div className="col-span-1 font-medium">Reason:</div>
                                <div className="col-span-3">{selectedReport.reason}</div>

                                <div className="col-span-1 font-medium">Details:</div>
                                <div className="col-span-3">{selectedReport.details}</div>

                                <div className="col-span-1 font-medium">Reported By:</div>
                                <div className="col-span-3">{selectedReport.reportedBy}</div>

                                <div className="col-span-1 font-medium">Report Date:</div>
                                <div className="col-span-3">{selectedReport.date}</div>

                                <div className="col-span-1 font-medium">Status:</div>
                                <div className="col-span-3">
                                    <Badge
                                        variant={
                                            selectedReport.status === "accepted"
                                                ? "default"
                                                : selectedReport.status === "pending"
                                                    ? "outline"
                                                    : "secondary"
                                        }
                                    >
                                        {selectedReport.status === "accepted"
                                            ? "Đã chấp nhận"
                                            : selectedReport.status === "pending"
                                                ? "Chờ xử lý"
                                                : "Đã từ chối"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Phần ghi chú */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Notes</h3>

                                {/* Danh sách ghi chú hiện có */}
                                {/* {reportNotes.length > 0 ? (
                  <div className="space-y-3">
                    {reportNotes.map((note) => (
                      <div key={note.id} className="rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{note.createdBy}</span>
                            {note.isAdmin && (
                              <Badge variant="outline" className="text-xs">
                                Admin
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{note.createdAt}</span>
                        </div>
                        <p className="mt-2 text-sm">{note.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes for this report yet.</p>
                )} */}

                                <Separator />

                                {/* Form thêm ghi chú mới */}
                                <div className="space-y-2">
                                    <Textarea
                                        id="admin-note"
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        placeholder="Enter admin note about this report..."
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        {selectedReport && selectedReport.status === "pending" && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        handleReportAction(selectedReport.id, selectedReport.commentId ? "comment" : "post", "reject")
                                        setDetailsDialogOpen(false)
                                    }}
                                >
                                    Reject
                                </Button>
                                <Button
                                    onClick={() => {
                                        handleReportAction(selectedReport.id, selectedReport.commentId ? "comment" : "post", "accept")
                                        setDetailsDialogOpen(false)
                                    }}
                                >
                                    Accept
                                </Button>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <Button variant="destructive" onClick={() => handleDeleteReport(selectedReport.id)}>
                                Delete Report
                            </Button>
                        </div>
                        <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
