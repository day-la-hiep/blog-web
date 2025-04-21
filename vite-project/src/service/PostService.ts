import { Category } from "./CategoryService"

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
export type createPostRequest = {
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
export async function fetchPostByCategories(
    page: number = 0,  
    limit: number = 10,
    categorySlug: string,
) {
    const url = `http://localhost:8080/api/categories/${categorySlug}/articles?page=${page}&size=${limit}`;
    const response = await fetch(url, {
        method: "GET"
    })
    if (!response.ok) {
        throw new Error(`Error fetching posts: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if(data.code != 1000){
        throw new Error(`Error fetching posts: ${data}`);
    }
    return data.result
}


export async function fetchPosts(
    page: number,
    pageSize: number,
    sortParam?: SortParam,
    filterParam?: PostFilter,
) {
    let url = new URL(`http://localhost:8080/api/articles`);
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

    appendParam("page", page.toString());
    appendParam("size", pageSize.toString());

    if(sortParam){
        appendParam("sortDirection", sortParam.sortDirection);
        appendParam("sortProperty", sortParam.sortProperty);
    }
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
    console.log("Fetch posts URL " + url)

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
        },
    });

    const res = await response.json();
    return res.result;
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

export async function deletePost(articleId: string) {
    const token = localStorage.getItem('token')
    const url = `http://localhost:8080/api/articles/${articleId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const res = await response.json()
    return res
}

export async function uploadPostThumbnail(articleId: string, file: File): Promise<any> {
    const token = localStorage.getItem('token')

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`http://localhost:8080/api/articles/${articleId}/thumbnail`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    return await response.json();
}

export async function uploadPostImage(articleId : string, file : File) : Promise<any>{
    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(`http://localhost:8080/api/articles/${articleId}/images`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    return await response.json();
}


export async function createPost(postForm: PostForm) {
    const token = localStorage.getItem("token")
    const url = "http://localhost:8080/api/articles";
    const data = {
        title: postForm.title,
        summary: postForm.summary,
        content: postForm.content,
        status: "DRAFT",
        categories: postForm.categories,
        thumbNailUrl: "https://example.com/image.jpg"
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const apiResponse = await response.json();
        return apiResponse.result
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function fetchPost( articleId: number) {
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
export async function updatePost(id: String, oldValue: Post, newValue: PostForm, token: string) {
    const response = await fetch(`http://localhost:8080/api/articles/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            ...oldValue,
            ...newValue
        })
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
}
