import { Toggle } from "@/components/ui/toggle"
import { useEffect, useState } from "react"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { Category } from "@/service/CategoryService";
import { fetchPosts, Post } from "@/service/PostService";
import { blogPath } from "@/RouteDefinition";
import { categories, posts } from '@/FakeData'
import ArticleCard from "./ArticleCard";


export default function ArticleList() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [posts, setPosts] = useState<Post[]>()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [categories, setCategories] = useState<Category[]>()

    useEffect(() => {
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
    useEffect(() => {
        fetchPosts(0, 10).then((posts) => {
            setPosts(posts)
        })
    }, [])
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





async function getCategories() {
    return categories
}
async function getPostByCategories(slug: string) {
    const category = categories.find((category) => category.slug === slug);
    return posts.filter((post) => post.category === category?.id);
}