import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/AuthProvider"
import { Children, createContext, ReactNode, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"

interface HomePageRoutes {
    children: ReactNode
}
const HomePageRoutes: React.FC<HomePageRoutes> = ({ children }) => {
    const { userInfo, isLoading} = useAuth();
    // Các route cá nhân cần bảo vệ

    const personalPaths = [
        "/profile",
        "/library",
        "/my-posts",
        "/edit-posts"
    ];
    const currentPath = window.location.pathname;
    if (isLoading) {
        return <div>Loading...</div>
    } else {
        // Nếu là guest và truy cập route cá nhân thì chuyển hướng về trang chủ
        if (userInfo.role === 'GUEST' && personalPaths.some(p => currentPath.startsWith(p))) {
            return <Navigate to="/" replace />;
        }
        return <>{children}</>;
    }

}
export default HomePageRoutes