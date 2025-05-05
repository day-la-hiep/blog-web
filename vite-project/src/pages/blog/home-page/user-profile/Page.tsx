"use client"

import * as React from "react"
import { ArrowLeft, Calendar, Mail, MapPin, Pencil } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { useNavigate, useParams } from "react-router-dom"

// Mock user data
const userData = {
    id: "user1",
    name: "John Doe",
    username: "johndoe123",
    email: "john@example.com",
    description: "Frontend Developer with 5 years of experience in React and Next.js",
    avatar: "/placeholder.svg?height=128&width=128",
    role: "author",
    location: "San Francisco, CA",
    website: "https://johndoe.com",
    joinDate: "2022-01-10",
    lastActive: "2023-06-15",
    stats: {
        posts: 24,
        comments: 156,
        savedPosts: 47,
    },
}

// Mock posts data
const userPosts = [
    {
        id: "1",
        title: "Getting Started with Next.js",
        summary: "Learn the basics of Next.js and how to get started with your first project.",
        date: "2023-05-15",
        status: "published",
        views: 1245,
        comments: 32,
        category: "Programming",
    },
    {
        id: "2",
        title: "Understanding React Hooks",
        summary: "A deep dive into React Hooks and how they can simplify your code.",
        date: "2023-04-22",
        status: "published",
        views: 987,
        comments: 18,
        category: "React",
    },
    {
        id: "3",
        title: "The Future of AI in Web Development",
        summary: "Exploring how AI is changing the landscape of web development.",
        date: "2023-06-10",
        status: "draft",
        views: 0,
        comments: 0,
        category: "AI",
    },
    {
        id: "4",
        title: "CSS Grid vs Flexbox",
        summary: "A comparison of CSS Grid and Flexbox for modern layouts.",
        date: "2023-03-18",
        status: "published",
        views: 2341,
        comments: 45,
        category: "CSS",
    },
    {
        id: "5",
        title: "Mobile-First Design Principles",
        summary: "Best practices for implementing mobile-first design in your projects.",
        date: "2023-02-05",
        status: "published",
        views: 1876,
        comments: 27,
        category: "Design",
    },
]

// Mock comments data
const userComments = [
    {
        id: "1",
        postId: "post1",
        postTitle: "Introduction to TypeScript",
        content: "Great article! I've been using TypeScript for a year now and it's been a game-changer.",
        date: "2023-06-10",
        status: "approved",
    },
    {
        id: "2",
        postId: "post2",
        postTitle: "React Server Components Explained",
        content: "This cleared up a lot of my confusion about RSC. Thanks for the detailed explanation!",
        date: "2023-06-05",
        status: "approved",
    },
    {
        id: "3",
        postId: "post3",
        postTitle: "Building a Blog with Next.js",
        content: "I followed this tutorial and got my blog up and running in no time. Very helpful!",
        date: "2023-05-28",
        status: "approved",
    },
    {
        id: "4",
        postId: "post4",
        postTitle: "CSS Variables: A Complete Guide",
        content: "I didn't know CSS variables could be so powerful. This article opened my eyes to new possibilities.",
        date: "2023-05-20",
        status: "approved",
    },
    {
        id: "5",
        postId: "post5",
        postTitle: "JavaScript Performance Optimization",
        content: "The tips about memoization really helped improve my app's performance. Thanks!",
        date: "2023-05-15",
        status: "pending",
    },
]

// Mock saved posts data
const savedPosts = [
    {
        id: "saved1",
        postId: "post10",
        postTitle: "Advanced React Patterns",
        author: "Jane Smith",
        date: "2023-06-12",
        category: "React",
    },
    {
        id: "saved2",
        postId: "post11",
        postTitle: "Building a Design System from Scratch",
        author: "David Lee",
        date: "2023-06-05",
        category: "Design",
    },
    {
        id: "saved3",
        postId: "post12",
        postTitle: "The Complete Guide to Web Accessibility",
        author: "Sarah Williams",
        date: "2023-05-28",
        category: "Accessibility",
    },
    {
        id: "saved4",
        postId: "post13",
        postTitle: "State Management in 2023",
        author: "Mike Johnson",
        date: "2023-05-20",
        category: "JavaScript",
    },
    {
        id: "saved5",
        postId: "post14",
        postTitle: "Optimizing Images for the Web",
        author: "Emily Chen",
        date: "2023-05-15",
        category: "Performance",
    },
]

