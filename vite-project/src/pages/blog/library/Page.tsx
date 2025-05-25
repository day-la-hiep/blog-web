"use client"

import { Label } from "@/components/ui/label"
import * as React from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen, MoreHorizontal, Pencil, Search, Trash, Plus, Loader2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useState } from "react"
import {
    createSavedList,
    deleteSavedList,
    fetchArticlesInSavedList,
    getUserSavedLists,
    removeArticleFromSavedList,
    renameSavedList,
} from "@/service/SavedListApi"

export default function LibraryPage() {
    const [deleteListDialogOpen, setDeleteListDialogOpen] = React.useState(false)
    const [editListDialogOpen, setEditListDialogOpen] = React.useState(false)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [deleteArticleDialogOpen, setDeleteArticleDialogOpen] = useState(false)

    const [loading, setLoading] = useState(false)
    const [selectedList, setSelectedList] = useState<any>(null)
    const [editedTitle, setEditedTitle] = React.useState("")
    const [lists, setLists] = useState([])
    const [articles, setArticles] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [newListName, setNewListName] = useState("")
    const [selectedArticle, setSelectedArticle] = useState<any>(null)
    const navigate = useNavigate()

    // Fetch lists
    const fetchLists = async () => {
        setLoading(true)
        try {
            const res = await getUserSavedLists()
            setLists(res.items || res)
            // Auto-select first list if available
            if ((res.items || res).length > 0) {
                handleSelectList((res.items || res)[0])
            }
        } catch {
            toast.error("Failed to load collections")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchLists()
    }, [])

    // When select list, show articles
    const handleSelectList = async (list: any) => {
        setSelectedList(list)
        try {
            const res = await fetchArticlesInSavedList(list.id)
            setArticles(res.items || [])
        } catch (error) {
            toast.error("Failed to load articles")
        }
    }

    // Create new list
    const handleCreateList = async () => {
        if (!newListName.trim()) return

        try {
            await createSavedList(newListName)
            setNewListName("")
            setCreateDialogOpen(false)
            fetchLists()
            toast.success("Collection created successfully")
        } catch {
            toast.error("Failed to create collection")
        }
    }

    // Edit list name
    const handleEditList = (list: any) => {
        setSelectedList(list)
        setEditedTitle(list.name)
        setEditListDialogOpen(true)
    }

    const handleSaveEdit = async () => {
        if (!editedTitle.trim() || !selectedList) return

        try {
            await renameSavedList(selectedList.id, editedTitle)
            setEditListDialogOpen(false)
            fetchLists()
            toast.success("Collection renamed successfully")
        } catch {
            toast.error("Failed to rename collection")
        }
    }

    // Delete list
    const handleDeleteList = (list: any) => {
            setSelectedList(list)
            setDeleteListDialogOpen(true)
    }

    const handleDeleteListConfirm = async () => {
        if (!selectedList) return

        try {
            await deleteSavedList(selectedList.id)
            setDeleteListDialogOpen(false)
            setSelectedList(null)
            setArticles([])
            fetchLists()
            toast.success("Collection deleted successfully")
        } catch {
            toast.error("Failed to delete collection")
        }
    }

    const handleDeleteArticleConfirm = async () => {
        if (!selectedArticle || !selectedList) return

        try {
            await removeArticleFromSavedList(selectedList.id, selectedArticle.id)
            setDeleteArticleDialogOpen(false)
            handleSelectList(selectedList) // Refresh articles
            toast.success("Article removed from collection")
        } catch {
            toast.error("Failed to remove article")
        }
    }

    const handleArticleClick = (id: string) => {
        navigate(`/posts/${id}`)
    }

    const filteredLists = lists.filter((list: any) => list.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">My Collections</h1>
                            <p className="text-muted-foreground mt-2">Organize and manage your saved articles</p>
                        </div>
                        <Button onClick={() => setCreateDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Collection
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[350px_1fr] gap-8">
                    {/* Collections Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Collections
                                    <Badge variant="secondary" className="ml-auto">
                                        {lists.length}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search collections..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Collections List */}
                                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : filteredLists.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            {search ? "No collections found" : "No collections yet"}
                                        </div>
                                    ) : (
                                        filteredLists.map((list: any) => (
                                            <Card
                                                key={list.id}
                                                className={`cursor-pointer transition-all duration-200 hover:bg-accent p-0 ${selectedList?.id === list.id ? "border-primary bg-accent" : "hover:border-border"
                                                    }`}
                                                onClick={() => handleSelectList(list)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-sm truncate">{list.name}</h3>
                                                            <p className="text-xs text-muted-foreground mt-1">{list.articleCount || 0} articles</p>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 opacity-100 group-hover:opacity-100 transition-opacity"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4 " color="black" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        setTimeout(() => {
                                                                            e.stopPropagation()
                                                                            handleEditList(list)
                                                                        }, 0)
                                                                    }}
                                                                >
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Rename
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-destructive focus:text-destructive"
                                                                    onClick={(e) => {
                                                                        setTimeout(() => {
                                                                            e.stopPropagation()
                                                                            handleDeleteList(list)
                                                                        }, 0)

                                                                    }}
                                                                >
                                                                    <Trash className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Articles Section */}
                    <div className="space-y-6">
                        {selectedList ? (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl">{selectedList.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {articles.length} {articles.length === 1 ? "article" : "articles"} saved
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {articles.length === 0 ? (
                                        <div className="text-center py-12">
                                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-medium mb-2">No articles yet</h3>
                                            <p className="text-muted-foreground">Start saving articles to this collection</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                            {articles.map((article) => (
                                                <Card
                                                    key={article.id}
                                                    className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md"
                                                    onClick={() => handleArticleClick(article.id)}
                                                >
                                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                                        <img
                                                            src={article.thumbnailUrl || "/placeholder.svg?height=200&width=300"}
                                                            alt={article.title}
                                                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <CardContent className="p-4">
                                                        <h3 className="font-semibold line-clamp-2 text-sm mb-2 group-hover:text-primary transition-colors">
                                                            {article.title}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{article.summary}</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage
                                                                        src={
                                                                            article.avatarUrl || article.authorAvatar || "/placeholder.svg?height=24&width=24"
                                                                        }
                                                                        alt={article.author}
                                                                    />
                                                                    <AvatarFallback className="text-xs">
                                                                        {article.author?.[0]?.toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-xs font-medium">{article.author}</span>
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <MoreHorizontal className="h-3 w-3" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem
                                                                        className="text-destructive focus:text-destructive"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            setTimeout(() => {
                                                                                setSelectedArticle(article)
                                                                                setDeleteArticleDialogOpen(true)
                                                                            }, 0)

                                                                        }}
                                                                    >
                                                                        <Trash className="mr-2 h-4 w-4" />
                                                                        Remove
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-16">
                                    <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-medium mb-2">Select a Collection</h3>
                                    <p className="text-muted-foreground text-center max-w-md">
                                        Choose a collection from the sidebar to view your saved articles
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Collection Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Collection</DialogTitle>
                        <DialogDescription>Create a new collection to organize your saved articles.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-title">Collection Name</Label>
                            <Input
                                id="new-title"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                placeholder="e.g., Web Development Resources"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleCreateList()
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateList} disabled={!newListName.trim()}>
                            Create Collection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Collection Dialog */}
            <Dialog open={editListDialogOpen} onOpenChange={setEditListDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rename Collection</DialogTitle>
                        <DialogDescription>Change the name of your collection.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Collection Name</Label>
                            <Input
                                id="edit-title"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSaveEdit()
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditListDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} disabled={!editedTitle.trim()}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Collection Dialog */}
            <Dialog open={deleteListDialogOpen} onOpenChange={setDeleteListDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Collection</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedList?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteListDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteListConfirm}>
                            Delete Collection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Article Dialog */}
            <Dialog open={deleteArticleDialogOpen} onOpenChange={setDeleteArticleDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Remove Article</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove "{selectedArticle?.title}" from this collection?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteArticleDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteArticleConfirm}>
                            Remove Article
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}
