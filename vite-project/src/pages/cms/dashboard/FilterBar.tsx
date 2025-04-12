import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem,  SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/DatePicker";

export default function FilterBar() {
    return (
        <div className="flex gap-5 justify-between w-full items-center">
            <div className="flex gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-xs">Start date:</label>
                    <DatePicker />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs">End date:</label>
                    <DatePicker />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs">Status:</label>
                    <Select>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"publish"}> Publish </SelectItem>
                            <SelectItem value={"pending"}> Pending </SelectItem>
                            <SelectItem value={"hold"}> Hold </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <Button> <Filter></Filter> </Button>
            </div>

        </div>
    )
}