import { Input } from "@/components/ui/input";
import FilterBar from "./FilterBar";

import OverviewPostInfo from "./OverviewPostInfo";
import { Separator } from "@/components/ui/separator";
import Table from "./Table";
import { useAuthService } from "@/hooks/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { adminLoginPath } from "@/RouteDefinition";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";


// Usage in the PostTable component

export default function DashBoard() {
    console.log("Dash board rendered")

    return (
        <div className="flex flex-col gap-5 p-5 w-full items-center">
            <div className="flex items-center justify-between w-full">
                <div className="text-3xl">Dashboard</div>
                <div>
                    <Input />
                </div>

            </div>
            <Separator className="h-5 w-2xl" />
            <FilterBar />
            <Separator className="h-5 w-2xl" />
            <OverviewPostInfo />
            <Separator className="h-5 w-2xl" />
            <Table></Table>

        </div>
    )
}

