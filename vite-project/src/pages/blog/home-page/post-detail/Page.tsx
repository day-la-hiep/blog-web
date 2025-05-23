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
import { fetchPublicDetailPost } from "@/service/PostApi"
import MarkdownIt from "markdown-it"
import hljs from "highlight.js"
import 'highlight.js/styles/atom-one-light.css';// Mock data for a single post
import { createComment, fetchCommentsByArticle } from "@/service/CommentApi"
import { useAuth } from "@/hooks/AuthProvider"
import { getUserSavedLists, addPostToSavedList, createSavedList } from "@/service/PostApi"
import { reportTarget } from "@/service/ReportApi"
const postData = {
    id: "1",
    title: "Getting Started with Next.js: A Comprehensive Guide",
    content: "",
    summary: "",
    name: "",
    author: "John Doe",
    authorUsername: "",
    // authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-05-15",
}

// Mock comments data
const md = new MarkdownIt({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    '</code></pre>';
            } catch (_) { }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
})

md.disable('list');
const mockComments = [
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
        createdAt: "2023-05-17",
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
        createdAt: "2023-05-18",
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
        createdAt: "2023-05-19",
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
    const auth = useAuth()

    const navigate = useNavigate()
    const { postId } = useParams()

    // State for post and comments
    const [post, setPost] = React.useState<{
        id: string,
        title: string,
        content: string,
        name: string,
        summary: string,
        date: string,
        author: string,

    }>(postData)
    const [comments, setComments] = React.useState<{
        id: string,
        content: string,
        author: string,
        createdAt: Date,
        authorUsername: string,
    }[]>([])
    const [newComment, setNewComment] = React.useState("")
    const [isSubmittingComment, setIsSubmittingComment] = React.useState(false)

    // State for report dialog
    const [reportDialogOpen, setReportDialogOpen] = React.useState(false)
    const [selectedComment, setSelectedComment] = React.useState<(typeof mockComments)[0] | null>(null)
    const [reportReason, setReportReason] = React.useState("")
    const [reportDetails, setReportDetails] = React.useState("")
    const [isSubmittingReport, setIsSubmittingReport] = React.useState(false)

    // State for save dialog
    const [saveDialogOpen, setSaveDialogOpen] = React.useState(false)
    const [selectedListId, setSelectedListId] = React.useState<string | null>(null)

    // State for save confirmation
    const [isSaving, setIsSaving] = React.useState(false)
    // State for user's saved lists and whether the current post is saved
    const [savedLists, setSavedLists] = React.useState<any[]>([])
    const [isPostSaved, setIsPostSaved] = React.useState(false)
    const [isLoadingSavedLists, setIsLoadingSavedLists] = React.useState(false)

    // State for create new saved list dialog
    const [createListDialogOpen, setCreateListDialogOpen] = React.useState(false)
    const [newListName, setNewListName] = React.useState("")
    const [isCreatingList, setIsCreatingList] = React.useState(false)

    // State cho dialog báo cáo bài viết
    const [reportArticleDialogOpen, setReportArticleDialogOpen] = React.useState(false)
    const [isSubmittingArticleReport, setIsSubmittingArticleReport] = React.useState(false)
    const [reportArticleReason, setReportArticleReason] = React.useState("")
    const [reportArticleDetails, setReportArticleDetails] = React.useState("")

    // In a real app, you would fetch the post and comments data based on the ID
    React.useEffect(() => {

        try {
            const action = async () => {
                const postRes = await fetchPublicDetailPost(postId)
                if (postRes) {
                    setPost(postRes)
                } else {
                    toast("Lỗi", {
                        description: "Không tìm thấy bài viết",
                    })
                    navigate("/blog/home")
                }

                const commentRes = await fetchCommentsByArticle(postId, {

                })

                if (postRes) {
                    setComments(commentRes.items.map((val) => ({
                        id: val.id,
                        content: val.content,
                        author: val.author,
                        createdAt: new Date(val.createdAt),
                        authorUsername: val.authorUsername
                    })))

                }

                // Fetch user's saved lists

                const savedListRes = await getUserSavedLists()
                if (savedListRes) {
                    setSavedLists(savedListRes.items)
                } else {
                    toast("Lỗi", {
                        description: "Không tìm thấy danh sách đã lưu",
                    })
                }

            }
            action()
        } catch (error) {
            toast("Lỗi", {
                description: "Không tìm thấy bài viết",
            })
            // navigate("/blog/home")
        }
        // Fetch post and comments data
        // For this example, we'll use the mock data
    }, [postId])

    const handleSubmitComment = async () => {
        setIsSubmittingComment(true)

        const res = await createComment(postId, newComment)
        if (res) {
            setComments((prevComments) => [
                {
                    id: res.id,
                    content: res.content,
                    createdAt: new Date(res.createdAt),
                    authorUsername: res.authorUsername,
                    author: res.author,
                },
                ...prevComments

            ])
        }

        setIsSubmittingComment(false)
        setNewComment("")
    }

    const handleReportComment = (comment) => {
        setSelectedComment(comment)
        setReportDialogOpen(true)
    }

    const handleSubmitReport = async () => {
        if (!reportReason) {
            toast("Lỗi", {
                description: "Vui lòng chọn lý do báo cáo",
            })
            return
        }

        setIsSubmittingReport(true)

        try {
            if (selectedComment) {
                await reportTarget({
                    reason: reportReason,
                    detail: reportDetails,
                    targetType: "COMMENT",
                    targetId: selectedComment.id,
                })
            }
            setIsSubmittingReport(false)
            setReportDialogOpen(false)
            setReportReason("")
            setReportDetails("")
            setSelectedComment(null)

            toast("Báo cáo đã được gửi", {
                description: "Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét nội dung này.",
            })
        } catch (error) {
            setIsSubmittingReport(false)
            toast("Lỗi", {
                description: "Không thể gửi báo cáo. Vui lòng thử lại sau.",
            })
        }
    }

    const handleSavePost = async () => {
        setIsSaving(true)

        // In a real app, you would make an API call to save/unsave the post
        if (!auth.token || auth.userInfo.role === 'GUEST') {
            toast("Lỗi", {
                description: "Vui lòng đăng nhập để lưu bài viết.",
            })
            setIsSaving(false)
            return
        }

        if (savedLists.length === 0) {
            toast("Thông báo", {
                description: "Bạn chưa có danh sách đã lưu nào. Vui lòng tạo một danh sách trước.",
            })
            setIsSaving(false)
            // Optionally, could prompt user to create a list here
            return
        }

        // For now, add to the first saved list found
        const targetListId = savedLists[0].id // Assuming list object has an 'id'

        try {
            // Assuming auth.token holds the user's token
            await addPostToSavedList(targetListId, postId as string, auth.token)
            setIsPostSaved(true)
            toast("Thành công", {
                description: "Bài viết đã được lưu.",
            })
        } catch (error) {
            console.error("Error saving post:", error)
            toast("Lỗi", {
                description: "Không thể lưu bài viết.",
            })
        } finally {
            setIsSaving(false)
        }

    }

    const handleViewAuthorProfile = (username: string) => {
        navigate(`/users/${username}`)
    }

    const handleCreateList = async () => {
        if (!newListName.trim()) {
            toast("Lỗi", { description: "Vui lòng nhập tên danh sách." })
            return
        }
        setIsCreatingList(true)
        try {
            const newList = await createSavedList(newListName)
            toast("Thành công", { description: "Đã tạo danh sách lưu mới." })
            setCreateListDialogOpen(false)
            setNewListName("")
            setSavedLists(prev => [...prev, newList])
        } catch (error) {
            toast("Lỗi", { description: "Không thể tạo danh sách." })
        } finally {
            setIsCreatingList(false)
        }
    }

    return (
        <>
            <Button onClick={() => {
                alert(JSON.stringify(post, null, 2))
            }}> click </Button>
            <main className="flex-1 flex flex-col items-center">
                <div className="container w-2/3 px-4 py-6 sm:px-6 gap-6 flex flex-col">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-3xl font-bold tracking-tight">Post Details</h2>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-3xl">{post.title}</CardTitle>

                                    </div>
                                    <CardDescription>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                <span>{comments.length} comments</span>
                                            </div>
                                        </div>
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2 self-start">
                                    <Button variant="outline" size="icon" onClick={() => setSaveDialogOpen(true)} disabled={!auth.token || auth.userInfo.role === 'GUEST'}>
                                        <BookmarkPlus className="h-5 w-5" />
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="cursor-pointer" variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setReportArticleDialogOpen(true)}>
                                                <Flag className="mr-2 h-4 w-4" />
                                                <span>Báo cáo bài viết</span>
                                            </DropdownMenuItem>
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
                                <Avatar className="h-10 w-10 cursor-pointer"
                                // onClick={() => handleViewAuthorProfile(post.authorUsername)}
                                >
                                    {/* <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} /> */}
                                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div
                                        className="font-medium cursor-pointer hover:underline"
                                    // onClick={() => handleViewAuthorProfile(post.authorUsername)}
                                    >
                                        {post.author}
                                    </div>
                                </div>
                            </div>

                            <div className="prose max-w-none" dangerouslySetInnerHTML={{
                                __html: md.render(post.content
                                )
                            }} />
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Comments ({comments.length})</h3>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex gap-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Current User" />
                                        {/* <AvatarFallback>CU</AvatarFallback> */}
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                        <Textarea
                                            placeholder="Write your comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                        <div className="flex justify-end">
                                            <form onSubmit={(e) => {
                                                e.preventDefault()
                                                handleSubmitComment()
                                            }}>
                                                <Button disabled={isSubmittingComment}>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    {isSubmittingComment ? "Sending..." : "Send Comment"}
                                                </Button>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {comments.map((comment) => (
                            <Card key={comment.id}>
                                <CardContent className="">
                                    <div className="flex gap-4">
                                        <Avatar className="h-10 w-10 cursor-pointer" onClick={() => handleViewAuthorProfile(comment.authorUsername)}>
                                            {/* <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} alt={comment.author} /> */}
                                            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div
                                                        className="font-medium cursor-pointer hover:underline"
                                                        onClick={() => handleViewAuthorProfile(comment.authorUsername)}
                                                    >
                                                        {comment.author}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{`${comment.createdAt.toLocaleDateString('vi-VN')}`}</div>
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
                                                        <DropdownMenuItem onClick={() => handleViewAuthorProfile(comment.authorUsername)}>
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

                    <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Lưu bài viết vào danh sách</DialogTitle>
                                <DialogDescription>Chọn danh sách để lưu bài viết này hoặc tạo mới.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {savedLists.length === 0 && <div className="text-muted-foreground text-sm">Bạn chưa có danh sách nào.</div>}
                                {savedLists.map((list: any) => (
                                    <div key={list.id} className="flex items-center justify-between border rounded px-3 py-2">
                                        <span>{list.name}</span>
                                        <Button size="sm" variant="outline" onClick={async () => {
                                            setIsSaving(true)
                                            try {
                                                await addPostToSavedList(list.id, postId as string, auth.token)
                                                setIsPostSaved(true)
                                                toast("Thành công", { description: `Đã lưu vào "${list.name}".` })
                                                setSaveDialogOpen(false)
                                            } catch {
                                                toast("Lỗi", { description: "Không thể lưu vào danh sách này." })
                                            } finally {
                                                setIsSaving(false)
                                            }
                                        }} disabled={isSaving || isPostSaved}>
                                            {isPostSaved ? <Check className="h-4 w-4" /> : "Lưu"}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-end mt-2">
                                <Button variant="secondary" size="sm" onClick={() => setCreateListDialogOpen(true)} disabled={isCreatingList || !auth.token || auth.userInfo.role === 'GUEST'}>
                                    + Tạo danh sách mới
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={createListDialogOpen} onOpenChange={setCreateListDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo danh sách lưu mới</DialogTitle>
                                <DialogDescription>Nhập tên danh sách lưu để tạo mới.</DialogDescription>
                            </DialogHeader>
                            <input
                                className="border rounded px-3 py-2 w-full"
                                placeholder="Tên danh sách..."
                                value={newListName}
                                onChange={e => setNewListName(e.target.value)}
                                disabled={isCreatingList}
                            />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setCreateListDialogOpen(false)} disabled={isCreatingList}>Hủy</Button>
                                <Button onClick={async () => {
                                    await handleCreateList()
                                }} disabled={isCreatingList || !newListName.trim()}>
                                    {isCreatingList ? "Đang tạo..." : "Tạo danh sách"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={reportArticleDialogOpen} onOpenChange={setReportArticleDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Báo cáo bài viết</DialogTitle>
                                <DialogDescription>Vui lòng chọn lý do báo cáo bài viết này. Báo cáo sẽ được gửi tới quản trị viên.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="font-medium">Lý do báo cáo</div>
                                    <RadioGroup value={reportArticleReason} onValueChange={setReportArticleReason}>
                                        {reportReasons.map((reason) => (
                                            <div key={reason.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={reason.id} id={"article-" + reason.id} />
                                                <Label htmlFor={"article-" + reason.id}>{reason.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="report-article-details">Chi tiết bổ sung (không bắt buộc)</Label>
                                    <Textarea
                                        id="report-article-details"
                                        placeholder="Vui lòng cung cấp thêm thông tin về báo cáo..."
                                        value={reportArticleDetails}
                                        onChange={e => setReportArticleDetails(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setReportArticleDialogOpen(false)} disabled={isSubmittingArticleReport}>Hủy</Button>
                                <Button onClick={async () => {
                                    if (!reportArticleReason) {
                                        toast("Lỗi", { description: "Vui lòng chọn lý do báo cáo" })
                                        return
                                    }
                                    setIsSubmittingArticleReport(true)
                                    try {
                                        await reportTarget({
                                            reason: reportArticleReason,
                                            detail: reportArticleDetails,
                                            targetType: "ARTICLE",
                                            targetId: postId as string,
                                        })
                                        setIsSubmittingArticleReport(false)
                                        setReportArticleDialogOpen(false)
                                        setReportArticleReason("")
                                        setReportArticleDetails("")
                                        toast("Báo cáo đã được gửi", { description: "Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét nội dung này." })
                                    } catch (error) {
                                        setIsSubmittingArticleReport(false)
                                        toast("Lỗi", { description: "Không thể gửi báo cáo. Vui lòng thử lại sau." })
                                    }
                                }} disabled={isSubmittingArticleReport}>
                                    {isSubmittingArticleReport ? "Đang gửi..." : "Gửi báo cáo"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
        </>
    )
}
