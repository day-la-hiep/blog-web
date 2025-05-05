"use client"

import { DialogFooter } from "@/components/ui/dialog"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
    ArrowLeft,
    BookmarkPlus,
    Calendar,
    Check,
    Eye,
    Flag,
    MessageSquare,
    MoreHorizontal,
    Send,
    User,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useParams } from "react-router-dom"

// Mock data for a single post
const postData = {
    id: "1",
    title: "Getting Started with Next.js: A Comprehensive Guide",
    content: `
  <div class="prose max-w-none">
    <p>Next.js has emerged as one of the most popular React frameworks for building modern web applications. It provides a robust set of features that make development easier and more efficient.</p>
    
    <h2>Why Choose Next.js?</h2>
    <p>Next.js offers several advantages over traditional React applications:</p>
    <ul>
      <li><strong>Server-side rendering (SSR)</strong>: Improves performance and SEO</li>
      <li><strong>Static site generation (SSG)</strong>: Pre-renders pages at build time</li>
      <li><strong>Incremental Static Regeneration (ISR)</strong>: Updates static content after deployment</li>
      <li><strong>API Routes</strong>: Build API endpoints as part of your Next.js application</li>
      <li><strong>File-based routing</strong>: Simplified routing based on your file structure</li>
    </ul>
    
    <h2>Getting Started</h2>
    <p>To create a new Next.js application, you can use the following command:</p>
    <pre><code>npx create-next-app@latest my-next-app</code></pre>
    
    <p>This will set up a new Next.js project with all the necessary configurations. Once the installation is complete, you can navigate to your project directory and start the development server:</p>
    <pre><code>cd my-next-app
npm run dev</code></pre>
    
    <h2>File-Based Routing</h2>
    <p>Next.js uses a file-based routing system. Pages are associated with a route based on their file name. For example:</p>
    <ul>
      <li><code>pages/index.js</code> → <code>/</code></li>
      <li><code>pages/about.js</code> → <code>/about</code></li>
      <li><code>pages/blog/[slug].js</code> → <code>/blog/:slug</code></li>
    </ul>
    
    <h2>Data Fetching</h2>
    <p>Next.js provides several methods for fetching data:</p>
    <ul>
      <li><strong>getStaticProps</strong>: Fetch data at build time</li>
      <li><strong>getStaticPaths</strong>: Specify dynamic routes to pre-render</li>
      <li><strong>getServerSideProps</strong>: Fetch data on each request</li>
    </ul>
    
    <h2>Conclusion</h2>
    <p>Next.js simplifies React development by providing built-in features for routing, data fetching, and rendering. It's an excellent choice for building modern web applications that require good performance and SEO.</p>
  </div>
  `,
    author: "John Doe",
    authorId: "user1",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-05-15",
    readTime: "8 min",
    category: "Programming",
    tags: ["Next.js", "React", "Web Development"],
    views: 1245,
    likes: 87,
    status: "published",
    isSaved: false,
}

// Mock comments data
const commentsData = [
    {
        id: "1",
        author: "Jane Smith",
        authorId: "user2",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        content:
            "This is a great introduction to Next.js! I've been using it for a few months now and it's been a game-changer for my projects.",
        date: "2023-05-16",
        likes: 12,
        isLiked: false,
    },
    {
        id: "2",
        author: "Mike Johnson",
        authorId: "user3",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        content:
            "Thanks for the detailed explanations. Could you elaborate more on the file-based routing system? I'm still a bit confused about how dynamic routes work.",
        date: "2023-05-17",
        likes: 5,
        isLiked: true,
    },
    {
        id: "3",
        author: "Sarah Williams",
        authorId: "user4",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        content:
            "I was confused about the difference between getStaticProps and getServerSideProps, but your explanation cleared it up. Great article!",
        date: "2023-05-18",
        likes: 8,
        isLiked: false,
    },
    {
        id: "4",
        author: "David Lee",
        authorId: "user5",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        content:
            "I've been using Create React App for a while, but I'm considering switching to Next.js after reading this. The built-in features seem really useful.",
        date: "2023-05-19",
        likes: 3,
        isLiked: false,
    },
]

