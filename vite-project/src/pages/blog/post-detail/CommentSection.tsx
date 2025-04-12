import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CommentSectionProps{

}

const CommentSection: React.FC<CommentSectionProps> = () => {
    return (
        <div className="flex flex-col  w-[50vw] gap-5 py-5">
            <Label className="text-2xl place-self-start"> Comment </Label>
            <Input placeholder="Share your comments here"></Input>
            <div className="place-self-end flex">
                <Button size={"sm"}> Send </Button>
            </div>
        </div>
    )
}

export default CommentSection