import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopBar(){
    const navigate = useNavigate()
    return (
        <div className="flex justify-between items-center">
            <div>
                <Label className="text-3xl"> View post </Label>
            </div>
            <div>
                <Button onClick={() => {
                    navigate("/admin/post-management/add-post")
                }}><FolderPlus></FolderPlus></Button>
            </div>
        </div>
    )
}