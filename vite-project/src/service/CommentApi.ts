import { baseUrl } from "@/utils/AppInfo";
import axios from "axios";

export async function fetchCommentsByArticle(aritcleId: string, {
    page = 0,
    limit = 10,
    sortBy = '-createdAt',
    search
}: {
    page?: number,
    limit?: number,
    sortBy?: string,
    search?: string
}): Promise<{
    page: number,
    limit: number,
    sortBy: string,
    totalPages: number,
    totalItems: number,
    items: {
        id: string,
        content: string,
        parentArticleId: string,
        authorUsername: string,
        author: string,
        createdAt: string
    }[]
}> {
    try {
        const res = await axios.get(`${baseUrl}/public/articles/${aritcleId}/comments`, {
            params: {
                page: page,
                limit: limit,
                sortBy: sortBy,
                search: search
            },

        })
        if (res.data.code === 1000) {
            return res.data.result
        }
        throw Error()
    } catch (error) {
        console.error('Error fetching comments')
        throw error
    }

}
export async function deleteComment(commentId: string): Promise<boolean> {
    try {
        const res = await axios.delete(`${baseUrl}/comments/${commentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        if (res.data.code === 1000) {
            return true
        }
        throw Error()
    } catch (error) {
        console.error('Error deleting comment')
        throw error
    }
}
export async function fetchComments({
    page = 0,
    limit = 10,
    sortBy = 'id',
    search,
    startDate,
    endDate
}: {
    page?: number,
    limit?: number,
    sortBy?: string,
    search?: string,
    startDate?: string,
    endDate?: string
}) {
    try {
        const res = await axios.get(`${baseUrl}/comments`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: {
                page: page,
                limit: limit,
                sortBy: sortBy,
                search: search,
                startDate: startDate ? new Date(startDate).toISOString().replace(/Z$/, '') : undefined,
                endDate: endDate ? new Date(endDate).toISOString().replace(/Z$/, '') : undefined
            }
        })
        if (res.data.code === 1000) {
            return res.data.result
        }
        throw Error()
    } catch (error) {
        console.error('Error fetching comment')
        throw error
    }
}

export async function createComment(aritcleId: string, content: string): Promise<{
    id: string,
    content: string,
    parentArticleId: string,
    authorUsername: string,
    author: string,
    createdAt: string
}> {
    try {
        const res = await axios.post(`${baseUrl}/articles/${aritcleId}/comments`, {
            content: content
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        if (res.data.code === 1000) {
            return res.data.result
        }
        throw Error()
    } catch (error) {
        console.error('Error fetching comment')
        throw error
    }
}

export async function updateComment(commentId: string, content: string, token: string) {
    try {
        const res = await axios.put(
            `${baseUrl}/comments/${commentId}`,
            { content },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        )
        if (res.data.code === 1000) {
            return res.data.result
        }
        throw Error()
    } catch (error) {
        console.error('Error updating comment')
        throw error
    }
}

