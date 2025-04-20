import { Label } from "@/components/ui/label"
import { Post } from "@/type/Post"
import ArticleCard from "../home-page/ArticleCard"
import { posts } from '@/FakeData'

interface ArticleRecommendProps {
    // posts: Post[]
}

const ArticleRecommend: React.FC<ArticleRecommendProps> = ({ }) => {
    return (
        <div className="w-full flex flex-col gap-8">
            <h2 className="text-2xl font-semibold">Recommended Articles</h2>
            <div className="grid grid-cols-1 gap-6">
                {posts.slice(0, 3).map((post, index) => (
                    <ArticleCard key={index} post={post} />
                ))}
            </div>
        </div>
    )
}

export default ArticleRecommend