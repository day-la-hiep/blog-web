import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { fa } from "@faker-js/faker";
import { boolean } from "zod";
import { useNavigate } from "react-router-dom";
import { adminDashboardPath, adminLoginPath } from "@/RouteDefinition";


type AuthValue = {
    token: string,
    auth: Function,
    verifyToken: Function,
    tokenInfo: any
}

const AuthContext = createContext<AuthValue>({
    token: "",
    auth: () => { },
    verifyToken: Function,
    tokenInfo: null
});
const baseUrl = "http://localhost:8080"
interface AuthProviderProps {
    children: ReactNode
}
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "")
    const tokenInfo = useRef(null)
    useEffect(() => {
        verifyToken()
    }, [token])

    const auth = useCallback(async (username: string, password: string) => {
        try {
            const response = await fetch(`${baseUrl}/api/auth/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
            const res = await response.json()

            if (res.result.authenticated == true) {
                localStorage.setItem("token", res.result.token)
                alert(res.result.token)
                setToken(res.result.token)
                tokenInfo.current = getTokenInfo(res.result.token)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }

    }, [])


    const verifyToken = useCallback(async () => {
        if (localStorage.getItem("token") != "") {
            try {
                const response = await fetch(`${baseUrl}/api/auth/introspect`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: localStorage.getItem("token")
                    })
                })
                const res = await response.json()
                const valid = res.result.valid
                if (valid == false) {
                    localStorage.setItem("token", "")
                } else {
                    tokenInfo.current = getTokenInfo(token)
                }
            } catch (e) {
            } finally {
            }
        } else {
            console.log("Token not found")
        }
    }, [token])



    return (
        <AuthContext.Provider value={{ token, auth,  verifyToken, tokenInfo}}>
            {children}
        </AuthContext.Provider>
    )


}
const getTokenInfo = (token: string) => {
    const payload = token.split(".")[1]
    const decodedPayload = atob(payload)
    const jsonPayload = JSON.parse(decodedPayload)
    return jsonPayload
}
const getUserNameFromToken = (token: string) => {
    try {
        const decoded = jwtDecode(token)
        return decoded.sub;
    } catch (error) {
        console.error('Invalid token or error decoding:', error);
        return null;
    }
};

const useAuthService = () => {
    return useContext(AuthContext)
}
export {
    useAuthService,
    AuthProvider
}