import { Label } from "@/components/ui/label";
import Header from "../Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ArticleList from "./ArticleList";
import SideBar from "./HomePageSidebar";
import { useSearchParams } from "react-router-dom";

export default function MainContent() {
    return (
        <div className="flex flex-col items-center max-w-1/2">
            <div className="flex gap-5">
                <div className="flex-2">
                    <ArticleList />
                </div>
                <div className="flex-1">
                    <SideBar />
                </div>
            </div>
        </div>
    )
}   