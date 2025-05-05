
import * as React from "react"
import { ArrowDownZA, ArrowUp, Search, Trash } from "lucide-react"
import { useSearchParams } from "react-router-dom"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data
const comments = [
    {
        id: "1",
        author: "John Doe",
        postId: "1",
        postTitle: "Getting Started with Next.js",
        content: "This is a great article! I learned a lot about Next.js and how to get started with my first project.",
        date: "2023-05-16",
    },
    {
        id: "2",
        author: "Jane Smith",
        postId: "1",
        postTitle: "Getting Started with Next.js",
        content: "Thanks for the detailed explanations. Could you elaborate more on the file-based routing system?",
        date: "2023-05-17",
    },
    {
        id: "3",
        author: "Mike Johnson",
        postId: "2",
        postTitle: "Understanding React Hooks",
        content: "I was confused about hooks before, but your explanations really cleared things up for me!",
        date: "2023-05-15",
    },
    {
        id: "4",
        author: "Sarah Williams",
        postId: "3",
        postTitle: "The Future of AI in Web Development",
        content: "Interesting perspectives on AI. I wonder how this will affect the job market for developers.",
        date: "2023-05-21",
    },
    {
        id: "5",
        author: "David Lee",
        postId: "2",
        postTitle: "Understanding React Hooks",
        content: "Could you write a follow-up article about advanced hooks like useImperativeHandle?",
        date: "2023-05-16",
    },
]

const posts = [
    { id: "1", title: "Getting Started with Next.js" },
    { id: "2", title: "Understanding React Hooks" },
    { id: "3", title: "The Future of AI in Web Development" },
    { id: "4", title: "CSS Grid vs Flexbox" },
    { id: "5", title: "Mobile-First Design Principles" },
]

export default function CommentsPage() {
    const [params] = useSearchParams()
    const postId = params.get("postId")

    const [searchQuery, setSearchQuery] = React.useState("")
    const [startDate, setStartDate] = React.useState("")
    const [endDate, setEndDate] = React.useState("")
    const [selectedPost, setSelectedPost] = React.useState(postId || "")
    const [pageSize, setPageSize] = React.useState("10")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
    const [selectedCommentId, setSelectedCommentId] = React.useState<string | null>(null)

    // Filter comments based on filters
    const filteredComments = React.useMemo(() => {
        let filtered = [...comments]

        // Filter by post
        if (selectedPost) {
            filtered = filtered.filter((comment) => comment.postId === selectedPost)
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (comment) =>
                    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    comment.author.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        // Filter by date range
        if (startDate) {
            filtered = filtered.filter((comment) => comment.date >= startDate)
        }

        if (endDate) {
            filtered = filtered.filter((comment) => comment.date <= endDate)
        }

        return filtered
    }, [selectedPost, searchQuery, startDate, endDate])

    const handleDeleteClick = (id: string) => {
        setSelectedCommentId(id)
        setDeleteConfirmOpen(true)
    }

    const handleDeleteConfirm = () => {
        // In a real app, you would make an API call to delete the comment
        console.log(`Deleting comment ${selectedCommentId}`)
        setDeleteConfirmOpen(false)
        setSelectedCommentId(null)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Comments</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Comment Management</CardTitle>
                    <CardDescription>View and manage comments across all posts or filter by specific post.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex flex-1 items-center gap-2">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search comments..."
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
                                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-auto" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm">Filter by post:</span>
                            <Select value={selectedPost} onValueChange={setSelectedPost}>
                                <SelectTrigger className="w-[300px]">
                                    <SelectValue placeholder="All posts" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All posts</SelectItem>
                                    {posts.map((post) => (
                                        <SelectItem key={post.id} value={post.id}>
                                            {post.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <span className="inline-flex items-center gap-1">
                                            ID <Button className="!p-0 hover:bg-transparent" variant={"ghost"}><ArrowUp size={15}/></Button>
                                        </span>
                                    </TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Post</TableHead>
                                    <TableHead className="hidden md:table-cell">Content</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredComments.map((comment) => (
                                    <TableRow key={comment.id}>
                                        <TableCell className="font-medium">{comment.id}</TableCell>
                                        <TableCell>{comment.author}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{comment.postTitle}</TableCell>
                                        <TableCell className="hidden max-w-[300px] truncate md:table-cell">{comment.content}</TableCell>
                                        <TableCell>{comment.date}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(comment.id)}>
                                                <Trash className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
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
                                    Showing {Math.min(filteredComments.length, Number.parseInt(pageSize, 10))} of{" "}
                                    {filteredComments.length} results
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

            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this comment? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
