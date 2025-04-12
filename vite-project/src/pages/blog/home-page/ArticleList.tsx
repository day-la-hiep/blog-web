import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Toggle } from "@/components/ui/toggle"
import { useEffect, useState } from "react"
import { Star, MessageCircle, Eye, Bookmark, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { Category } from "@/type/Category";
import { Post } from "@/type/Post";
import { blogPath } from "@/RouteDefinition";
import { categories, posts } from '@/FakeData'
import ArticleCard from "./ArticleCard";


export default function ArticleList() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [posts, setPosts] = useState<Post[]>()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    useEffect(() => {
        const [categories, setCategories] = useState<Category[]>()
        getCategories().then(categories => {
            setCategories(categories)
        })
    }, [])


    useEffect(() => {
        const category = searchParams.get('category')
        if (category) {
            getPostByCategories(category).then(
                (posts) => setPosts(posts)
            )
        }
    }, [searchParams])
    return (
        <div className="flex flex-col justify-between gap-2">
            <div className="flex overflow-auto">
                {
                    categories && categories.map((category, index) => {
                        return <Toggle key={index} pressed={activeIndex === index} size={"sm"} onPressedChange={
                            () => {
                                setActiveIndex(activeIndex === index ? null : index)
                                navigate(blogPath + "/?category=" + category.slug)
                            }
                        }>{category.name}</Toggle>
                    })
                }
            </div>
            <div className="flex flex-col gap-5">
                {posts && posts.map((post, index) => (
                    <NavLink to={'/posts/hehe'}>
                        <ArticleCard post={post} key={index} />
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

function ArticleView() {

}




async function getCategories() {
    return categories
}
async function getPostByCategories(slug: string) {
    const category = categories.find((category) => category.slug === slug);
    return posts.filter((post) => post.category === category?.id);
}