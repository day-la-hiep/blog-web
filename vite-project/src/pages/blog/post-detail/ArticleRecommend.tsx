import { Label } from "@/components/ui/label"
import { Post } from "@/type/Post"
import ArticleCard from "../home-page/ArticleCard"
import {posts} from '@/FakeData'
interface ArticleRecommendProps {
    // posts: Post[]
}


const ArticleRecommend: React.FC<ArticleRecommendProps> = ({}) => {

    return (
        <div className="container flex flex-col items-center w-[50vw]">
            <h2 className="mb-8 text-2xl font-bold place-self-start">More from Chris Dunlop</h2>
            <div className=" gap-8 sm:grid-cols-1 ">
                {posts.slice(0, 4).map((post, index) => (
                    <ArticleCard key={index} post={post} />
                ))}
            </div>
        </div>
    )
}

export default ArticleRecommend