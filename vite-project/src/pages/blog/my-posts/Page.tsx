"use client"

import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
// import { useRouter } from "next/navigation"
import { Bell, BookOpen, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit3, Eye, LogOut, Menu, Pencil, Search, Trash, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { deletePost, fetchPostsByUsername, importArticleContent } from "@/service/PostApi"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
const myPosts = [
    {
        id: "1",
        title: "Getting Started with Next.js",
        summary: "Learn the basics of Next.js and how to get started with your first project.",
        date: "2023-05-15",
        readTime: "5 min",
        status: "published",
        thumbnail: "/placeholder.svg?height=200&width=400",
    },
    {
        id: "2",
        title: "Understanding React Hooks",
        summary: "A deep dive into React Hooks and how they can simplify your code.",
        date: "2023-05-10",
        readTime: "7 min",
        status: "published",
        thumbnail: "/placeholder.svg?height=200&width=400",
    },
    {
        id: "3",
        title: "The Future of AI in Web Development",
        summary: "Exploring how AI is changing the landscape of web development.",
        date: "2023-05-20",
        readTime: "10 min",
        status: "draft",
        thumbnail: "/placeholder.svg?height=200&width=400",
    },
    {
        id: "4",
        title: "CSS Grid vs Flexbox",
        summary: "A comparison of CSS Grid and Flexbox for modern layouts.",
        date: "2023-05-18",
        readTime: "6 min",
        status: "pending",
        thumbnail: "/placeholder.svg?height=200&width=400",
    },
    {
        id: "5",
        title: "Mobile-First Design Principles",
        summary: "Best practices for implementing mobile-first design in your projects.",
        date: "2023-05-12",
        readTime: "8 min",
        status: "published",
        thumbnail: "/placeholder.svg?height=200&width=400",
    },
]
export default function MyPostsPage() {
    const totalPages = useRef(0)
    const [currentPage, setCurrentPage] = React.useState(0)
    const postToDelete = useRef({
        id: "",
        name: ""
    })
    const navigate = useNavigate()
    const [status, setStatus] = React.useState("ALL")
    const [approvedStatus, setApprovedStatus] = React.useState("ALL")
    const [pageDisplayValue, setPageDisplayValue] = React.useState("")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [selectedPost, setSelectedPost] = React.useState()
    const [posts, setPosts] = React.useState<{
        id: string,
        name: string,
        title: string
        summary: string
        date: string
        status: string
        thumbnailUrl: string
        approvedStatus: string
        lastUpdated: string
        categories: string[],
        dateCreated: string
    }[]>([])
    // Filter posts based on active tab
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        updatePost()
        return () => {
            controller.abort(); // Dừng request cũ
        };
    }, [status, currentPage, searchQuery, status, approvedStatus])
    const updatePost = async () => {
        const res = await fetchPostsByUsername('me', {
            search: searchQuery,
            page: currentPage,
            limit: 8,
            status: status === "ALL" ? undefined : status,
            approvedStatus: approvedStatus === "ALL" ? undefined : approvedStatus,
        })
        if (res) {
            setPosts(res.items)
            setPageDisplayValue((currentPage + 1).toString())
        } else {
            toast.error('Failed to fetch posts')
        }
        totalPages.current = res.totalPages
    }

    const handlePostClick = (id: string) => {
        navigate(`/edit-posts/${id}`)
    }

    const handleViewPost = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        // router.push(`/edit-post/${id}`)
        navigate(`/posts/${id}`)
    }

    const handleDeleteClick = (e: React.MouseEvent, post) => {
        e.stopPropagation()
        postToDelete.current = {
            id: post.id,
            name: post.name
        }

        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            await deletePost(postToDelete.current.id)
            toast.success('Post deleted successfully')
            setPosts(posts.filter(post => post.id !== postToDelete.current.id))
        } catch (error) {
            toast.error(error.message)
        }

        setDeleteDialogOpen(false)
    }


    const commitEdit = () => {
        const num = Number(pageDisplayValue)
        if (isNaN(num) || num < 1 || num > totalPages.current) {
            setPageDisplayValue((currentPage + 1).toString())
        }

    }
    return (<>
        <div className="flex-1 w-full">
            <main className="flex-1 flex flex-col items-center">
                <div className=" w-3/4 flex flex-col gap-3 px-4 py-6 sm:px-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold">My Posts</h1>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="search" placeholder="Search..." onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                }} className="w-64 pl-8" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-between items-center mb-4">
                        <div className="flex items-center gap-2">

                            <Select defaultValue={status} value={status} onValueChange={setStatus}>
                                <Label>Status: </Label>

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
                        <div className="flex items-center gap-2">

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
                                <div className="flex items-center space-x-1">
                                    <Input
                                        value={pageDisplayValue}
                                        onChange={(e) => setPageDisplayValue(e.target.value)}
                                        className="w-15 items-center text-center"
                                        type="text"
                                        onBlur={commitEdit}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                commitEdit()
                                            }
                                        }}
                                    />


                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={currentPage === totalPages.current - 1}
                                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages.current - 1))}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Trang cuối cùng"
                                disabled={currentPage === totalPages.current - 1}
                                onClick={() => setCurrentPage(totalPages.current - 1)}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>

                    </div>

                    <div className="flex-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {posts.map((post) => (
                            <Card
                                key={post.id}
                                className="relative cursor-pointer overflow-hidden transition-all hover:shadow-md p-0 gap-0"
                                onClick={() => handlePostClick(post.id)}
                            >
                                <div className="aspect-16/9 w-full overflow-hidden">
                                    <img
                                        src={post.thumbnailUrl || "/placeholder.svg"}
                                        alt={post.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <CardHeader className="p-4 flex-1">
                                    {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="capitalize">{post.status}</span>
                                                <span>•</span>
                                                <span>{post.readTime} read</span>
                                            </div> */}
                                    <CardTitle className="line-clamp-2 text-xs p-0">Name: {post.name}</CardTitle>
                                    <Label className="line-clamp text-xs p-0">{post.title}</Label>
                                    <CardDescription className=" text-xs text-muted-foreground">
                                        <div> {`Created at: ${new Date(post.dateCreated).toLocaleDateString('vi-VN')}`}</div>
                                        <div> {`Last updated: ${new Date(post.lastUpdated).toLocaleDateString('vi-VN')}`}</div>
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="flex items-center justify-between p-4 pt-0">
                                    <div className="">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Badge
                                                className={
                                                    post.approvedStatus === "ACCEPTED"
                                                        ? "bg-green-100 text-green-800"
                                                        : post.approvedStatus === "REJECTED"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                }
                                            >
                                                {post.approvedStatus === "ACCEPTED"
                                                    ? "Accepted"
                                                    : post.approvedStatus === "REJECTED"
                                                        ? "Rejected"
                                                        : "None"}
                                            </Badge>
                                            <Badge
                                                className={
                                                    post.status === "done"
                                                        ? "bg-green-100 text-green-800"
                                                        : post.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-gray-100 text-gray-800" // default là draft
                                                }
                                            >
                                                {post.status === "DONE"
                                                    ? "Done"
                                                    : post.status === "PENDING"
                                                        ? "Pending"
                                                        : "Draft"}
                                            </Badge>

                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {
                                            post.approvedStatus === "ACCEPTED" ? (
                                                <Button variant="ghost" size="icon" onClick={(e) => handleViewPost(e, post.id)}>
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sr-only">View</span>
                                                </Button>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        {
                                            post.status === "DRAFT" ? (
                                                <Button variant="ghost" size="icon" onClick={(e) => handleDeleteClick(e, post)}>
                                                    <Trash className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            ) : <></>
                                        }
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                </div>
            </main>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {postToDelete.current.name} ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </>

    )
}
