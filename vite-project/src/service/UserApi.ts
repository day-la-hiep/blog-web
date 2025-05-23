import { baseUrl } from "@/utils/AppInfo"
import axios from "axios"
import { Search } from "lucide-react"




export type UserRegisterRequest = {
    fullname: string,
    username: string,
    password: string,
    mail: string,
}

export async function fetchUsers({
    page = 0,
    limit = 10,
    sortBy = 'id',
    searchBy
}: {
    page?: number,
    limit?: number,
    searchBy?: string,
    sortBy?: string

}) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${baseUrl}/users`, {
            params: {
                page: page,
                limit: limit,
                sortBy: sortBy,
                search: searchBy
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (res.data.code === 1000) {
            return res.data.result
        }
        throw error()
    } catch (error) {
        console.error('Error fetch users')
        throw error
    }

}
export async function fetchDetailUser(id: string) {
    try {
        const res = await axios.get(`${baseUrl}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        if (res.data.code === 1000) {
            return res.data.result
        }
        throw Error()
    } catch (error) {
        console.error('Error fetch user')
        throw error
    }
}

export async function updateDetailUser(id: string, data: {
    firstName?: string,
    lastName?: string,
    mail?: string,
    description?: string,
}) {
    try {
        const res = await axios.put(`${baseUrl}/users/${id}`, {
            ...data
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
        console.error('Error update user')
        throw error
    }
}

export async function authenticate(username: string, password: string) {
    const data = axios.post(`${baseUrl}/auth/users`, {

    })
    const url = `${baseUrl}auth/users`
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.result.authenticated) {
                return data.result
            } else {
                throw new Error('Authentication failed')
            }
        })
}

export async function logout() {
    return setTimeout(() => {
        return true
    }
        , 1000)
}

export async function changePassword({
    username = 'me', oldPassword, newPassword
}: {
    username?: string,
    oldPassword: string,
    newPassword: string
}) {
    try {
        const res = await axios.post(`${baseUrl}/users/${username}/password`, {
            oldPassword: oldPassword,
            newPassword: newPassword
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
        console.error('Error change password')
        throw error
    }
}