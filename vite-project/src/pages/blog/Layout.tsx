import { Outlet, useSearchParams } from "react-router-dom"
import Header from "./Header"
import { Separator } from "@/components/ui/separator"
import HomePageRoutes from "@/routes/HomePageRoutes"
import { Button } from "@/components/ui/button"

const Layout = () => {

    return (
        <>
            <div className="flex flex-col h-dvh overflow-hidden">
                <div className="bg-white relative top-0 left-0">
                    <Header />
                    <Separator></Separator>
                    
                </div>
                
                <div className="overflow-auto items-center flex flex-col">
                    <Outlet />
                </div>
            </div>
        </>


    )
}

export default Layout