import { baseUrl } from "@/utils/AppInfo"
import axios from "axios"

type TokenInfo = {
    iss: string,
    sub: string,
    iat: number,
    scope: 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_MODERATOR',
}
export const introspect = async (token: string) => {
    try {
        const res =  await axios.post(`${baseUrl}/auth/introspect`, {
            token: token
        })
        return res.data.result
    } catch (error) {
        console.log("Verify token unsuccessfully")
    }
}

export const login = async (username: string, password: string) => {
    try {
        const res = await axios.post(`${baseUrl}/auth/users`, 
            {
                username: username,
                password: password
            },
        )
        return res.data.result
    } catch (error) {
        console.log("Lỗi khi đăng nhập")
    }
}

export const getTokenInfo = (token : string) : TokenInfo => {
    const payload = token.split(".")[1]
    const decodedPayload = atob(payload)
    const jsonPayload = JSON.parse(decodedPayload)
    return jsonPayload
}
