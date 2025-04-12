import { Label } from "@/components/ui/label";

export default function SideBar() {
    return (
        <div className="flex flex-col gap-5 pt-10">
            <div>
                <Label className="text-2xl">Staff pick</Label>
            </div>
            <div className="gap-5 flex flex-col">
                <SmallArticle />
                {[...Array(10)].map((_, index) => (
                    <SmallArticle key={index} />
                ))}
            </div>
        </div>
    )
}

function SmallArticle() {
    return (
        <div className="flex items-start space-x-3">
            {/* Content */}
            <div className="flex flex-col">
                <p className="text-xs text-gray-500 truncate">
                    In The Medium Blog by The Medium Newsletter
                </p>
                <h2 className="text-sm font-bold">Why writing is just like running</h2>
                <p className="text-xs text-gray-500">1d ago</p>
            </div>
        </div>
    )
}