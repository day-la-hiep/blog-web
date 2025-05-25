import { getTokenInfo, introspect, login } from "@/service/AuthApi";
import { useContext, createContext, useState, ReactNode, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
type UserInfo = {
    username: string,
    role: 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_MODERATOR' | 'GUEST'
}
const AuthContext = createContext<{
    userInfo: UserInfo
    token: string,
    loginAction: (username: string, password: string) => Promise<boolean>,
    logout: () => void,
    verifyToken: () => Promise<boolean>,
    isLoading: boolean
}>();

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        verifyToken()
    }, [])
    const initUserInfo: UserInfo = {
        username: '',
        role: 'GUEST'
    }
    const [token, setToken] = useState("");
    const [userInfo, setUserInfo] = useState<UserInfo>(initUserInfo)
    const navigate = useNavigate();
    const loginAction = async (username: string, password: string) => {
        try {
            const res = await login(username, password)
            if (res) {
                setToken(res.token);
                localStorage.setItem("token", res.token);
                const tokenInfo = getTokenInfo(res.token)
                const userInfo: UserInfo = {
                    username: tokenInfo.sub,
                    role: tokenInfo.scope
                }
                setUserInfo(userInfo)
                return res.authenticated
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };
    const logout = () => {
        setToken("");
        localStorage.removeItem("token");
        setUserInfo(initUserInfo)
    };

    const verifyToken = async () => {
        setIsLoading(true)
        const token = localStorage.getItem('token') || ''
        const res = await introspect(token)
        if (res.valid) {
            const tokenInfo = getTokenInfo(token)
            const userInfo: UserInfo = {
                username: tokenInfo.sub,
                role: tokenInfo.scope
            }
            setToken(token)
            setUserInfo(userInfo)
        } else {
            setToken('')
            setUserInfo(initUserInfo)
            localStorage.removeItem('token')
        }
        setIsLoading(false)
        return res.valid
    }


    const value = { userInfo, token, loginAction, logout, verifyToken, isLoading }



    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );


};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