export default function UserProfilePage() {
    const navigate = useNavigate()
    const { username } = useParams()

    // In a real app, you would fetch the user data based on the ID
    // For this example, we'll use the mock data

    const [activeTab, setActiveTab] = React.useState("posts")
    const [postStatusFilter, setPostStatusFilter] = React.useState("all")
    const [postSearchQuery, setPostSearchQuery] = React.useState("")
    const [commentStatusFilter, setCommentStatusFilter] = React.useState("all")
    const [commentSearchQuery, setCommentSearchQuery] = React.useState("")
    const [savedSearchQuery, setSavedSearchQuery] = React.useState("")
    const [changePasswordDialogOpen, setChangePasswordDialogOpen] = React.useState(false)

    // Filter posts based on status and search query
    const filteredPosts = React.useMemo(() => {
        let filtered = [...userPosts]

        if (postStatusFilter !== "all") {
            filtered = filtered.filter((post) => post.status === postStatusFilter)
        }

        if (postSearchQuery) {
            filtered = filtered.filter(
                (post) =>
                    post.title.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
                    post.summary.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
                    post.category.toLowerCase().includes(postSearchQuery.toLowerCase()),
            )
        }

        return filtered
    }, [postStatusFilter, postSearchQuery])

    // Filter comments based on status and search query
    const filteredComments = React.useMemo(() => {
        let filtered = [...userComments]

        if (commentStatusFilter !== "all") {
            filtered = filtered.filter((comment) => comment.status === commentStatusFilter)
        }

        if (commentSearchQuery) {
            filtered = filtered.filter(
                (comment) =>
                    comment.content.toLowerCase().includes(commentSearchQuery.toLowerCase()) ||
                    comment.postTitle.toLowerCase().includes(commentSearchQuery.toLowerCase()),
            )
        }

        return filtered
    }, [commentStatusFilter, commentSearchQuery])

    // Filter saved posts based on search query
    const filteredSavedPosts = React.useMemo(() => {
        if (!savedSearchQuery) return savedPosts

        return savedPosts.filter(
            (post) =>
                post.postTitle.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
                post.author.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
                post.category.toLowerCase().includes(savedSearchQuery.toLowerCase()),
        )
    }, [savedSearchQuery])

    return (
        <div className="w-full flex flex-1 flex-col items-center p-6">
            <main className="container flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* User Profile Card */}
                    <Card className="md:col-span-1">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle>{userData.name}</CardTitle>
                            <CardDescription>@{userData.username}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{userData.email}</span>
                                    </div>
                                    {userData.location && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span>{userData.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>Tham gia: {userData.joinDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>Hoạt động gần đây: {userData.lastActive}</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <p className="text-sm">{userData.description}</p>
                                </div>

                                {/* <div className="grid grid-cols-3 gap-4 pt-2">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{userData.stats.posts}</p>
                                        <p className="text-xs text-muted-foreground">Bài viết</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{userData.stats.comments}</p>
                                        <p className="text-xs text-muted-foreground">Bình luận</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{userData.stats.savedPosts}</p>
                                        <p className="text-xs text-muted-foreground">Đã lưu</p>
                                    </div>
                                </div> */}


                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm font-medium">Location</p>
                                <p className="text-sm font-medium">Website</p>
                                <p className="text-sm font-medium">Twitter</p>

                                {/* <Button variant="outline" onClick={() => setChangePasswordDialogOpen(true)}>
                                    Change Password
                                </Button> */}
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Content Tabs */}
                    <div className="md:col-span-2">
                        <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
                            {/* <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="posts">Posts</TabsTrigger>
                                <TabsTrigger value="comments">Comments</TabsTrigger>
                                <TabsTrigger value="saved">Saved</TabsTrigger>
                            </TabsList> */}

                            {/* Posts Tab */}
                            <TabsContent value="posts">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Posts by {userData.name}</CardTitle>
                                        <CardDescription>All posts created by {userData.name}.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                <div className="flex flex-1 items-center gap-2">
                                                    <Input
                                                        placeholder="Search posts..."
                                                        value={postSearchQuery}
                                                        onChange={(e) => setPostSearchQuery(e.target.value)}
                                                        className="max-w-md"
                                                    />
                                                </div>

                                                {/* <div className="flex items-center gap-2">
                                                    <span className="text-sm">Status:</span>
                                                    <Select value={postStatusFilter} onValueChange={setPostStatusFilter}>
                                                        <SelectTrigger className="w-[150px]">
                                                            <SelectValue placeholder="All" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All</SelectItem>
                                                            <SelectItem value="published">Published</SelectItem>
                                                            <SelectItem value="draft">Draft</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div> */}
                                            </div>

                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Title</TableHead>
                                                        <TableHead className="hidden md:table-cell">Summary</TableHead>
                                                        <TableHead>Category</TableHead>
                                                        {/* <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Views</TableHead>
                                                        <TableHead className="text-right">Comments</TableHead> */}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredPosts.map((post) => (
                                                        <TableRow
                                                            key={post.id}
                                                            className="cursor-pointer"
                                                            onClick={() => navigate(`/posts/${post.id}`)}
                                                        >
                                                            <TableCell className="font-medium">{post.title}</TableCell>
                                                            <TableCell className="hidden max-w-[300px] truncate md:table-cell">
                                                                {post.summary}
                                                            </TableCell>
                                                            <TableCell>{post.category}</TableCell>
                                                            {/* <TableCell>
                                                                <Badge variant={post.status === "published" ? "default" : "secondary"}>
                                                                    {post.status === "published" ? "Published" : "Draft"}
                                                                </Badge>
                                                            </TableCell> */}
                                                            {/* <TableCell className="text-right">{post.views.toLocaleString()}</TableCell> */}
                                                            {/* <TableCell className="text-right">{post.comments}</TableCell> */}
                                                        </TableRow>
                                                    ))}

                                                    {filteredPosts.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={6} className="h-24 text-center">
                                                                No posts found
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>

                                            <Pagination>
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <PaginationPrevious href="#" />
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#" isActive>
                                                            1
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#">2</PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationNext href="#" />
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Comments Tab */}
                            {/* <TabsContent value="comments">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Comments by {userData.name}</CardTitle>
                                        <CardDescription>List of all comments created by this user.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                <div className="flex flex-1 items-center gap-2">
                                                    <Input
                                                        placeholder="Search comments..."
                                                        value={commentSearchQuery}
                                                        onChange={(e) => setCommentSearchQuery(e.target.value)}
                                                        className="max-w-md"
                                                    />
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm">Status:</span>
                                                    <Select value={commentStatusFilter} onValueChange={setCommentStatusFilter}>
                                                        <SelectTrigger className="w-[150px]">
                                                            <SelectValue placeholder="All" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All</SelectItem>
                                                            <SelectItem value="approved">Approved</SelectItem>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Post</TableHead>
                                                        <TableHead>Content</TableHead>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredComments.map((comment) => (
                                                        <TableRow key={comment.id}>
                                                            <TableCell className="font-medium">{comment.postTitle}</TableCell>
                                                            <TableCell className="max-w-[400px] truncate">{comment.content}</TableCell>
                                                            <TableCell>{comment.date}</TableCell>
                                                            <TableCell>
                                                                <Badge variant={comment.status === "approved" ? "default" : "secondary"}>
                                                                    {comment.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}

                                                    {filteredComments.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="h-24 text-center">
                                                                Không tìm thấy bình luận nào
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>

                                            <Pagination>
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <PaginationPrevious href="#" />
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#" isActive>
                                                            1
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#">2</PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationNext href="#" />
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent> */}

                            {/* Saved Posts Tab */}
                            {/* <TabsContent value="saved">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Saved Posts</CardTitle>
                                        <CardDescription>List of posts saved by this user.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    placeholder="Search saved posts..."
                                                    value={savedSearchQuery}
                                                    onChange={(e) => setSavedSearchQuery(e.target.value)}
                                                    className="max-w-md"
                                                />
                                            </div>

                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Title</TableHead>
                                                        <TableHead>Author</TableHead>
                                                        <TableHead>Category</TableHead>
                                                        <TableHead>Date Saved</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredSavedPosts.map((post) => (
                                                        <TableRow
                                                            key={post.id}
                                                            className="cursor-pointer"
                                                            onClick={() => navigate(`/dashboard/posts/${post.postId}`)}
                                                        >
                                                            <TableCell className="font-medium">{post.postTitle}</TableCell>
                                                            <TableCell>{post.author}</TableCell>
                                                            <TableCell>{post.category}</TableCell>
                                                            <TableCell>{post.date}</TableCell>
                                                        </TableRow>
                                                    ))}

                                                    {filteredSavedPosts.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="h-24 text-center">
                                                                Không tìm thấy bài viết đã lưu nào
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>

                                            <Pagination>
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <PaginationPrevious href="#" />
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#" isActive>
                                                            1
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationNext href="#" />
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent> */}
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    )
}
