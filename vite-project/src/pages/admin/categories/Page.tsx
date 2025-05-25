"use client"

import * as React from "react"
import { ArrowDownIcon, ArrowDownUp, ArrowUpIcon, Calendar, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, ImageIcon, Pencil, PlusCircle, Search, StickyNote, Trash, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { createCategory, deleteCategory, fetchCategories, updateCategory } from "@/service/CategoryApi"
import { Controller } from "react-hook-form"
import { toast } from "sonner"
import { useRef, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data
const categories = [
    {
        id: "1",
        name: "Công nghệ",
        slug: "cong-nghe",
        description: "Tin tức về công nghệ mới nhất",
        postCount: 24,
        status: "published",
        parentId: null,
        level: 0,
        metaTitle: "Tin tức công nghệ mới nhất",
        metaDescription: "Cập nhật tin tức công nghệ mới nhất trong ngày",
        featuredImage: "/placeholder.svg?height=50&width=50",
        createdAt: "2023-05-15T10:00:00Z",
        updatedAt: "2023-06-20T14:30:00Z",
        publishDate: "2023-05-15T10:00:00Z",
    },
    {
        id: "2",
        name: "Điện thoại",
        slug: "dien-thoai",
        description: "Thông tin về điện thoại di động",
        postCount: 18,
        status: "published",
        parentId: "1",
        level: 1,
        metaTitle: "Điện thoại di động mới nhất",
        metaDescription: "Thông tin về điện thoại di động, smartphone mới nhất",
        featuredImage: "/placeholder.svg?height=50&width=50",
        createdAt: "2023-05-16T11:20:00Z",
        updatedAt: "2023-06-21T09:15:00Z",
        publishDate: "2023-05-16T12:00:00Z",
    },
    {
        id: "3",
        name: "Laptop",
        slug: "laptop",
        description: "Thông tin về laptop, máy tính xách tay",
        postCount: 32,
        status: "published",
        parentId: "1",
        level: 1,
        metaTitle: "Laptop, máy tính xách tay mới nhất",
        metaDescription: "Thông tin về laptop, máy tính xách tay mới nhất",
        featuredImage: "/placeholder.svg?height=50&width=50",
        createdAt: "2023-05-17T09:00:00Z",
        updatedAt: "2023-06-22T16:45:00Z",
        publishDate: "2023-05-17T10:00:00Z",
    },
    {
        id: "4",
        name: "Máy tính bảng",
        slug: "may-tinh-bang",
        description: "Thông tin về máy tính bảng",
        postCount: 15,
        status: "draft",
        parentId: "1",
        level: 1,
        metaTitle: "Máy tính bảng mới nhất",
        metaDescription: "Thông tin về máy tính bảng mới nhất",
        featuredImage: "/placeholder.svg?height=50&width=50",
        createdAt: "2023-05-18T14:30:00Z",
        updatedAt: "2023-06-23T11:20:00Z",
        publishDate: "2023-07-01T08:00:00Z",
    },
    {
        id: "5",
        name: "Phụ kiện",
        slug: "phu-kien",
        description: "Phụ kiện công nghệ",
        postCount: 21,
        status: "published",
        parentId: "1",
        level: 1,
        metaTitle: "Phụ kiện công nghệ mới nhất",
        metaDescription: "Thông tin về phụ kiện công nghệ mới nhất",
        featuredImage: "/placeholder.svg?height=50&width=50",
        createdAt: "2023-05-19T16:45:00Z",
        updatedAt: "2023-06-24T13:10:00Z",
        publishDate: "2023-05-19T17:00:00Z",
    },

    {
        id: "7",
        name: "Sách",
        slug: "sach",
        description: "Sách hay nên đọc",
        postCount: 28,
        status: "published",
        parentId: null,
        level: 0,
        metaTitle: "Sách hay nên đọc",
        metaDescription: "Giới thiệu sách hay nên đọc",
        featuredImage: "/placeholder.svg?height=50&width=50",
        createdAt: "2023-05-21T08:30:00Z",
        updatedAt: "2023-06-26T09:45:00Z",
        publishDate: "2023-05-21T09:00:00Z",
    },
]







export default function CategoriesPage() {
    const navigate = useNavigate()
    const currentPageInputRef = useRef<HTMLInputElement>(null)
    const [categories, setCategories] = React.useState<any[]>([])
    const [searchQuery, setSearchQuery] = React.useState("")
    const [editDialogOpen, setEditDialogOpen] = React.useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [selectedCategory, setSelectedCategory] = React.useState<(typeof categories)[0] | null>(null)
    const [newCategoryDialogOpen, setNewCategoryDialogOpen] = React.useState(false)
    const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false)
    const [statusFilter, setStatusFilter] = React.useState<string>("all")
    const [parentFilter, setParentFilter] = React.useState<string>("all")
    const [expandedCategories, setExpandedCategories] = React.useState<string[]>([])
    const totalPages = useRef(0)
    const [sortBy, setSortBy] = React.useState('id')

    // Form state for new/edit category
    const [categoryForm, setCategoryForm] = React.useState({
        id: "",
        name: "",
        slug: "",
        description: "",
        parentId: "",
        active: true,
    })

    // Handle form change
    const handleFormChange = (field: string, value: string | boolean | Date) => {
        setCategoryForm((prev) => {
            const newForm = { ...prev, [field]: value }

            return newForm
        })
    }
    const [currentPage, setCurrentPage] = React.useState(0)
    const [pageLimit, setPageLimit] = React.useState(10)
    React.useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;


        updateCategories()
        return () => {
            controller.abort(); // Dừng request cũ
        };
    }, [currentPage, pageLimit, searchQuery, statusFilter, sortBy])
    const updateCategories = async () => {

        try {
            const data = await fetchCategories({
                page: currentPage,
                limit: pageLimit,
                search: searchQuery,
                active: statusFilter === "published" ? true : statusFilter === "draft" ? false : undefined,
                sortBy: sortBy
            })
            totalPages.current = data.totalPages
            currentPageInputRef.current.value = currentPage + 1 + ""
            setCategories(data.items)


        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }
    const handleEditClick = (category) => {
        setSelectedCategory(category)
        setCategoryForm({
            id: category.id,
            name: category.name,
            slug: category.slug,
            parentId: category.parentId,
            description: category.description,
            active: category.active
        })
        setEditDialogOpen(true)
    }
    const handleViewPost = (category: (typeof categories)[0]) => {

        navigate(`/admin/posts?categoryId=${category.id}`)
    }
    const handleDeleteClick = (category: (typeof categories)[0]) => {
        setSelectedCategory(category)
        setDeleteDialogOpen(true)
    }

    const handleViewDetails = (category: (typeof categories)[0]) => {
        setSelectedCategory(category)
        setDetailsDialogOpen(true)
    }

    const handleViewPosts = (categoryId: string) => {
        navigate(`/admin/posts?categoryId=${categoryId}`)
    }

    const handleSaveEdit = async () => {
        try {
            const res = await updateCategory(selectedCategory?.id, {
                name: categoryForm.name,
                slug: categoryForm.slug,
                description: categoryForm.description,
                parentId: categoryForm.parentId,
                active: categoryForm.active
            })
            setCategories((prev) =>
                prev.map((cat) => (cat.id === selectedCategory?.id ? { ...cat, ...categoryForm } : cat)),
            )
            toast.success("Category updated successfully")
        } catch (error) {
            toast.error(`Error updating category: ${error.message}`)
        }

        setEditDialogOpen(false)
    }
    const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    const handlePageInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {

        currentPageInputRef.current.value = (currentPage + 1).toString()
    }
    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteCategory(selectedCategory?.id)
            await updateCategories()
            toast.success("Category deleted successfully")
            console.log(`Deleting category ${selectedCategory?.id}`)
        } catch (error) {
            console.error("Error deleting category:", error)
            toast.error("Failed to delete category: " + error.message)
        } finally {
            setDeleteDialogOpen(false)
        }
    }

    const handleCreateCategory = async () => {
        // In a real app, you would make an API call to create the category
        try {
            if (isValidSlug(categoryForm.slug) == false) {
                categoryForm.slug = ''
                toast.error("Slug không hợp lệ")
                return
            }
            const data = await createCategory({
                name: categoryForm.name,
                slug: categoryForm.slug,
                description: categoryForm.description,
                parentId: categoryForm.parentId,
                active: categoryForm.active,
            })
            toast.success("Tạo danh mục thành công")
            updateCategories()

        } catch (error) {
            toast.error("Error creating category:" + error.message)
        }
        console.log(`Creating new category: ${JSON.stringify(categoryForm)}`)
        setNewCategoryDialogOpen(false)
        // Reset form
        setCategoryForm({
            id: "",
            name: "",
            slug: "",
            description: "",
            parentId: "",
            active: true
        })
    }

    const toggleExpandCategory = (categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
        )
    }

    const renderCategoryRow = (category) => {

        return (
            <React.Fragment key={category.id}>
                <TableRow >
                    <TableCell className="font-medium">
                        <div className="flex items-center">

                            <div className="w-6" />
                            {category.name}
                        </div>
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>
                        <div className="flex items-center">
                            <div
                                className={cn(
                                    "h-2 w-2 rounded-full mr-2",
                                    category.active ? "bg-green-500" : "bg-amber-500",
                                )}
                            />
                            {category.active ? "Published" : "Draft"}
                        </div>
                    </TableCell>
                    <TableCell>{category.parentName || "—"}</TableCell>
                    <TableCell>{new Date(category.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(category)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Sửa</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(category)}>
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Xóa</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(category)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Chi tiết</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleViewPost(category)}>
                                <StickyNote className="h-4 w-4" />
                                <span className="sr-only">Xem bài viết</span>
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>

            </React.Fragment>
        )
    }

    const openNewCategoryDialog = () => {
        setCategoryForm({
            name: "",
            slug: "",
            description: "",
            parentId: "",
            status: "published",
            metaTitle: "",
            metaDescription: "",
            featuredImage: "",
            publishDate: new Date(),
        })
        setNewCategoryDialogOpen(true)
    }


    // Handle double click to edit page dialog
    const [isEditable, setIsEditable] = useState(false);
    const lastClickTime = useRef(0);
    const handleClick = () => {
        const now = Date.now();
        if (now - lastClickTime.current < 300) {
            // Nếu click lần 2 trong vòng 300ms => cho phép chỉnh sửa
            setIsEditable(true);

        }
        lastClickTime.current = now;
    };
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
                <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                <Button onClick={openNewCategoryDialog}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Categories management</CardTitle>
                    <CardDescription>View, add, edit, and delete post categories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2 flex-1">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input

                                    placeholder="Search categories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="max-w-md"
                                />
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="status-filter" className="whitespace-nowrap">
                                        Status:
                                    </Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger id="status-filter" className="w-[140px]">
                                            <SelectValue placeholder="All" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <div className="flex items-center gap-1">
                                            Category name
                                            {getSortIcon('name')}
                                        </div></TableHead>
                                    <TableHead>
                                        <div className="flex items-center gap-1">
                                            Slug
                                            {getSortIcon('slug')}
                                        </div></TableHead>
                                        <TableHead>
                                        <div className="flex items-center gap-1">
                                            Status
                                            {getSortIcon('active')}
                                        </div></TableHead>
                                        <TableHead>
                                        <div className="flex items-center gap-1">
                                            Parent Category
                                            {getSortIcon('parentCategory.name')}
                                        </div></TableHead>
                                        <TableHead>
                                        <div className="flex items-center gap-1">
                                            Created at
                                            {getSortIcon('createdAt')}
                                        </div></TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => renderCategoryRow(category))}

                                {categories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                            Không tìm thấy danh mục nào
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <Label className=" whitespace-nowrap">Items per page:</Label>

                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            {pageLimit}
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        {[5, 10, 20, 50].map((item) => (
                                            <DropdownMenuItem key={item} onClick={() => setPageLimit(item)}>
                                                {item}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center justify-center gap-2">
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
                                        <div className="flex items-center">
                                            <Input

                                                ref={currentPageInputRef}
                                                className="w-16 h-9 text-center"
                                                onKeyDown={handlePageInputKeyDown}
                                                onBlur={handlePageInputBlur}
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


                    </div>
                </CardContent>
            </Card>

            {/* Category Form Dialog (used for both New and Edit) */}
            <Dialog
                open={newCategoryDialogOpen || editDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setNewCategoryDialogOpen(false)
                        setEditDialogOpen(false)
                    }
                }}
            >
                <DialogContent className=" max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editDialogOpen ? "Edit Category" : "Add New Category"}</DialogTitle>
                        <DialogDescription>
                            {editDialogOpen ? "Update category information." : "Add a new category to organize posts."}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="basic">
                        <TabsList className="grid w-full grid-cols-1">
                            <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                        </TabsList>

                        {/* Basic Information Tab */}
                        <TabsContent value="basic" className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    value={categoryForm.name}
                                    onChange={(e) => handleFormChange("name", e.target.value)}
                                    placeholder="Enter category name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={categoryForm.slug}
                                    onChange={(e) => handleFormChange("slug", e.target.value)}
                                    placeholder="category-name"
                                />
                                <p className="text-xs text-muted-foreground">The slug will be used in the category's URL.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={categoryForm.description}
                                    onChange={(e) => handleFormChange("description", e.target.value)}
                                    placeholder="Enter a short description of the category"
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="parent">Parent Category</Label>
                                    <Select value={categoryForm.parentId ? categoryForm.parentId : 'none'} onValueChange={(value) => handleFormChange("parentId", value)}>
                                        <SelectTrigger id="parent">
                                            <SelectValue placeholder="Select parent category (if any)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No parent category</SelectItem>
                                            {categories
                                                .map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {"—".repeat(cat.level)} {cat.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>

                                    <p className="text-xs text-muted-foreground">Select a parent category to build a hierarchical structure.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="active">Active</Label>
                                    <Switch
                                        id="active"
                                        checked={categoryForm.active}
                                        onCheckedChange={(checked) => handleFormChange("active", checked)}
                                    />
                                </div>
                            </div>


                        </TabsContent>


                    </Tabs>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={(e) => {
                                setNewCategoryDialogOpen(false)
                                setEditDialogOpen(false)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={editDialogOpen ? handleSaveEdit : handleCreateCategory}>
                            {editDialogOpen ? "Save change" : "Create category"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone and will
                            affect all posts in this category.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Category Details Dialog */}
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Category Details</DialogTitle>
                        <DialogDescription>Detailed information about the category "{selectedCategory?.name}".</DialogDescription>
                    </DialogHeader>

                    {selectedCategory && (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {selectedCategory.featuredImage && (
                                    <div className="w-full sm:w-1/3">
                                        <img
                                            src={selectedCategory.featuredImage || "/placeholder.svg"}
                                            alt={selectedCategory.name}
                                            className="w-full h-auto rounded-md border"
                                        />
                                    </div>
                                )}

                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="text-lg font-semibold">{selectedCategory.name}</h3>
                                        <p className="text-sm text-muted-foreground">/{selectedCategory.slug}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "h-2 w-2 rounded-full",
                                                selectedCategory.status === "published" ? "bg-green-500" : "bg-amber-500",
                                            )}
                                        />
                                        <span className="text-sm">{selectedCategory.status === "published" ? "Hiển thị" : "Bản nháp"}</span>
                                    </div>

                                    <p className="text-sm">{selectedCategory.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                                <div>
                                    <h4 className="text-sm font-medium">Basic Information</h4>
                                    <dl className="mt-2 space-y-1">
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-muted-foreground">ID:</dt>
                                            <dd className="text-sm font-medium">{selectedCategory.id}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-muted-foreground">Parent Category: {selectedCategory.parentName ? selectedCategory.parentName : '__'}</dt>
                                        </div>
                                    </dl>
                                </div>

                            </div>


                            <div className="flex justify-between border-t pt-4">
                                <Button variant="outline" onClick={() => handleViewPosts(selectedCategory.id)}>
                                    View Posts
                                </Button>
                                <div className="space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDetailsDialogOpen(false)
                                            handleEditClick(selectedCategory)
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setDetailsDialogOpen(false)
                                            handleDeleteClick(selectedCategory)
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
function isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
}