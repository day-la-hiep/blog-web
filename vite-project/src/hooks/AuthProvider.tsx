import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { authenticate, verifyToken } from "@/service/UserService";
import { boolean } from "zod";



interface TokenInfo {
    iss: string;       // issuer
    sub: string;       // subject (username, userid…)
    exp: number;       // expiration time (UNIX timestamp)
    iat: number;       // issued-at time (UNIX timestamp)
    scope: string;     // ví dụ: "ROLE_USER ROLE_ADMIN"
}
export function getTokenInfo(token: string): TokenInfo {
    return jwtDecode<TokenInfo>(token);
}
interface UserInfo {
    username: string,
    scope: string[]
}
type AuthValue = {
    token: string,
    auth: (username : string, password : string) => Promise<boolean | null>,
    logout: Function,
    userInfo: UserInfo | null
}
const AuthContext = createContext<AuthValue>({
    token: "",
    auth: () => Promise.resolve(null),
    logout: () => {},
    userInfo: null
});
interface AuthProviderProps {
    children: ReactNode
}
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "")
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    useEffect(() => {

        if (token !== "") {
            verifyToken(token).then((res) => {
                if (res.valid == false) {
                    localStorage.removeItem("token")
                    setToken("")
                } else {
                    localStorage.setItem("token", token)
                    const tokenInfo = getTokenInfo(token)
                    setUserInfo({
                        username: tokenInfo.sub,
                        scope: tokenInfo.scope.split(" ")
                    })
                }
            })
        }
    }, [token])

    const auth = useCallback(async (username: string, password: string) => {
        try {
            const result = await authenticate(username, password)
            if(result.authenticated == true){
                localStorage.setItem("token", result.token)
                setToken(result.token)
            }
            return result.authenticated

        } catch (error) {
            console.error("Error fetching data:", error);
            return false;
        }

    }, [])
    const logout = useCallback(() => {
        localStorage.removeItem("token")
        setToken("")
        setUserInfo(null)
        setToken("")
    }, [])





    return (
        <AuthContext.Provider value={{ token, auth,  logout, userInfo }}>
            {children}
        </AuthContext.Provider>
    )


}





const useAuthService = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        console.error('Missing auth provider when using useAuthService')
    }
    return context
}
export {
    useAuthService,
    AuthProvider
}