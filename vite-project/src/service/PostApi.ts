import { baseUrl } from "@/utils/AppInfo"
import { Category } from "./CategoryApi"
import axios from "axios"
// {
//     id: "1",
//     title: "Getting Started with Next.js Next.js Next.js",
//     summary: "Learn the basics of Next.js and how to get started with your first project. Learn the basics of Next.js and how to get started with your first project.",
//     author: "John Doe",
//     authorAvatar: "/placeholder.svg?height=40&width=40",
//     date: "2023-05-15",
//     readTime: "5 min",
//     category: "Programming",
//     thumbnail: "/placeholder.svg?height=200&width=400",
//   },
export type Post = {
    id: string
    title: string
    thumbnail: string
    summary: string
    authorName: string
    status: string

}
export type PostForm = {
    title: string,
    summary: string,
    content: string,
    categories: Category[],
    thumbnailUrl: string,
}

export type PostFilter = {
    username?: string;
    page?: number;
    size?: number;
    sortProperty?: string;
    sortDirection?: string;
    title?: string;
    textOrId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    authorName?: string;
}
export type SortParam = {
    sortProperty: string,
    sortDirection: string,
}

export async function fetchNumberOfPost(
    filterParam?: PostFilter,
) {
    console.log(JSON.stringify(filterParam))
    const token = localStorage.getItem("token");
    let url = new URL(`http://localhost:8080/api/articles/count`);
    let params = new URLSearchParams();

    const appendParam = (key: string, value?: string) => {
        if (value && value.trim() !== "") {
            params.append(key, value);
        }
    };

    const formatDate = (d: Date, endOfDay = false) => {
        if (endOfDay) {
            d.setHours(23, 59, 59)
        } else {
            d.setHours(0, 0, 0);
        }
        return d.toLocaleString("sv-SE").replace(" ", "T")
    };

    if (filterParam) {
        appendParam("startDate", filterParam.startDate ? formatDate(filterParam.startDate, false) : "");
        appendParam("endDate", filterParam.endDate ? formatDate(filterParam.endDate, true) : "");
        appendParam("title", filterParam.textOrId);
        appendParam("id", filterParam.textOrId);
        appendParam("status", filterParam.status?.toLowerCase());
        appendParam("authorName", filterParam.authorName?.toLowerCase());
    }


    if (params.toString()) {
        url.search = params.toString();
    }

    url.search = params.toString()
    console.log("Fetch post count URL " + url)
    console.log("Fetch post count URL params " + params.toString())

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const res = await response.json();
    return res.result;
}

export async function fetchPublicPosts(
    page: number = 0,
    limit: number = 10,
    search?: string,
    sortBy: string = 'title'
) {
    try {
        const res = await axios.get(`${baseUrl}/public/articles`, {
            params: {
                page: page,
                limit: limit,
                search: search,
                sortBy: sortBy
            }
        })
        const data = res.data
        if (data.code !== 1000) {
            throw Error
        }
        return data.result
    } catch (Error) {
        console.error("Error fetch publics")
    }
}
export async function fetchPublicPostsByCategories(
    categorySlug: string,
    page: number = 0,
    limit: number = 10,
    search?: string,
    sortBy: string = "title"

) {
    try {
        const res = await axios.get(`${baseUrl}/public/categories/${categorySlug}/articles`, {
            params: {
                slug: categorySlug,
                page: page,
                limit: limit,
                search: search,
                sortBy: sortBy

            }
        })
        const data = res.data
        if (data.code !== 1000) {
            throw Error
        }
        return data.result

    } catch (err) {
        console.log("Error fetch posts by categories")
    }
}



export async function updateArticleStatus(
    articleId: string,
    newStatus: string,
): Promise<any> {
    const token = localStorage.getItem("token");
    const url = `http://localhost:8080/api/articles/${articleId}`;
    const articleWithNewStatus = {
        "status": newStatus,
    }

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(articleWithNewStatus),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update article: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.result;
}

export async function deletePost(
    postId: string,
) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.delete(`${baseUrl}/articles/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (res.data.code == 1000) {
            return res.data.result
        }
        throw Error()
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}

export async function uploadPostThumbnail(articleId: string, file: File): Promise<any> {
    try {

        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post(`${baseUrl}/articles/${articleId}/thumbnail`, formData, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        })
        if (res.data.code == 1000) {
            return res.data.result
        }
        throw new Error("Error uploading thumbnail")
    } catch (error) {
        console.error("Error uploading thumbnail:", error);
        throw error;
    }

}

export async function uploadPostImage(articleId: string, file: File): Promise<any> {
    try {
        const token = localStorage.getItem('token')

        const formData = new FormData()
        formData.append('file', file)
        const res = await axios.post(`${baseUrl}/articles/${articleId}/images`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        })

        if (res.data.code == 1000) {
            return res.data.result
        }
        throw new Error("Error uploading image")
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }

    return await response.json();
}




export async function fetchPost(articleId: number) {
    const token = localStorage.getItem("token")
    const url = `http://localhost:8080/api/articles/${articleId}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiRes = await response.json();

        return apiRes.result
    } catch (error) {
        console.error("Error fetching article:", error);
    }
}

