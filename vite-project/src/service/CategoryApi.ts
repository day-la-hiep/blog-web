import { baseUrl } from "@/utils/AppInfo";
import axios from "axios";
import { Trophy } from "lucide-react";
import { ac } from "node_modules/@faker-js/faker/dist/airline-CBNP41sR";




export async function fetchPublicCategories(
    page: number = 0,
    limit: number = 10,
    sortBy: string = "name",
    search?: string,
) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${baseUrl}/public/categories`, {
            params: {
                page: page,
                limit: limit,
                sortBy: sortBy,
                search: search,
            }
        })

        return res.data.result;
    } catch (error) {
        console.log("Fetch categories error")
    }
}

export async function fetchCategories({
    page = 0,
    limit = 10,
    sortBy = "id",
    search,
    active,
}: {
    page: number
    limit: number
    sortBy?: string
    search?: string
        active?: boolean,
}
) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${baseUrl}/categories`, {
            params: {
                page: page,
                limit: limit,
                sortBy: sortBy,
                search: search,
                active: active,
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (res.data.code === 1000) {
            return res.data.result;
        }
        throw new Error(res.data.message);
    } catch (error) {
        console.log("Fetch categories error")
        throw error;
    }
}
export async function deleteCategory(id: string) {
    try {
        const res = await axios.delete(`${baseUrl}/categories/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (res.data.code === 1000) {
            return res.data.result;
        }
        throw new Error(res.data.message);
    } catch (error) {
        console.log("Delete category error")
        throw error;
    }
}
export async function createCategory({
    name,
    slug,
    description,
    parentId,
    active
}: {
    name: string,
    slug: string,
    description: string,
    parentId?: string,
    active: boolean
}) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.post(`${baseUrl}/categories`, {
            name: name,
            slug: slug,
            description: description
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: function (status) {
                return status < 500; // chấp nhận tất cả status < 500 (kể cả 400)
            }
        })
        if (res.data.code === 1000) {
            return res.data.result;
        }
        throw new Error(res.data.message);
    } catch (error) {
        console.log("Create category error")
        throw error;
    }
}
export async function updateCategory(id: string, {

    name,
    slug,
    description,
    parentId,
    active
}: {
    name: string,
    slug: string,
    description: string,
    parentId?: string,
    active: boolean
}) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.put(`${baseUrl}/categories/${id}`, {
            name: name,
            slug: slug,
            description: description,
            parentId: parentId,
            active: active
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: function (status) {
                return status < 500; // chấp nhận tất cả status < 500 (kể cả 400)
            }
        })
        if (res.data.code === 1000) {
            return res.data.result;
        }
        throw new Error(res.data.message);
    } catch (error) {
        console.log("Update category error: " + error.message)
        throw error;
    }
}
export type Category = {
    name: string,
    slug: string,
    description: string,
};