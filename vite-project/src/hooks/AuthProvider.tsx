import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { fa } from "@faker-js/faker";
import { boolean } from "zod";
import { useNavigate } from "react-router-dom";
import { adminLoginPath } from "@/RouteDefinition";


type AuthValue = {
    isAuthenticated: boolean
    token: string,
    auth: Function,
    username: string,
    verifyToken: Function
}

const AuthContext = createContext<AuthValue>({
    isAuthenticated: false,
    token: "",
    auth: () => { },
    username: "",
    verifyToken: Function,
});
const baseUrl = "http://localhost:8080"
interface AuthProviderProps {
    children: ReactNode
}
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [token, setToken] = useState(localStorage.getItem("token") || "")
    const [username, setUsername] = useState("")
    const navigate = useNavigate()
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
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }

    }, [])


    const verifyToken = useCallback(async (): Promise<boolean> => {

        if (localStorage.getItem("token") != "") {
            try {
                const response = await fetch(`${baseUrl}/api/auth/introspect`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: token
                    })
                })
                const res = await response.json()
                const valid = res.result.valid
                if (valid == false) {
                    navigate(adminLoginPath)
                    setIsAuthenticated(false)
                } else {
                    const username = getUserNameFromToken(token)
                    setIsAuthenticated(true)
                    if (username) {
                        setUsername(username)
                    }
                }
            } catch (e) {
            } finally {
            }
        } else {
            console.log("Token not found")
            navigate(adminLoginPath)
            setIsAuthenticated(false)
        }
        return isAuthenticated
    }, [])



    return (
        <AuthContext.Provider value={{ isAuthenticated, token, auth, username, verifyToken }}>
            {children}
        </AuthContext.Provider>
    )


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