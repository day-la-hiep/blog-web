import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Post } from "@/service/PostService";
import { Bookmark, MoreHorizontal } from "lucide-react";
interface ArticleCardProps {
    post?: Post
}
const ArticleCard: React.FC<ArticleCardProps> = function ArticleCard({ post }) {
    return (
        <Card className="flex items-start p-4 border rounded-lg shadow-sm w-full">
            <div className="flex justify-between w-full gap-5">
                <div className="flex-1 space-y-2">
                    <p className="text-sm text-gray-500">
                        By <span className="font-medium">{post?.authorName}</span>
                    </p>
                    <h2 className="text-lg font-bold">
                        {post?.title}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {post?.summary}
                    </p>

                    <div className="flex items-center space-x-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                            <span>Dec 17, 2024</span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                            <Bookmark className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
                <div className="content-end items-center">
                    <img
                        src="https://gcs.tripi.vn/public-tripi/tripi-feed/img/474495Caf/5385458_cover_heheboi.jpg"
                        alt="Article Thumbnail"
                        width={80}
                        height={80}
                        className="h-48 w-60 object-cover rounded-md"
                    />
                </div>
            </div>


        </Card>
    );
}

export default ArticleCard