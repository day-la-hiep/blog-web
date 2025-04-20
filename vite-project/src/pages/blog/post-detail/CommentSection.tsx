import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CommentSectionProps {
}

const CommentSection: React.FC<CommentSectionProps> = () => {
    return (
        <div className="w-full flex flex-col gap-5">
            <Label className="text-2xl font-semibold">Comments</Label>
            <Input placeholder="Share your thoughts..." className="w-full" />
            <div className="flex justify-end">
                <Button>Post Comment</Button>
            </div>
        </div>
    )
}

export default CommentSection