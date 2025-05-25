import { ReactNode, useEffect, useState } from "react"
import { effect } from "zod"
import axios from "axios"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { introspect } from "@/service/AuthApi"
import { useAuth } from "@/hooks/AuthProvider"


const AdminProtectedRoute: React.FC<{}> = () => {
    const { isLoading } = useAuth()

    const { userInfo, token } = useAuth()


    if (isLoading) {
        return <div>Admin Loading </div>
    }
    if (userInfo.role != 'ROLE_ADMIN') {
        return <Navigate to='/' />
    }
    return <Outlet></Outlet>

}

export default AdminProtectedRoute