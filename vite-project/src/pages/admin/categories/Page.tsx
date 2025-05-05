"use client"

import * as React from "react"
import { Calendar, ChevronDown, ChevronRight, Eye, ImageIcon, Pencil, PlusCircle, Search, Trash, X } from "lucide-react"
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

// Utility function to get category by ID
const getCategoryById = (id: string | null) => {
    if (!id) return null
    return categories.find((cat) => cat.id === id)
}

// Utility function to get children categories
const getChildCategories = (parentId: string | null) => {
    return categories.filter((cat) => cat.parentId === parentId)
}

// Utility function to generate slug from name
const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
}

export default function CategoriesPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [editDialogOpen, setEditDialogOpen] = React.useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [selectedCategory, setSelectedCategory] = React.useState<(typeof categories)[0] | null>(null)
    const [newCategoryDialogOpen, setNewCategoryDialogOpen] = React.useState(false)
    const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false)
    const [statusFilter, setStatusFilter] = React.useState<string>("all")
    const [parentFilter, setParentFilter] = React.useState<string>("all")
    const [expandedCategories, setExpandedCategories] = React.useState<string[]>([])

    // Form state for new/edit category
    const [categoryForm, setCategoryForm] = React.useState({
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

    // Handle form change
    const handleFormChange = (field: string, value: string | boolean | Date) => {
        setCategoryForm((prev) => {
            const newForm = { ...prev, [field]: value }

            // Auto-generate slug if name changes and slug hasn't been manually edited
            if (field === "name" && typeof value === "string") {
                newForm.slug = generateSlug(value)
                newForm.metaTitle = value
            }

            return newForm
        })
    }

    // Filter categories based on search query, status, and parent
    const filteredCategories = React.useMemo(() => {
        let filtered = categories

        if (searchQuery) {
            filtered = filtered.filter(
                (category) =>
                    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    category.description.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((category) => category.status === statusFilter)
        }

        if (parentFilter !== "all") {
            if (parentFilter === "none") {
                filtered = filtered.filter((category) => category.parentId === null)
            } else {
                filtered = filtered.filter((category) => category.parentId === parentFilter)
            }
        }

        return filtered
    }, [searchQuery, statusFilter, parentFilter])

    // Root level categories for display
    const rootCategories = React.useMemo(() => {
        return filteredCategories.filter((category) => category.level === 0)
    }, [filteredCategories])

    const handleEditClick = (category: (typeof categories)[0]) => {
        setSelectedCategory(category)
        setCategoryForm({
            name: category.name,
            slug: category.slug,
            description: category.description,
            parentId: category.parentId || "",
            status: category.status,
            metaTitle: category.metaTitle,
            metaDescription: category.metaDescription,
            featuredImage: category.featuredImage,
            publishDate: new Date(category.publishDate),
        })
        setEditDialogOpen(true)
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
        navigate(`/dashboard/posts?categoryId=${categoryId}`)
    }

    const handleSaveEdit = () => {
        // In a real app, you would make an API call to update the category
        console.log(`Saving edited category: ${JSON.stringify(categoryForm)}`)
        setEditDialogOpen(false)
    }

    const handleDeleteConfirm = () => {
        // In a real app, you would make an API call to delete the category
        console.log(`Deleting category ${selectedCategory?.id}`)
        setDeleteDialogOpen(false)
    }

    const handleCreateCategory = () => {
        // In a real app, you would make an API call to create the category
        console.log(`Creating new category: ${JSON.stringify(categoryForm)}`)
        setNewCategoryDialogOpen(false)
        // Reset form
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
    }

    const toggleExpandCategory = (categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
        )
    }

    const renderCategoryRow = (category: (typeof categories)[0], level = 0) => {
        const isExpanded = expandedCategories.includes(category.id)
        const hasChildren = getChildCategories(category.id).length > 0

        return (
            <React.Fragment key={category.id}>
                <TableRow className={cn(level > 0 && "bg-muted/30")}>
                    <TableCell className="font-medium">
                        <div className="flex items-center">
                            <div style={{ width: `${level * 20}px` }} />
                            {hasChildren && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 mr-1"
                                    onClick={() => toggleExpandCategory(category.id)}
                                >
                                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </Button>
                            )}
                            {!hasChildren && <div className="w-6" />}
                            {category.name}
                        </div>
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>
                        <div className="flex items-center">
                            <div
                                className={cn(
                                    "h-2 w-2 rounded-full mr-2",
                                    category.status === "published" ? "bg-green-500" : "bg-amber-500",
                                )}
                            />
                            {category.status === "published" ? "Hiển thị" : "Bản nháp"}
                        </div>
                    </TableCell>
                    <TableCell>{getCategoryById(category.parentId)?.name || "—"}</TableCell>
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
                        </div>
                    </TableCell>
                </TableRow>

                {/* Render children if expanded */}
                {isExpanded &&
                    hasChildren &&
                    getChildCategories(category.id).map((child) => renderCategoryRow(child, level + 1))}
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

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Danh mục</h2>
                <Button onClick={openNewCategoryDialog}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Thêm danh mục
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quản lý danh mục</CardTitle>
                    <CardDescription>Xem, thêm, sửa và xóa danh mục bài viết.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2 flex-1">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm danh mục..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="max-w-md"
                                />
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="status-filter" className="whitespace-nowrap">
                                        Trạng thái:
                                    </Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger id="status-filter" className="w-[140px]">
                                            <SelectValue placeholder="Tất cả" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            <SelectItem value="published">Hiển thị</SelectItem>
                                            <SelectItem value="draft">Bản nháp</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Label htmlFor="parent-filter" className="whitespace-nowrap">
                                        Danh mục cha:
                                    </Label>
                                    <Select value={parentFilter} onValueChange={setParentFilter}>
                                        <SelectTrigger id="parent-filter" className="w-[180px]">
                                            <SelectValue placeholder="Tất cả" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            <SelectItem value="none">Không có danh mục cha</SelectItem>
                                            {categories
                                                .filter((cat) => cat.level === 0)
                                                .map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Danh mục cha</TableHead>
                                    <TableHead>Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rootCategories.map((category) => renderCategoryRow(category))}

                                {rootCategories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                            Không tìm thấy danh mục nào
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink isActive>1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink>2</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
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
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editDialogOpen ? "Sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
                        <DialogDescription>
                            {editDialogOpen ? "Cập nhật thông tin danh mục." : "Thêm danh mục mới để tổ chức bài viết."}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="basic">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                            {/* <TabsTrigger value="seo">SEO</TabsTrigger> */}
                            <TabsTrigger value="advanced">Nâng cao</TabsTrigger>
                        </TabsList>

                        {/* Basic Information Tab */}
                        <TabsContent value="basic" className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Tên danh mục</Label>
                                <Input
                                    id="name"
                                    value={categoryForm.name}
                                    onChange={(e) => handleFormChange("name", e.target.value)}
                                    placeholder="Nhập tên danh mục"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={categoryForm.slug}
                                    onChange={(e) => handleFormChange("slug", e.target.value)}
                                    placeholder="ten-danh-muc"
                                />
                                <p className="text-xs text-muted-foreground">Slug sẽ được sử dụng trong URL của danh mục.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    value={categoryForm.description}
                                    onChange={(e) => handleFormChange("description", e.target.value)}
                                    placeholder="Nhập mô tả ngắn về danh mục"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parent">Danh mục cha</Label>
                                <Select value={categoryForm.parentId} onValueChange={(value) => handleFormChange("parentId", value)}>
                                    <SelectTrigger id="parent">
                                        <SelectValue placeholder="Chọn danh mục cha (nếu có)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Không có danh mục cha</SelectItem>
                                        {categories
                                            .filter((cat) => !editDialogOpen || cat.id !== selectedCategory?.id)
                                            .map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {"—".repeat(cat.level)} {cat.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">Chọn danh mục cha để xây dựng cấu trúc phân cấp.</p>
                            </div>

                            <div className="space-y-2">
                                {/* <div className="flex items-center justify-between">
                                    <Label htmlFor="featured-image">Ảnh đại diện</Label>
                                    <Button variant="outline" size="sm">
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        Tải ảnh lên
                                    </Button>
                                </div> */}
                                {/* {categoryForm.featuredImage ? (
                                    <div className="relative w-full h-40 rounded-md overflow-hidden border">
                                        <img
                                            src={categoryForm.featuredImage || "/placeholder.svg"}
                                            alt="Featured"
                                            className="w-full h-full object-cover"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6"
                                            onClick={() => handleFormChange("featuredImage", "")}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-full h-40 rounded-md border flex items-center justify-center bg-muted/50">
                                        <div className="text-center text-muted-foreground">
                                            <ImageIcon className="mx-auto mb-2 h-8 w-8" />
                                            <p>Kéo thả ảnh vào đây hoặc nhấp để chọn</p>
                                            <p className="text-xs">Kích thước khuyến nghị: 1200x630px</p>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        </TabsContent>


                        {/* Advanced Tab */}
                        <TabsContent value="advanced" className="space-y-4 py-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="status">Trạng thái</Label>
                                    <p className="text-sm text-muted-foreground">Hiển thị hoặc ẩn danh mục trên trang web</p>
                                </div>
                                <Switch
                                    id="status"
                                    checked={categoryForm.status === "published"}
                                    onCheckedChange={(checked) => handleFormChange("status", checked ? "published" : "draft")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="publish-date">Thời gian hiển thị</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {categoryForm.publishDate ? (
                                                format(categoryForm.publishDate, "dd/MM/yyyy")
                                            ) : (
                                                <span>Chọn ngày</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent
                                            mode="single"
                                            selected={categoryForm.publishDate}
                                            onSelect={(date) => handleFormChange("publishDate", date || new Date())}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <p className="text-xs text-muted-foreground">Thiết lập thời gian hiển thị danh mục trên trang web.</p>
                            </div>

                            {/* <div className="space-y-2 border-t pt-4 mt-4">
                                <h4 className="font-medium">Xử lý khi xóa danh mục</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" id="delete-move" name="delete-action" className="h-4 w-4" defaultChecked />
                                        <Label htmlFor="delete-move">Di chuyển bài viết và danh mục con sang danh mục khác</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" id="delete-with-children" name="delete-action" className="h-4 w-4" />
                                        <Label htmlFor="delete-with-children">Xóa cả danh mục con và bài viết liên quan</Label>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Lựa chọn cách xử lý danh mục con và bài viết khi xóa danh mục này.
                                </p>
                            </div> */}
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setNewCategoryDialogOpen(false)
                                setEditDialogOpen(false)
                            }}
                        >
                            Hủy
                        </Button>
                        <Button onClick={editDialogOpen ? handleSaveEdit : handleCreateCategory}>
                            {editDialogOpen ? "Lưu thay đổi" : "Tạo danh mục"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa danh mục "{selectedCategory?.name}"? Hành động này không thể hoàn tác và sẽ ảnh
                            hưởng đến tất cả bài viết trong danh mục này.
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
                        <DialogTitle>Chi tiết danh mục</DialogTitle>
                        <DialogDescription>Thông tin chi tiết về danh mục "{selectedCategory?.name}".</DialogDescription>
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
                                    <h4 className="text-sm font-medium">Thông tin cơ bản</h4>
                                    <dl className="mt-2 space-y-1">
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-muted-foreground">ID:</dt>
                                            <dd className="text-sm font-medium">{selectedCategory.id}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-muted-foreground">Số bài viết:</dt>
                                            <dd className="text-sm font-medium">{selectedCategory.postCount}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-muted-foreground">Danh mục cha:</dt>
                                            <dd className="text-sm font-medium">{getCategoryById(selectedCategory.parentId)?.name || "—"}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-muted-foreground">Cấp độ:</dt>
                                            <dd className="text-sm font-medium">{selectedCategory.level}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium">Thời gian</h4>
                                    <dl className="mt-2 space-y-1">
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-muted-foreground">Ngày tạo:</dt>
                                            <dd className="text-sm font-medium">
                                                {format(new Date(selectedCategory.createdAt), "dd/MM/yyyy HH:mm")}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-muted-foreground">Cập nhật lần cuối:</dt>
                                            <dd className="text-sm font-medium">
                                                {format(new Date(selectedCategory.updatedAt), "dd/MM/yyyy HH:mm")}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-muted-foreground">Ngày xuất bản:</dt>
                                            <dd className="text-sm font-medium">
                                                {format(new Date(selectedCategory.publishDate), "dd/MM/yyyy HH:mm")}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="text-sm font-medium">SEO</h4>
                                <dl className="mt-2 space-y-2">
                                    <div>
                                        <dt className="text-sm text-muted-foreground">Meta Title:</dt>
                                        <dd className="text-sm">{selectedCategory.metaTitle}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-muted-foreground">Meta Description:</dt>
                                        <dd className="text-sm">{selectedCategory.metaDescription}</dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="flex justify-between border-t pt-4">
                                <Button variant="outline" onClick={() => handleViewPosts(selectedCategory.id)}>
                                    Xem bài viết
                                </Button>
                                <div className="space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDetailsDialogOpen(false)
                                            handleEditClick(selectedCategory)
                                        }}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setDetailsDialogOpen(false)
                                            handleDeleteClick(selectedCategory)
                                        }}
                                    >
                                        Xóa
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
