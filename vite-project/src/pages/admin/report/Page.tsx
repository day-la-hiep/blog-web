"use client"

import { DialogFooter } from "@/components/ui/dialog"

import * as React from "react"
import { Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Trash, Trash2, X } from "lucide-react"
// import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"
import { deleteReport, fetchReports, updateReportStatus } from "@/service/ReportApi"
import { toast } from "sonner"
import { DatePicker } from "@/components/ui/DatePicker"
import { deletePost } from "@/service/PostApi"
import { deleteComment } from "@/service/CommentApi"
// Thêm interface cho Note
interface Note {
    id: string
    reportId: string
    content: string
    createdBy: string
    createdAt: string
    isAdmin: boolean
}

// Mock current user
const currentUser = {
    id: "user1",
    name: "John Doe",
    isAdmin: true,
}

export default function ReportsPage() {
    // const [isLoading, setIsLoading] = React.useState(true)
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = React.useState("post")

    // State for post reports
    const [reportStatus, setReportStatus] = React.useState("all")
    const [search, setSearch] = React.useState("")

    // Dialog state
    const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false)
    const [selectedReport, setSelectedReport] = React.useState<any>(null)

    // State for notes
    const [adminNote, setAdminNote] = React.useState("")
    const [reportNotes, setReportNotes] = React.useState<Note[]>([])
    const [isAddingNote, setIsAddingNote] = React.useState(false)

    // Pagination state
    const [startDate, setStartDate] = React.useState()
    const [endDate, setEndDate] = React.useState()
    const [currentPage, setCurrentPage] = React.useState(0)
    const [pageLimit, setPagelimit] = React.useState(10)
    const totalItems = React.useRef(0)
    const totalPages = React.useRef(0)
    const currentPageInputRef = React.useRef<HTMLInputElement>(null)

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const value = Number.parseInt(e.currentTarget.value, 10)
            if (!isNaN(value) && value > 0 && value <= totalPages.current) {
                setCurrentPage(value - 1)
                currentPageInputRef.current.value = (currentPage + 1).toString()
            } else {
                currentPageInputRef.current.value = (currentPage + 1).toString()
            }
        }
    }
    const handleInputBLur = (e: React.FocusEvent<HTMLInputElement>) => {
        currentPageInputRef.current.value = (currentPage + 1).toString()
    }

    // Filter post reports
    const [reports, setReports] = React.useState<any[]>([])
    React.useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        udpateReports()
        return () => {
            controller.abort(); // Clean up the effect by aborting the fetch request
        }
    }, [currentPage, pageLimit, activeTab, startDate, endDate, reportStatus, search])
    const udpateReports = async () => {
        try {
            const response = await fetchReports({
                page: currentPage,
                limit: pageLimit,
                sortBy: "createdAt",
                targetType: activeTab === "post" ? "ARTICLE" : "COMMENT",
                status: reportStatus === "all" ? undefined : reportStatus,
                startDate: startDate ? startDate.toISOString().replace(/Z$/, '') : undefined,
                endDate: endDate ? endDate.toISOString().replace(/Z$/, '') : undefined,
                search: search.trim(),
            })
            setReports(response.items || [])
            setCurrentPage(response.page)
            setPagelimit(response.limit)
            totalItems.current = response.totalItems
            totalPages.current = response.totalPages
            currentPageInputRef.current.value = response.page + 1 + ""
        } catch (error) {
            console.error("Failed to fetch reports:", error)
            toast.error("Failed to fetch reports")
        } finally {
        }
    }

    const handleViewDetails = (report: any) => {
        setAdminNote(report.note || "")
        setSelectedReport(report)
        setDetailsDialogOpen(true)
        setAdminNote("")
    }

    const handleReportAction = (reportId: string, type: string, action: "accept" | "reject") => {
        // In a real app, you would make an API call to update the report status
        console.log(`${action === "accept" ? "Accepting" : "Rejecting"} ${type} report ${reportId}`)
    }

    const handleDeleteContent = async (report: any) => {
        try {
            if (report.targetType === "ARTICLE") {
                const res = confirm("Are you sure you want to delete this post?")
                if (!res) {
                    return
                }
                await deletePost(report.targetId)

            } else {
                const res = confirm("Are you sure you want to delete this comment?")
                if (!res) {
                    return
                }
                await deleteComment(report.targetId)
                console.log(`Xóa bình luận với ID: ${report.commentId}`)
            }
            await udpateReports()
        } catch (error) {
            console.error("Failed to delete content:", error)
            toast.error("Failed to delete content")
        }
    }

    const handleDeleteReport = async (reportId: string) => {
        // Trong thực tế, bạn sẽ gọi API để xóa báo cáo
        if (confirm("Bạn có chắc chắn muốn xóa báo cáo này không?")) {
            try {
                const res = await deleteReport(reportId)
                console.log(`Xóa báo cáo với ID: ${reportId}`)
                toast.success("Report deleted successfully")
                udpateReports()
                setDetailsDialogOpen(false)
            } catch (error) {
                console.error("Failed to delete report:", error)
                toast.error("Failed to delete report")
            }
        }
    }

    const handleViewPost = (postId: string) => {
        window.open(`/admin/preview-post/${postId}`, "_blank")
    }

    const handleSaveNote = async (reportId: string) => {
        if (!adminNote.trim() || !selectedReport) return
        setIsAddingNote(true)
        try {
            // In a real app, you would make an API call to save the note
            const res = await updateReportStatus(selectedReport.id, selectedReport.status, adminNote.trim())

            setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, note: adminNote } : report)))
            toast.success("Note added successfully")
        } catch (error) {
            console.error("Failed to add note:", error)
            toast.error("Failed to add note")
        } finally {
            setIsAddingNote(false)
        }
    }

    const handleMarkResolved = async (reportId: string, status: string) => {
        try {
            // In a real app, you would make an API call to update the report status
            const res = await updateReportStatus(reportId, status === 'PENDING' ? "PENDING" : "RESOLVED", adminNote.trim())
            console.log(`Marking report ${reportId} as ${status ? "resolved" : "unresolved"}`)

            // Update local state
            setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, status: status } : report)))

            if (selectedReport && selectedReport.id === reportId) {
                setSelectedReport((prev) => ({ ...prev, status: status }))
            }

            toast.success(`Report marked as ${status ? "resolved" : "unresolved"}`)
        } catch (error) {
            console.error("Failed to update report status:", error)
            toast.error("Failed to update report status")
        }
    }



    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
            </div>

            <Tabs defaultValue="post" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="post">Post Reports</TabsTrigger>
                    <TabsTrigger value="comment">Comment Reports</TabsTrigger>
                </TabsList>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Post Reports</CardTitle>
                    <CardDescription>View and process reports about inappropriate post content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex flex-1 items-center gap-2">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search reports..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">From:</span>
                                    <DatePicker
                                        value={startDate}
                                        onValueChange={(date) => setStartDate(date)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">To:</span>
                                    <DatePicker
                                        value={endDate}
                                        onValueChange={(date) => setEndDate(date)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm">Status:</span>
                                <Select value={reportStatus} onValueChange={setReportStatus}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead className="hidden md:table-cell">Created by</TableHead>
                                    <TableHead>Reported By</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {false ? (
                                    <>
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-4">
                                                <div className="flex items-center justify-center">
                                                    <span className="text-muted-foreground">Loading reports...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ) : (
                                    <>
                                        {reports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="font-medium max-w-3 truncate" title={report.id}>
                                                    {report.id}
                                                </TableCell>
                                                <TableCell>{report.reason}</TableCell>
                                                <TableCell>{report.authorUsername}</TableCell>
                                                <TableCell>{new Date(report.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                                <TableCell>
                                                    <Badge variant={report.status === 'PENDING' ? "default" : "destructive"}>
                                                        {report.status === 'PENDING' ? "Pending" : "Resolved"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                Actions
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => {
                                                                setTimeout(() => {
                                                                    handleViewDetails(report)
                                                                }, 0)
                                                            }}>
                                                                View Details
                                                            </DropdownMenuItem>
                                                            {
                                                                report.targetType === 'ARTICLE' && <>
                                                                    <DropdownMenuItem onClick={() => handleViewPost(report.targetId)}>
                                                                        View Post
                                                                    </DropdownMenuItem>
                                                                </>
                                                            }

                                                            <DropdownMenuItem onClick={() => handleMarkResolved(report.id, report.status === 'PENDING' ? 'RESOLVED' : 'PENDING')}>
                                                                {report.status !== 'PENDING' ? (
                                                                    <>
                                                                        <X className="mr-2 h-4 w-4" />
                                                                        <span>Mark Unresolved</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Check className="mr-2 h-4 w-4" />
                                                                        <span>Mark Resolved</span>
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteReport(report.id)} className="text-red-600">
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                <span>Delete Report</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {reports.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center">
                                                    No reports found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">Items per page:</p>
                                <Select
                                    defaultValue={pageLimit.toString()}
                                    value={pageLimit.toString()}
                                    onValueChange={(value) => setPagelimit(Number(value))}
                                >
                                    <SelectTrigger className="w-[70px]">
                                        <SelectValue placeholder="10" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-muted-foreground">
                                    Showing {Math.min(reports.length, pageLimit)} of {totalItems.current} results
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon" onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>
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
                                            onKeyDown={handleInputKeyDown}
                                            onBlur={handleInputBLur}
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
                </CardContent>
            </Card>

            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Report Details</DialogTitle>
                        <DialogDescription>View detailed information about this report.</DialogDescription>
                    </DialogHeader>
                    {selectedReport && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-1 font-medium">ID:</div>
                                <div className="col-span-3">{selectedReport.id}</div>

                                <div className="col-span-1 font-medium">Type:</div>
                                <div className="col-span-3">{selectedReport.commentId ? "Comment Report" : "Post Report"}</div>

                                {selectedReport.targetId ? (
                                    <>
                                        <div className="col-span-1 font-medium">Target id:</div>
                                        <div className="col-span-3">{selectedReport.targetId}</div>
                                    </>
                                ) : null}


                                <div className="col-span-1 font-medium">Reason:</div>
                                <div className="col-span-3">{selectedReport.reason}</div>

                                <div className="col-span-1 font-medium">Details:</div>
                                <div className="col-span-3">{selectedReport.details}</div>

                                <div className="col-span-1 font-medium">Reported By:</div>
                                <div className="col-span-3">{selectedReport.authorUsername}</div>

                                <div className="col-span-1 font-medium">Created at:</div>
                                <div className="col-span-3">{new Date(selectedReport.createdAt).toLocaleDateString('vi-VN')}</div>

                                <div className="col-span-1 font-medium">Updated at:</div>
                                <div className="col-span-3">{new Date(selectedReport.updatedAt).toLocaleDateString('vi-VN')}</div>

                                <div className="col-span-1 font-medium">Status:</div>
                                <div className="col-span-3">
                                    <Badge
                                        variant={
                                            selectedReport.status === "PENDING"
                                                ? "default"
                                                : "outline"
                                        }
                                    >
                                        {selectedReport.status === "PENDING"
                                            ? "Pending"
                                            : "Resolved"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Phần ghi chú */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Notes</h3>
                                <Separator />

                                {/* Form thêm ghi chú mới */}
                                <div className="space-y-2">
                                    <Label htmlFor="admin-note">Note</Label>
                                    <Textarea
                                        id="admin-note"
                                        defaultValue={selectedReport.note || ""}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        placeholder="Enter admin note about this report..."
                                        className="min-h-[100px]"
                                    />
                                    <Button onClick={() => handleSaveNote(selectedReport.id)}
                                        disabled={!adminNote.trim() || isAddingNote}

                                        className="w-full">
                                        {isAddingNote ? "Adding..." : "Save note"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        {selectedReport && (
                            <div className="flex flex-wrap gap-2">
                                {selectedReport.status === "pending" && (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                handleReportAction(selectedReport.id, selectedReport.commentId ? "comment" : "post", "reject")
                                                setDetailsDialogOpen(false)
                                            }}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                handleReportAction(selectedReport.id, selectedReport.commentId ? "comment" : "post", "accept")
                                                setDetailsDialogOpen(false)
                                            }}
                                        >
                                            Accept
                                        </Button>
                                    </>
                                )}
                                <Button
                                    variant={selectedReport.resolved ? "outline" : "default"}
                                    onClick={() => handleMarkResolved(selectedReport.id, selectedReport.status === 'PENDING' ? 'RESOLVED' : 'PENDING')}
                                >
                                    {selectedReport.status === 'PENDING' ? "Mark resolved" : "Mark Unresolved"}
                                </Button>
                                <Button variant="destructive" onClick={() => handleDeleteReport(selectedReport.id)}>
                                    Delete Report
                                </Button>
                                <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