// Report reasons
const reportReasons = [
    { id: "spam", label: "Spam hoặc quảng cáo" },
    { id: "inappropriate", label: "Nội dung không phù hợp" },
    { id: "harassment", label: "Quấy rối hoặc bắt nạt" },
    { id: "misinformation", label: "Thông tin sai lệch" },
    { id: "other", label: "Lý do khác" },
]

export default function PostDetailPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const postId = id

    // State for post and comments
    const [post, setPost] = React.useState(postData)
    const [comments, setComments] = React.useState(commentsData)
    const [newComment, setNewComment] = React.useState("")
    const [isSubmittingComment, setIsSubmittingComment] = React.useState(false)

    // State for report dialog
    const [reportDialogOpen, setReportDialogOpen] = React.useState(false)
    const [selectedComment, setSelectedComment] = React.useState<(typeof commentsData)[0] | null>(null)
    const [reportReason, setReportReason] = React.useState("")
    const [reportDetails, setReportDetails] = React.useState("")
    const [isSubmittingReport, setIsSubmittingReport] = React.useState(false)

    // State for save confirmation
    const [isSaving, setIsSaving] = React.useState(false)

    // In a real app, you would fetch the post and comments data based on the ID
    React.useEffect(() => {
        // Fetch post and comments data
        // For this example, we'll use the mock data
    }, [postId])

    const handleSubmitComment = () => {
        if (!newComment.trim()) {
            toast("Lỗi", {
                description: "Vui lòng nhập nội dung bình luận",
            })
            return
        }

        setIsSubmittingComment(true)

        // In a real app, you would make an API call to submit the comment
        setTimeout(() => {
            const newCommentObj = {
                id: `new-${Date.now()}`,
                author: "Current User",
                authorId: "currentUser",
                authorAvatar: "/placeholder.svg?height=40&width=40",
                content: newComment,
                date: new Date().toISOString().split("T")[0],
                likes: 0,
                isLiked: false,
            }

            setComments([newCommentObj, ...comments])
            setNewComment("")
            setIsSubmittingComment(false)

            toast("Thành công", {
                description: "Bình luận của bạn đã được đăng",
            })
        }, 1000)
    }

    const handleReportComment = (comment: (typeof commentsData)[0]) => {
        setSelectedComment(comment)
        setReportDialogOpen(true)
    }

    const handleSubmitReport = () => {
        if (!reportReason) {
            toast("Lỗi", {
                description: "Vui lòng chọn lý do báo cáo",
            })
            return
        }

        setIsSubmittingReport(true)

        // In a real app, you would make an API call to submit the report
        setTimeout(() => {
            setIsSubmittingReport(false)
            setReportDialogOpen(false)
            setReportReason("")
            setReportDetails("")
            setSelectedComment(null)

            toast("Báo cáo đã được gửi", {
                description: "Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét nội dung này.",
            })
        }, 1000)
    }

    const handleSavePost = () => {
        setIsSaving(true)

        // In a real app, you would make an API call to save/unsave the post
        setTimeout(() => {
            setPost({ ...post, isSaved: !post.isSaved })
            setIsSaving(false)

            toast(post.isSaved ? "Đã bỏ lưu bài viết" : "Đã lưu bài viết",
                {
                    description: post.isSaved
                        ? "Bài viết đã được xóa khỏi danh sách đã lưu"
                        : "Bài viết đã được thêm vào danh sách đã lưu",
                })
        }, 500)
    }

    const handleViewAuthorProfile = (username: string) => {
        navigate(`/users/${username}`)
    }

    return (
        <main className="flex-1 flex flex-col items-center">
            <div className="container w-full px-4 py-6 sm:px-6 gap-6 flex flex-col">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">Post Details</h2>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    {post.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                <CardTitle className="text-3xl">{post.title}</CardTitle>
                                <CardDescription>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{post.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                            <span>{post.views} views</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                            <span>{comments.length} comments</span>
                                        </div>
                                    </div>
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={handleSavePost} disabled={isSaving}>
                                    {post.isSaved ? <Check className="mr-2 h-4 w-4" /> : <BookmarkPlus className="mr-2 h-4 w-4" />}
                                    {post.isSaved ? "Saved" : "Save Post"}
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Flag className="mr-2 h-4 w-4" />
                                            <span>Report Post</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => navigate(`/dashboard/posts/edit/${post.id}`)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            <span>Edit Post</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar className="h-10 w-10 cursor-pointer" onClick={() => handleViewAuthorProfile(post.authorId)}>
                                <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div
                                    className="font-medium cursor-pointer hover:underline"
                                    onClick={() => handleViewAuthorProfile(post.authorId)}
                                >
                                    {post.author}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {post.readTime} đọc • {post.category}
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleSavePost} disabled={isSaving}>
                                {post.isSaved ? <Check className="mr-2 h-4 w-4" /> : <BookmarkPlus className="mr-2 h-4 w-4" />}
                                {post.isSaved ? "Đã lưu" : "Lưu bài viết"}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold">Comments ({comments.length})</h3>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Current User" />
                                    <AvatarFallback>CU</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <Textarea
                                        placeholder="Write your comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                    <div className="flex justify-end">
                                        <Button onClick={handleSubmitComment} disabled={isSubmittingComment}>
                                            <Send className="mr-2 h-4 w-4" />
                                            {isSubmittingComment ? "Sending..." : "Send Comment"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {comments.map((comment) => (
                        <Card key={comment.id}>
                            <CardContent className="pt-6">
                                <div className="flex gap-4">
                                    <Avatar className="h-10 w-10 cursor-pointer" onClick={() => handleViewAuthorProfile(comment.authorId)}>
                                        <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} alt={comment.author} />
                                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div
                                                    className="font-medium cursor-pointer hover:underline"
                                                    onClick={() => handleViewAuthorProfile(comment.authorId)}
                                                >
                                                    {comment.author}
                                                </div>
                                                <div className="text-sm text-muted-foreground">{comment.date}</div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleReportComment(comment)}>
                                                        <Flag className="mr-2 h-4 w-4" />
                                                        <span>Báo cáo bình luận</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleViewAuthorProfile(comment.authorId)}>
                                                        <User className="mr-2 h-4 w-4" />
                                                        <span>Xem hồ sơ</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="mt-2">{comment.content}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Report Comment</DialogTitle>
                            <DialogDescription>
                                Please let us know why you're reporting this comment. Your report will be sent to administrators for
                                review.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedComment && (
                            <div className="border rounded-md p-4 bg-muted/50 mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={selectedComment.authorAvatar || "/placeholder.svg"} alt={selectedComment.author} />
                                        <AvatarFallback>{selectedComment.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium">{selectedComment.author}</div>
                                </div>
                                <div className="text-sm">{selectedComment.content}</div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="font-medium">Report Reason</div>
                                <RadioGroup value={reportReason} onValueChange={setReportReason}>
                                    {reportReasons.map((reason) => (
                                        <div key={reason.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={reason.id} id={reason.id} />
                                            <Label htmlFor={reason.id}>{reason.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="report-details">Additional Details (optional)</Label>
                                <Textarea
                                    id="report-details"
                                    placeholder="Please provide more information about your report..."
                                    value={reportDetails}
                                    onChange={(e) => setReportDetails(e.target.value)}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmitReport} disabled={isSubmittingReport}>
                                {isSubmittingReport ? "Sending..." : "Submit Report"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </main>
    )
}
