"use client"

import { Label } from "@/components/ui/label"

import * as React from "react"
import { Link } from "react-router-dom"
// import { useRouter } from "next/navigation"
import { Bell, BookOpen, Edit3, LogOut, Menu, MoreHorizontal, Pencil, Search, Trash, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
const savedLists = [
    {
        id: "1",
        title: "Web Development",
        count: 5,
        updatedAt: "2023-05-20",
    },
    {
        id: "2",
        title: "Design Inspiration",
        count: 3,
        updatedAt: "2023-05-15",
    },
    {
        id: "3",
        title: "Must Read",
        count: 7,
        updatedAt: "2023-05-18",
    },
    {
        id: "4",
        title: "AI Research",
        count: 2,
        updatedAt: "2023-05-10",
    },
    {
        id: "5",
        title: "Career Resources",
        count: 4,
        updatedAt: "2023-05-12",
    },
]

const savedArticles = [
    {
        id: "1",
        title: "Getting Started with Next.js",
        summary: "Learn the basics of Next.js and how to get started with your first project.",
        author: "John Doe",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        date: "2023-05-15",
        readTime: "5 min",
        thumbnail: "/placeholder.svg?height=200&width=400",
    },
    {
        id: "2",
        title: "Understanding React Hooks",
        summary: "A deep dive into React Hooks and how they can simplify your code.",
        author: "Jane Smith",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        date: "2023-05-10",
        readTime: "7 min",
        thumbnail: "/placeholder.svg?height=200&width=400",
    },
    {
        id: "3",
        title: "The Future of AI in Web Development",
        summary: "Exploring how AI is changing the landscape of web development.",
        author: "Mike Johnson",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        date: "2023-05-20",
        readTime: "10 min",
        thumbnail: "/placeholder.svg?height=200&width=400",
    },
]

export default function LibraryPage() {
    //   const router = useRouter()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [deleteListDialogOpen, setDeleteListDialogOpen] = React.useState(false)
    const [editListDialogOpen, setEditListDialogOpen] = React.useState(false)
    const [selectedList, setSelectedList] = React.useState<(typeof savedLists)[0] | null>(null)
    const [editedTitle, setEditedTitle] = React.useState("")
    const [selectedListId, setSelectedListId] = React.useState<string | null>(null)
    const [createListDialogOpen, setCreateListDialogOpen] = React.useState(false)
    const [newListTitle, setNewListTitle] = React.useState("")

    // Filter lists based on search
    const filteredLists = React.useMemo(() => {
        if (!searchQuery) return savedLists

        return savedLists.filter((list) => list.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [searchQuery])

    const handleListSelect = (listId: string) => {
        setSelectedListId(listId)
    }

    const handleEditList = (list: (typeof savedLists)[0]) => {
        setSelectedList(list)
        setEditedTitle(list.title)
        setEditListDialogOpen(true)
    }

    const handleDeleteList = (list: (typeof savedLists)[0]) => {
        setSelectedList(list)
        setDeleteListDialogOpen(true)
    }

    const handleSaveEdit = () => {
        // In a real app, you would make an API call to update the list
        console.log(`Saving edited list: ${editedTitle}`)
        setEditListDialogOpen(false)
    }

    const handleDeleteConfirm = () => {
        // In a real app, you would make an API call to delete the list
        console.log(`Deleting list ${selectedList?.id}`)
        setDeleteListDialogOpen(false)
        setSelectedList(null)
        setSelectedListId(null)
    }

    const handleCreateList = () => {
        // In a real app, you would make an API call to create the list
        console.log(`Creating new list: ${newListTitle}`)
        setCreateListDialogOpen(false)
        setNewListTitle("")
    }

    const handleArticleClick = (id: string) => {
        router.push(`/posts/${id}`)
    }

    return (
        <div className="flex min-h-screen flex-col w-full">

            <main className="flex-1">
                <div className="container px-4 py-6 sm:px-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold">My Library</h1>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search collections..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 sm:max-w-md"
                                />
                            </div>
                            <Button onClick={() => setCreateListDialogOpen(true)}>
                                <BookOpen className="mr-2 h-4 w-4" />
                                Create Collection
                            </Button>
                        </div>
                    </div>


                    <div className="grid gap-6 sm:grid-cols-12">
                        <div className="sm:col-span-4">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Collections</h2>
                                <div className="space-y-2">
                                    {filteredLists.map((list) => (
                                        <Card
                                            key={list.id}
                                            className={`cursor-pointer transition-all hover:border-primary/50 ${selectedListId === list.id ? "border-primary" : ""
                                                }`}
                                            onClick={() => handleListSelect(list.id)}
                                        >
                                            <CardHeader className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-base">{list.title}</CardTitle>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleEditList(list)
                                                                }}
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                <span>Edit Title</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleDeleteList(list)
                                                                }}
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                <span>Delete Collection</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                    <span>
                                                        {list.count} article{list.count !== 1 && "s"}
                                                    </span>
                                                    <span>Updated {list.updatedAt}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-8">
                            {selectedListId ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold">{savedLists.find((l) => l.id === selectedListId)?.title}</h2>
                                        <span className="text-sm text-muted-foreground">
                                            {savedArticles.length} article{savedArticles.length !== 1 && "s"}
                                        </span>
                                    </div>
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        {savedArticles.map((article) => (
                                            <Card
                                                key={article.id}
                                                className="cursor-pointer overflow-hidden transition-all hover:shadow-md"
                                                onClick={() => handleArticleClick(article.id)}
                                            >
                                                <div className="aspect-video w-full overflow-hidden">
                                                    <img
                                                        src={article.thumbnail || "/placeholder.svg"}
                                                        alt={article.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <CardHeader className="p-4">
                                                    <CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
                                                    <CardDescription className="line-clamp-2">{article.summary}</CardDescription>
                                                </CardHeader>
                                                <CardFooter className="flex items-center gap-3 p-4 pt-0">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={article.authorAvatar || "/placeholder.svg"} alt={article.author} />
                                                        <AvatarFallback>{article.author[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-medium">{article.author}</span>
                                                    <span className="text-sm text-muted-foreground">{article.date}</span>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                                    <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                                    <h3 className="mb-2 text-xl font-semibold">No Collection Selected</h3>
                                    <p className="mb-6 text-muted-foreground">
                                        Select a collection from the sidebar to view saved articles
                                    </p>
                                    <Button variant="outline" onClick={() => setCreateListDialogOpen(true)}>
                                        Create New Collection
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Edit List Dialog */}
            <Dialog open={editListDialogOpen} onOpenChange={setEditListDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Collection</DialogTitle>
                        <DialogDescription>Change the title of your collection.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditListDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete List Dialog */}
            <Dialog open={deleteListDialogOpen} onOpenChange={setDeleteListDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the collection "{selectedList?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteListDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create List Dialog */}
            <Dialog open={createListDialogOpen} onOpenChange={setCreateListDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Collection</DialogTitle>
                        <DialogDescription>Create a new collection to organize your saved articles.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-title">Title</Label>
                            <Input
                                id="new-title"
                                value={newListTitle}
                                onChange={(e) => setNewListTitle(e.target.value)}
                                placeholder="E.g., Web Development Resources"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateListDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateList}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    )
}
