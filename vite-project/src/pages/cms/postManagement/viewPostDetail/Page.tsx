import { Separator } from "@/components/ui/separator";
import TopBar from "./TopBar";
import EditPostComponent from "../EditPostComponent";
import { DatePicker } from "@/components/ui/DatePicker";
import { Post } from "@/type/Post";
import { useNavigate, useParams } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminPostsPath } from "@/RouteDefinition";
import { useEffect } from "react";
import { useAuthService } from "@/hooks/AuthProvider";
interface PageProps {
}

const Page: React.FC<PageProps> = function Page({ }) {
    const navigate = useNavigate()
    const {id} = useParams()
    if(id != 'new-post'){
        
    }
    return (
        <div className="w-full flex flex-col p-5 items-start  h-screen">
            <div className="flex  w-full justify-between items-center">
                <div>
                    <label className="text-3xl"> Edit post </label>

                </div>
                <div className="flex gap-2">
                    <Button onClick={() => {
                        console.log(adminPostsPath)
                        navigate(adminPostsPath)
                    }}>
                        <CircleArrowLeft />
                    </Button>

                </div>
            </div>
            <Separator className="h-3 my-2 w-full" />
            <EditPostComponent  ></EditPostComponent>
        </div>

    )
}



export default Page
