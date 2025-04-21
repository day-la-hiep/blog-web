import { Button } from "@/components/ui/button"
import { useAuthService } from "@/hooks/AuthProvider"
import { Children, createContext, ReactNode } from "react"

interface HomePageRoutes{
    children: ReactNode
}
const HomePageRoutes : React.FC<HomePageRoutes> = ({children}) => {
    return (
        <>
            {children}
        </>
    )
}
export default HomePageRoutes