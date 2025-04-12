import { Separator } from "@/components/ui/separator";
import FilterBar from "./FilterBar";
import ViewPostTable from "./ViewPostTable";
import PostPreviewSheet from "./PostPreviewSheet";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { adminPostsPath } from '@/RouteDefinition'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostFilter, deleteArticle, fetchNumberOfPost, fetchPosts, SortParam, updateArticleStatus } from "@/service/PostService";
import { Post } from "@/type/type";




export default function Page() {
    const [previewSheetOpen, setPreviewSheetOpen] = useState(false)
    const [posts, setPosts] = useState<Post[]>([])
    const [currentPost, setCurrentPost] = useState<Post>()
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [numberOfPage, setNumberOfPage] = useState(0)
    const [sortParam, setSortParam] = useState<SortParam>({
        "sortProperty": "id",
        "sortDirection": "asc",
    })
    const [filterParam, setFilterParam] = useState<PostFilter>()

    const nextPage = () => {
        if (page + 1 < numberOfPage) {
            setPage(page + 1)
        }
    }

    const prevPage = () => {
        if (page - 1 >= 0) {
            setPage(page - 1)
        }
    }

    const onFilterClicked = (filterParam: PostFilter) => {
        setFilterParam(filterParam)
    }

    useEffect(() => {
        updatePostData(page, pageSize, sortParam, filterParam)
    }, [filterParam, sortParam, pageSize, page])
    const updatePostData = useCallback(async (page: number, pageSize: number,
        sortParam: SortParam, filterParam?: PostFilter) => {
        fetchPosts(page, pageSize, sortParam, filterParam).then(
            (data) => setPosts(data)
        )
    }, [])


    useEffect(() => { updatePagePagination(pageSize, filterParam) }, [pageSize, filterParam])
    const updatePagePagination = useCallback(async function updatePagePagination(pageSize: number,
        filterParam?: PostFilter
    ) {
        fetchNumberOfPost(filterParam).then((postCount) => {
            console.log(postCount)
            const newPageNumber = Math.ceil(postCount / pageSize)
            setNumberOfPage(newPageNumber)
            if (page < 0) {
                setPage(0)
            }
            if (page > newPageNumber - 1) {
                setPage(Math.max(0, newPageNumber - 1))
            }
        })
    }, [])
    return (
        <div className="w-full h-dvh overflow-hidden" >
            <PostPreviewSheet post={currentPost} open={previewSheetOpen} onClose={() => { setPreviewSheetOpen(false) }} ></PostPreviewSheet>

            <div className="flex flex-col gap-5 p-5 w-full h-dvh">
                {/* // top bar */}
                <div>
                    <div className="flex justify-between items-center">
                        <div>
                            <Label className="text-3xl"> View post </Label>
                        </div>
                        <div>
                            <NavLink to={adminPostsPath + "/new-post"} end>
                                <Button><FolderPlus></FolderPlus></Button>
                            </NavLink>

                        </div>
                    </div>
                </div>
                <FilterBar onFilterClicked={(filterParam) => {
                    onFilterClicked(filterParam)
                }}></FilterBar>
                <Separator className="my-1"></Separator>
                {/* // Table */}
                <div className="overflow-hidden flex flex-col">
                    <ViewPostTable data={posts} handleSheetPreviewClicked={(post: Post) => {
                        setPreviewSheetOpen(true)
                        setCurrentPost(post)
                    }}
                        handleSortData={(sortProperty, sortDirection) => {
                            setSortParam({
                                sortProperty: sortProperty,
                                sortDirection: sortDirection,
                            })
                        }}
                        handleDeletePost={(id) => {
                            deleteArticle(id).then((res) => {
                                if (res.code == 1000) {
                                    const update = async () => {
                                        await updatePagePagination(pageSize, filterParam)
                                        await updatePostData(page, pageSize, sortParam, filterParam)
                                    }
                                    update().catch(console.error)

                                }
                            })
                        }}
                        handleUpdatePostStatus={async (id: string, status: string) => {
                            const updateSuccess = await updateArticleStatus(id, status)
                            return updateSuccess
                        }}
                    />
                </div>
                {/* // Pagination option */}
                <div className="flex items-center justify-between px-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${pageSize}`}
                                onValueChange={(value) => {
                                    setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                            Page {page + 1} of{" "} {numberOfPage}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => setPage(0)}
                                disabled={numberOfPage == 0}
                            >
                                <span className="sr-only">Go to first page</span>
                                <ChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={prevPage}
                                disabled={page <= 0}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                disabled={page >= numberOfPage - 1}
                                onClick={nextPage}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => setPage(numberOfPage - 1)}
                                disabled={numberOfPage == 0}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}




