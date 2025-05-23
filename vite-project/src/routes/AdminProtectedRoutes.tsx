import { ReactNode, useEffect, useState } from "react"
import { effect } from "zod"
import axios from "axios"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { introspect } from "@/service/AuthApi"
import { useAuth } from "@/hooks/AuthProvider"


const AdminProtectedRoute: React.FC<{}> = () => {
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)
    const { userInfo, token, verifyToken } = useAuth()
    useEffect(() => {
        const action = async () => {
            await verifyToken()
            setIsAuthenticating(false)
        }
        action()
    }, [token])

    if (isAuthenticating) {
        return <div> Loading </div>
    }
    if (userInfo.role != 'ROLE_ADMIN') {
        return <Navigate to='/admin/login' />
    }
    return <Outlet></Outlet>

}

export default AdminProtectedRoute