
import * as React from "react"
import { ArrowDownIcon, ArrowDownUp, ArrowDownZA, ArrowUp, ArrowUpIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Search, Trash } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
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
import { deleteComment, fetchComments } from "@/service/CommentApi"
import { toast } from "sonner"
import { useEffect } from "react"
import { DatePicker } from "@/components/ui/DatePicker"

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
    const navigate = useNavigate()
    const postId = params.get("postId")
    const [isLoading, setIsLoading] = React.useState(true)

    const [searchQuery, setSearchQuery] = React.useState("")
    const [startDate, setStartDate] = React.useState()
    const [endDate, setEndDate] = React.useState()
    const [pageLimit, setPageLimit] = React.useState(10)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
    const [selectedCommentId, setSelectedCommentId] = React.useState<string | null>(null)
    const [sortBy, setSortBy] = React.useState('id');

    const [filteredComments, setFilteredComments] = React.useState<any[]>(comments)
    // Filter comments based on filters
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        updateComments()
        return () => {
            controller.abort(); // Cleanup the fetch request on component unmount
        }
    }, [searchQuery, startDate, endDate, pageLimit, currentPage, sortBy])
    const updateComments = async () => {
        try {
            const res = await fetchComments({
                page: currentPage,
                limit: pageLimit,
                search: searchQuery,
                startDate: startDate,
                endDate: endDate,
                sortBy: sortBy
            })
            setFilteredComments(res.items)
            totalPages.current = res.totalPages
            totalItems.current = res.totalItems
            currentPageInputRef.current.value = res.page + 1 + ""
            if (res.page >= totalPages.current && totalPages.current > 0) {
                setCurrentPage(Math.max(0, totalPages.current - 1))
            }
        } catch (error) {
            toast("Error fetching comments", {
                description: "There was an error fetching the comments. Please try again later.",
            })
        } finally {
        }
    }

    const handleDeleteClick = (id: string) => {
        setSelectedCommentId(id)
        setDeleteConfirmOpen(true)
    }
    // pagination logic
    const totalPages = React.useRef(0)
    const totalItems = React.useRef(0)
    const currentPageInputRef = React.useRef<HTMLInputElement>()
    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteComment(selectedCommentId!)
            updateComments()
            toast.success("Comment deleted successfully")
        } catch (error) {
            toast.error("Error deleting comment", {
                description: "There was an error deleting the comment. Please try again later.",
            })
        } finally {
            setDeleteConfirmOpen(false)
            setSelectedCommentId(null)
        }


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
                        <Table>
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
                                            Author
                                            {getSortIcon('author')}
                                        </span>
                                    </TableHead>
                                    <TableHead>

                                        <span className="inline-flex items-center gap-1">
                                            Post
                                            {getSortIcon('parentArticle.title')}
                                        </span>
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">Content</TableHead>
                                    <TableHead>
                                        <span className="inline-flex items-center gap-1">
                                            Date
                                            {getSortIcon('createdAt')}
                                        </span>
                                    </TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            {
                                <>
                                    <TableBody>
                                        {filteredComments.map((comment) => (
                                            <TableRow key={comment.id}>
                                                <TableCell className="font-medium max-w-[50px] truncate cursor-text select-text" title={comment.id}>{comment.id}</TableCell>
                                                <TableCell>{comment.author}</TableCell>
                                                <TableCell className="max-w-[200px] truncate" title={comment.articleTitle}>{comment.articleTitle}</TableCell>
                                                <TableCell className="hidden max-w-[300px] truncate md:table-cell"
                                                    title={comment.content}>{comment.content}</TableCell>
                                                <TableCell>{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(comment.id)}>
                                                        <Trash className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                    <Button variant={"ghost"} size="sm" onClick={() => {
                                                        navigate(`/admin/posts?search=${comment.articleId}`)
                                                    }} >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </>
                            }

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
                                    Showing {Math.min(filteredComments.length, pageLimit)} of{" "}
                                    {totalItems.current} results
                                </p>
                            </div>

                            <div className="flex items-center gap-">
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
