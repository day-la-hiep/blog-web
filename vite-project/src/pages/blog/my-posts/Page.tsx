"use client"

import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
// import { useRouter } from "next/navigation"
import { Bell, BookOpen, Edit3, LogOut, Menu, Pencil, Search, Trash, User } from "lucide-react"

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
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = React.useState("all")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [selectedPost, setSelectedPost] = React.useState<(typeof myPosts)[0] | null>(null)

    // Filter posts based on active tab
    const filteredPosts = React.useMemo(() => {
        let filtered = [...myPosts]

        // Filter by tab (status)
        if (activeTab !== "all") {
            filtered = filtered.filter((post) => post.status === activeTab)
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (post) =>
                    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    post.summary.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        return filtered
    }, [activeTab, searchQuery])

    const handlePostClick = (id: string) => {
        navigate(`/posts/${id}`)
    }

    const handleEditPost = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        // router.push(`/edit-post/${id}`)
    }

    const handleDeleteClick = (e: React.MouseEvent, post: (typeof myPosts)[0]) => {
        e.stopPropagation()
        setSelectedPost(post)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = () => {
        // In a real app, you would make an API call to delete the post
        console.log(`Deleting post ${selectedPost?.id}`)
        setDeleteDialogOpen(false)
        setSelectedPost(null)
    }

    return (
        <div className="w-full">
            <main className="flex-1 flex flex-col items-center">
                <div className="container px-4 py-6 sm:px-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold">My Posts</h1>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="search" placeholder="Search..." className="w-64 pl-8" />
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="all" onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">All Posts</TabsTrigger>
                            <TabsTrigger value="published">Published</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="draft">Drafts</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-6">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredPosts.map((post) => (
                                    <Card
                                        key={post.id}
                                        className="relative cursor-pointer overflow-hidden transition-all hover:shadow-md"
                                        onClick={() => handlePostClick(post.id)}
                                    >
                                        <div className="aspect-video w-full overflow-hidden">
                                            <img
                                                src={post.thumbnail || "/placeholder.svg"}
                                                alt={post.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <CardHeader className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="capitalize">{post.status}</span>
                                                <span>•</span>
                                                <span>{post.readTime} read</span>
                                            </div>
                                            <CardTitle className="line-clamp-2 text-xl">{post.title}</CardTitle>
                                            <CardDescription className="line-clamp-2">{post.summary}</CardDescription>
                                        </CardHeader>
                                        <CardFooter className="flex items-center justify-between p-4 pt-0">
                                            <span className="text-sm text-muted-foreground">{post.date}</span>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" onClick={(e) => handleEditPost(e, post.id)}>
                                                    <Pencil className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={(e) => handleDeleteClick(e, post)}>
                                                    <Trash className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {["published", "pending", "draft"].map((status) => (
                            <TabsContent key={status} value={status} className="mt-6">
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {filteredPosts.map((post) => (
                                        <Card
                                            key={post.id}
                                            className="cursor-pointer overflow-hidden transition-all hover:shadow-md"
                                            onClick={() => handlePostClick(post.id)}
                                        >
                                            <div className="aspect-video w-full overflow-hidden">
                                                <img
                                                    src={post.thumbnail || "/placeholder.svg"}
                                                    alt={post.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <CardHeader className="p-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span className="capitalize">{post.status}</span>
                                                    <span>•</span>
                                                    <span>{post.readTime} read</span>
                                                </div>
                                                <CardTitle className="line-clamp-2 text-xl">{post.title}</CardTitle>
                                                <CardDescription className="line-clamp-2">{post.summary}</CardDescription>
                                            </CardHeader>
                                            <CardFooter className="flex items-center justify-between p-4 pt-0">
                                                <span className="text-sm text-muted-foreground">{post.date}</span>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" onClick={(e) => handleEditPost(e, post.id)}>
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={(e) => handleDeleteClick(e, post)}>
                                                        <Trash className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </main>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedPost?.title}"? This action cannot be undone.
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
    )
}
