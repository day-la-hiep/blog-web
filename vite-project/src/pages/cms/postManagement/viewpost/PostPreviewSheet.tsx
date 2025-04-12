import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Ban, CircleCheckBig, CircleHelp, Edit, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Post } from "@/type/Post";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import MarkdownEditor from "@/components/ui/MarkDownEditor";
import MarkdownPreview from "@/components/ui/MarkdownPreview";
interface PostEditSheetProps {
    open: boolean
    onClose: () => void
    post?: Post
}
const PostPreviewSheet: React.FC<PostEditSheetProps> = ({ open, post, onClose }) => {
    const navigate = useNavigate()
    return (
        <Sheet open={open} onOpenChange={onClose} >
            <SheetTitle></SheetTitle>
            <SheetContent
                className="min-w-[800px] gap-0 flex flex-col items-center px-5"
                side="right"
            >
                <SheetHeader className="self-start">
                    <div className="flex gap-5 w-full">
                        <Label className="text-2xl"> Post Preview</Label>
                        <Button onClick={() => {
                            navigate(`${post?.id}`)
                        }}> <Edit></Edit></Button>
                    </div>
                </SheetHeader>
                <div className="grow px-5 overflow-auto flex flex-col w-full">
                    <MarkdownPreview content={post ? post.content : ''} />
                </div>
                <SheetFooter >
                    <div className="flex gap-5 justify-center" >
                        <SheetTrigger>
                            <Button size={"lg"}> <CircleCheckBig></CircleCheckBig></Button>
                        </SheetTrigger>
                        <SheetTrigger>
                            <Button size={"lg"}> <Ban></Ban></Button>
                        </SheetTrigger>
                    </div>
                </SheetFooter>
            </SheetContent>
            <SheetDescription> </SheetDescription>
        </Sheet>
    )
}

export default PostPreviewSheet