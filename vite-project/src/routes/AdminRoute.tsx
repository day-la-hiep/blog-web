import { useAuth } from "@/hooks/AuthProvider"
import { Navigate } from "react-router-dom"


const AdminRoute = () => {
    const auth = useAuth()
    if (auth.userInfo.role == 'ROLE_ADMIN') {
        return <Navigate to='/admin/posts' />
    }
    return <Navigate to='/admin/login' />
}
export default AdminRoute