export async function fetchPosts({
    page = 0,
    limit = 10,
    sortBy = 'id',
    search,
    status,
    approvedStatus,
    fromDate,
    toDate,
}: {
    fromDate?: Date,
    toDate?: Date,
    page?: number,
    limit?: number,
    sortBy?: string,
    search?: string,
    status?: string,
    approvedStatus?: string
}) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${baseUrl}/articles`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                startDate: fromDate,
                endDate: toDate,
                page: page,
                limit: limit,
                sortBy: sortBy,
                search: search,
                status: status,
                approvedStatus: approvedStatus
            }

        })
        if (res.data.code == 1000) {
            return res.data.result
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}
export async function acceptPost(postId: string) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.post(`${baseUrl}/articles/${postId}/accept`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (res.data.code == 1000 && res.status == 200) {
            return res.data.result
        }
    } catch (error) {
        console.error("Cant accepted posts")
        throw error
    }
}

export async function unacceptPost(postId: string) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.post(`${baseUrl}/articles/${postId}/unaccept`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (res.data.code == 1000 && res.status == 200) {
            return res.data.result
        }
    } catch (error) {
        console.error("Cant accepted posts")
        throw error
    }
}

export async function rejectPost(postId: string) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.post(`${baseUrl}/articles/${postId}/reject`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (res.data.code == 1000 && res.status == 200) {
            return res.data.result
        }
    } catch (error) {
        console.error("Cant accepted posts")
        throw error
    }
}
export async function fetchDetailPage(
    postId: string) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${baseUrl}/articles/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (res.data.code == 1000) {
            return res.data.result
        }
        throw new Error("Error fetching post detail")
    } catch (error) {
        console.error("Error fetching post detail:", error);
        throw error;
    }
}
export async function createPost({
    title,
    name,
    summary,
    content,
    categoryIds
}:
    {
        title: string,
        name: string,
        summary: string,
        content: string,
        categoryIds: string[]
    }
) {
    const token = localStorage.getItem('token')
    const res = await axios.post(`${baseUrl}/articles`, {
        title: title,
        name: name,
        summary: summary,
        content: content,
        categories: categoryIds
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    if (res.data.code == 1000) {
        return res.data.result
    }
    throw Error()
}


export async function updatePost(
    postId: string,
    {
        title,
        name,
        summary,
        content,
        categoryIds
    }: {
        title: string,
        name: string,
        summary: string,
        content: string,
        categoryIds: string[]
    }
) {
    const res = await axios.put(`${baseUrl}/articles/${postId}`, {
        title: title,
        name: name,
        summary: summary,
        content: content,
        categoryIds: categoryIds
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
    if (res.data.code == 1000) {
        return res.data.result
    }
}

export async function submitForApproval(postId: string) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.post(`${baseUrl}/articles/${postId}/submit`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (res.data.code == 1000) {
            return res.data.result
        }
        throw Error()
    } catch (error) {
        console.error("Error submitting post for approval:", error);
        throw error;
    }

}

export async function unsubmitPost(postId: string) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.post(`${baseUrl}/articles/${postId}/unsubmit`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (res.data.code == 1000) {
            return res.data.result
        }
        throw Error()
    } catch (error) {
        console.error("Error unsubmit post for approval:", error);
        throw error;
    }
}

export async function fetchPublicDetailPost(postId: string): Promise<{
    id: string,
    title: string,
    content: string,
    authorName: string,
    status: string,
    lastUpdatedAt: string,
    publishedDate: string,
    thumbnailUrl: string
}> {
    try {
        const res = await axios.get(`${baseUrl}/public/articles/${postId}`)
        if (res.data.code == 1000) {
            return res.data.result
        }
        throw Error("Error fetching post detail")
    } catch (error) {
        console.error("Error fetching post detail:", error);
        throw error;
    }
}

export async function fetchPostsByUsername(
    username: string,
    {
        page = 0,
        limit = 10,
        search = '',
        sortBy = 'id',
        status,
        approvedStatus
    }: {
        page?: number,
        limit?: number,
        search?: string,
        sortBy?: string,
        status?: string,
        approvedStatus?: string
    }

) {
    try {
        const res = await axios.get(`${baseUrl}/users/${username}/articles`, {
            params: {
                page: page,
                limit: limit,
                search: search,
                sortBy: sortBy,
                status: status,
                approvedStatus: approvedStatus
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        const data = res.data
        if (data.code !== 1000) {
            throw Error
        }
        return data.result
    } catch (Error) {
        console.error("Error fetch my posts")
    }
}

