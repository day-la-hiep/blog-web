import { useAuthService } from "@/hooks/AuthProvider"
import { ReactNode, useEffect } from "react"
import { effect } from "zod"

interface AdminRouteProps {
    children: ReactNode
}

const AdminProtectedRoute :React.FC<AdminRouteProps> = (children) => {
    const authService = useAuthService()
    useEffect(() => {
        console.log("Admin protected route rendered")
    }, [])
    
    return (
        <>
            {children}
        </>
    )
} 

export default AdminProtectedRoute