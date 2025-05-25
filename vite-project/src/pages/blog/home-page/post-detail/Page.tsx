"use client"

import { DialogFooter } from "@/components/ui/dialog"
import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  BookmarkPlus,
  Calendar,
  Check,
  Flag,
  MessageSquare,
  MoreHorizontal,
  Send,
  User,
  Edit,
  Trash2,
  Plus,
  Trophy,
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
import { fetchPublicDetailPost } from "@/service/PostApi"
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
import FilterBar from "../component/filter-bar"

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

export default function PostDetailPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { postId } = useParams()
  const [isLoading, setIsLoading] = React.useState(true)

  // State for post and comments
  const [post, setPost] = React.useState<any>()
  const [comments, setComments] = React.useState<any[]>([])
  const [newComment, setNewComment] = React.useState("")
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false)

  // State for report dialog
  const [reportDialogOpen, setReportDialogOpen] = React.useState(false)
  const [selectedComment, setSelectedComment] = React.useState<any>(null)
  const [reportReason, setReportReason] = React.useState("")
  const [reportDetails, setReportDetails] = React.useState("")
  const [isSubmittingReport, setIsSubmittingReport] = React.useState(false)

  // State for save dialog
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false)

  // State for save confirmation
  const [isSaving, setIsSaving] = React.useState(false)
  const [savedLists, setSavedLists] = React.useState<any[]>([])

  // State for create new saved list dialog
  const [createListDialogOpen, setCreateListDialogOpen] = React.useState(false)
  const [newListName, setNewListName] = React.useState("")
  const [isCreatingList, setIsCreatingList] = React.useState(false)

  // State cho dialog báo cáo bài viết
  const [reportArticleDialogOpen, setReportArticleDialogOpen] = React.useState(false)
  const [isSubmittingArticleReport, setIsSubmittingArticleReport] = React.useState(false)
  const [reportArticleReason, setReportArticleReason] = React.useState("")
  const [reportArticleDetails, setReportArticleDetails] = React.useState("")

  // State cho comment đang chỉnh sửa
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")

  React.useEffect(() => {
    setIsLoading(true)
    const action = async () => {
      try {
        const postRes = await fetchPublicDetailPost(postId as string)
        if (postRes) {
          setPost(postRes)
        } else {
            toast("Error", {
            description: "Post not found",
            })
          navigate("/blog/home")
        }
        const commentRes = await fetchCommentsByArticle(postId as string, {})
        if (commentRes) {
          setComments(
            commentRes.items.map((val) => ({
              id: val.id,
              content: val.content,
              author: val.author,
              createdAt: new Date(val.createdAt),
              authorUsername: val.authorUsername,
            })),
          )
        }
      } catch (error) {
        toast("Error", {
          description: "Post not found",
        })
      } finally {
        setIsLoading(false)
      }

    }
    action()
  }, [postId])

  const fetchSavedList = async () => {


    try {
      const savedListRes = await getUserSavedLists()

      const savedListByPostRes = await getSavedListByPostId(postId as string)

      setSavedLists(savedListRes.items.map((list: any) => ({
        ...list,
        isSaving: savedListByPostRes.items.some((item: any) => item.id === list.id),
      })))
    } catch (error) {
      toast("Error", { description: "Unable to load saved lists." })
      console.error("Error fetching saved list by post ID:", error)
    }
  }

  const handleSubmitComment = async () => {
    try {
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
          ...prevComments,
        ])
      }
      setIsSubmittingComment(false)
      setNewComment("")
    } catch (error) {
      toast("Error", {
        description: "Cant submit comment. Please try again later.",
      })
    } finally {
      setIsSubmittingComment(false)

    }

  }

  const handleReportComment = (comment) => {
    setSelectedComment(comment)
    setReportDialogOpen(true)
  }

  const handleSubmitReport = async () => {
    if (!reportReason) {
      toast("Error", {
        description: "Please select a reason for the report",
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

      toast("Report submitted", {
        description: "Thank you for reporting. We will review this content.",
      })
    } catch (error) {
      setIsSubmittingReport(false)
      toast("Error", {
        description: "Unable to send the report. Please try again later.",
      })
    }
  }

  const handleSavePost = async () => {
    setIsSaving(true)

    if (!auth.token || auth.userInfo.role === "GUEST") {
      toast("Error", {
        description: "Please sign in to save the post.",
      })
      setIsSaving(false)
      return
    }

    if (savedLists.length === 0) {
      toast("Notification", {
        description: "You don't have any saved lists yet. Please create one first.",
      })
      setIsSaving(false)
      return
    }

    const targetListId = savedLists[0].id

    try {
      await addPostToSavedList(targetListId, postId as string)
      toast("Success", {
        description: "The post has been saved.",
      })
    } catch (error) {
      console.error("Error saving post:", error)
      toast("Error", {
        description: "Unable to save the post.",
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
      toast("Error", { description: "Please enter a list name." })
      return
    }
    setIsCreatingList(true)
    try {
      const newList = await createSavedList(newListName)
      toast("Success", { description: "New save list created successfully." })
      setCreateListDialogOpen(false)
      setNewListName("")
      setSavedLists((prev) => [...prev, newList])
    } catch (error) {
      toast("Error", { description: "Unable to create the list." })
    } finally {
      setIsCreatingList(false)
    }
  }

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
        <Button variant="ghost" onClick={() => navigate(-1)} className="">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {/* Main Post Card */}
        <Card className="mb-8">
          <CardHeader className="space-y-6">
            {/* Post Title and Actions */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight leading-tight flex-1">{post.title}</h1>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={async () => {
                      if (!auth.token || auth.userInfo.role === "GUEST") {
                        toast("Error", {
                          description: "Please sign in to save the post.",
                        })
                        return
                      }
                      await fetchSavedList()
                      setSaveDialogOpen(true)
                    }}
                  >
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                  <Button
                    size={"icon"}
                    onClick={(e) => {
                      if (!auth.token || auth.userInfo.role === "GUEST") {
                        toast("Error", {
                          description: "Please sign in to report the post.",
                        })
                        return
                      }
                      e.stopPropagation()
                      setTimeout(() => {
                        setReportArticleDialogOpen(true)

                      }, 0)

                    }}>
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Post Meta */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.publishedDate).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                    <span>{comments.length} comments</span>
                </div>
              </div>
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

        {/* Comments Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Bình luận ({comments.length})</h2>
          </div>

          {/* Add Comment */}
          <Card>
            <CardContent className="pt-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault()

                  if (!auth.token || auth.userInfo.role === "GUEST") {
                    toast("Error", {
                      description: "Please sign in to comment.",
                    })
                    return
                  }
                  handleSubmitComment()
                }}
                className="space-y-4"
              >
                <Textarea
                  placeholder="Write your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmittingComment || !newComment.trim()}>
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmittingComment ? "Submmiting..." : "Submit Comment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Currently, there are no comments.</h3>
                  <p className="text-muted-foreground">Be the first to comment on this post.</p>
                </CardContent>
              </Card>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback>{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="font-medium">{comment.author}</div>
                            <div className="text-sm text-muted-foreground">
                              {comment.createdAt.toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                if (!auth.token || auth.userInfo.role === "GUEST") {
                                  toast("Error", {
                                    description: "Please sign in to report the comment.",
                                  })
                                  return
                                }
                                setTimeout(() => {
                                  handleReportComment(comment)
                                }, 0)
                              }}>
                                <Flag className="mr-2 h-4 w-4" />
                                Report
                              </DropdownMenuItem>
                              {auth.userInfo.username === comment.authorUsername && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditingCommentId(comment.id)
                                      setEditingContent(comment.content)
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={async () => {
                                      if (window.confirm("Are you sure you want to delete this comment?")) {
                                        try {
                                          await deleteComment(comment.id)
                                          setComments((prev) => prev.filter((c) => c.id !== comment.id))
                                          toast("Comment deleted.")
                                        } catch {
                                          toast("Error deleting comment.")
                                        }
                                      }
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div>
                          {editingCommentId === comment.id ? (
                            <div className="space-y-3">
                              <Textarea
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="min-h-[80px]"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                  try {
                                    await updateComment(comment.id, editingContent, auth.token)
                                    setComments((prev) =>
                                    prev.map((c) => (c.id === comment.id ? { ...c, content: editingContent } : c)),
                                    )
                                    setEditingCommentId(null)
                                    toast("Comment updated successfully.")
                                  } catch {
                                    toast("Error updating comment.")
                                  }
                                  }}
                                >
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingCommentId(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Report Comment Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report comment</DialogTitle>
            <DialogDescription>Please let us know the reason why you are reporting this comment.</DialogDescription>
          </DialogHeader>

          {selectedComment && (
            <div className="border rounded-lg p-4 bg-muted/50 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{selectedComment.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="font-medium text-sm">{selectedComment.author}</div>
              </div>
              <div className="text-sm text-muted-foreground">{selectedComment.content}</div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Reason</Label>
              <RadioGroup value={reportReason} onValueChange={setReportReason}>
                {reportReasons.map((reason) => (
                  <div key={reason.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason.id} id={reason.id} />
                    <Label htmlFor={reason.id} className="text-sm">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-details" className="text-sm font-medium">
                Additional details (optional)
              </Label>
              <Textarea
                id="report-details"
                placeholder="Please provide any additional information..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReport} disabled={isSubmittingReport}>
              {isSubmittingReport ? "Sending..." : "Send report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Post Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Post</DialogTitle>
            <DialogDescription>Select a list to save this post or create a new one.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {savedLists.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">Bạn chưa có danh sách nào.</div>
            ) : (
              savedLists.map((list: any) => (
                <div key={list.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{list.name}</span>
                  {
                    list.isSaving ? <>
                      <Button onClick={async () => {
                        try {
                          const res = await removePostFromSavedList(postId as string, list.id)
                          setSavedLists((prev) => prev.map((l) => (l.id === list.id ? { ...l, isSaving: false } : l)))
                          toast("Success", { description: `Post was removed from "${list.name}".` })
                        } catch (error) {
                          toast("Error", { description: "Unable to remove the post from this list." })
                        }
                      }}
                        size="sm" variant="outline">
                        <Check className="h-4 w-4" />
                      </Button>
                    </> : <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          setIsSaving(true)
                          try {
                            await addPostToSavedList(list.id, postId as string)
                            setSavedLists((prev) => prev.map((l) => (l.id === list.id ? { ...l, isSaving: true } : l)))
                            toast("Success", { description: `Saved to "${list.name}".` })
                          } catch {
                            toast("Error", { description: "Unable to save to this list." })
                          }
                        }}
                      >
                        {list.isSaving ? <Check className="h-4 w-4" /> : "Save"}
                      </Button>
                    </>
                  }

                </div>
              ))
            )}
          </div>

          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => setCreateListDialogOpen(true)}
              disabled={isCreatingList || !auth.token || auth.userInfo.role === "GUEST"}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create new list
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create List Dialog */}
      <Dialog open={createListDialogOpen} onOpenChange={setCreateListDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new list</DialogTitle>
            <DialogDescription>Enter a name for your new save list.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="List name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              disabled={isCreatingList}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateListDialogOpen(false)} disabled={isCreatingList}>
              Cancel
            </Button>
            <Button onClick={handleCreateList} disabled={isCreatingList || !newListName.trim()}>
              {isCreatingList ? "Creating list..." : "Create list"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Article Dialog */}
      <Dialog open={reportArticleDialogOpen} onOpenChange={setReportArticleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report post</DialogTitle>
            <DialogDescription>Please select the reason for reporting this post.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Report reason</Label>
              <RadioGroup value={reportArticleReason} onValueChange={setReportArticleReason}>
                {reportReasons.map((reason) => (
                  <div key={reason.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason.id} id={"article-" + reason.id} />
                    <Label htmlFor={"article-" + reason.id} className="text-sm">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-article-details" className="text-sm font-medium">
                Addition information (optional)
              </Label>
              <Textarea
                id="report-article-details"
                placeholder="Please provide more information..."
                value={reportArticleDetails}
                onChange={(e) => setReportArticleDetails(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportArticleDialogOpen(false)}
              disabled={isSubmittingArticleReport}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!reportArticleReason) {
                  toast("Error", { description: "Pleas select the report reason" })
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
                  toast("Report submitted", {
                    description: "Thank you for reporting. We will review this content.",
                  })
                } catch (error) {
                  setIsSubmittingArticleReport(false)
                  toast("Lỗi", { description: "Unable to send report. Please try again later." })
                }
              }}
              disabled={isSubmittingArticleReport}
            >
              {isSubmittingArticleReport ? "Sending..." : "Send report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  )
}
