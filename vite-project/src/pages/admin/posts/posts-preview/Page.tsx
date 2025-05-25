"use client"

import { DialogFooter } from "@/components/ui/dialog"
import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
    ArrowLeft,
    BookmarkPlus,
    Calendar,
    Flag,

} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { fetchDetailPost, fetchPublicDetailPost } from "@/service/PostApi"
import MarkdownIt from "markdown-it"
import hljs from "highlight.js"
import "highlight.js/styles/atom-one-light.css"
import { createComment, fetchCommentsByArticle, updateComment, deleteComment } from "@/service/CommentApi"
import { useAuth } from "@/hooks/AuthProvider"
import { getUserSavedLists, addPostToSavedList, createSavedList, getSavedListByPostId, removeArticleFromSavedListByPostId as removePostFromSavedList } from "@/service/SavedListApi"
import { reportTarget } from "@/service/ReportApi"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { fetchPublicCategories } from "@/service/CategoryApi"

const md = new MarkdownIt({
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return (
                    '<pre class="hljs"><code>' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    "</code></pre>"
                )
            } catch (_) { }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    },
})

md.disable("list")

const reportReasons = [
    { id: "spam", label: "Spam hoặc quảng cáo" },
    { id: "inappropriate", label: "Nội dung không phù hợp" },
    { id: "harassment", label: "Quấy rối hoặc bắt nạt" },
    { id: "misinformation", label: "Thông tin sai lệch" },
    { id: "other", label: "Lý do khác" },
]

export default function PostPreview() {
    const auth = useAuth()
    const navigate = useNavigate()
    const { postId } = useParams()
    const [isLoading, setIsLoading] = React.useState(true)
    const [post, setPost] = React.useState<any>(null)
    const [categories, setCategories] = React.useState<any[]>([])



    React.useEffect(() => {
        setIsLoading(true)
        const action = async () => {
            try {
                const postRes = await fetchDetailPost(postId as string)
                if (postRes) {
                    setPost(postRes)
                } else {
                    toast("Lỗi", {
                        description: "Không tìm thấy bài viết",
                    })
                    navigate("/blog/home")
                }
                const res = await fetchPublicCategories()
                setCategories(res.items)
            } catch (error) {
                toast("Lỗi", {
                    description: "Không tìm thấy bài viết",
                })
            } finally {
                setIsLoading(false)
            }

        }
        action()
    }, [postId])



    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-muted-foreground">Đang tải bài viết...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-4xl p-4 space-y-4">
                {/* Header */}
                {/* Main Post Card */}
                <Card className="mb-8">
                    <CardHeader className="space-y-6">
                        {/* Post Title and Actions */}
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-3xl font-bold tracking-tight leading-tight flex-1">{post.title}</h1>
                            </div>

                            {/* Post Meta */}
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    Date created:
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(post.dateCreated).toLocaleDateString("vi-VN")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    Last updated:
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(post.lastUpdated).toLocaleDateString("vi-VN")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    Publish date:
                                    <Calendar className="h-4 w-4" />
                                    <span>{post.publishedDate ? new Date(post.publishedDate).toLocaleDateString("vi-VN") : "Unpublished"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Label className="font-semibold">
                                    Summary:
                                </Label>
                                <div>
                                    {post.summary}

                                </div>


                            </div>
                            <div className="space-x-2 flex items-center">
                                <Badge className={
                                    post.approvedStatus === 'ACCEPTED' ? 'bg-green-500 text-white' :
                                        post.approvedStatus === 'REJECTED' ? 'bg-red-500 text-white' :
                                            post.approvedStatus === 'NONE' ? 'bg-gray-400 text-white' :
                                                'bg-blue-500 text-white' // mặc định
                                }>
                                    {post.approvedStatus}
                                </Badge>
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
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.filter(category =>
                                post.categoryIds.includes(category.id)
                            ).map(category => (
                                <Badge key={category.id} variant="secondary" className="flex items-center gap-1">
                                    {category.name}
                                </Badge>
                            ))}
                        </div>



                        <Separator />

                        {/* Author Info */}
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="text-lg font-medium">{post.author.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium text-base">{post.author}</div>
                                <div className="text-sm text-muted-foreground">Tác giả</div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div
                            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-m-20 prose-headings:tracking-tight prose-h1:text-4xl prose-h1:font-extrabold prose-h2:text-3xl prose-h2:font-semibold prose-h3:text-2xl prose-h3:font-semibold prose-h4:text-xl prose-h4:font-semibold prose-p:leading-7 prose-a:font-medium prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-pre:overflow-x-auto prose-ol:my-6 prose-ol:ml-6 prose-ol:list-decimal prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc prose-li:mt-2"
                            dangerouslySetInnerHTML={{
                                __html: md.render(post.content),
                            }}
                        />
                    </CardContent>
                </Card>

            </div>
        </div >
    )
}
