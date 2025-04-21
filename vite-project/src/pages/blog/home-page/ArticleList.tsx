import { Toggle } from "@/components/ui/toggle"
import { useEffect, useRef, useState } from "react"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { Category, fetchCategories } from "@/service/CategoryService";
import { fetchPostByCategories as fetchPostsByCategories, fetchPosts, Post } from "@/service/PostService";
import { blogPath } from "@/RouteDefinition";
import { categories, posts } from '@/FakeData'
import ArticleCard from "./ArticleCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SelectSeparator } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";


export default function ArticleList() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [posts, setPosts] = useState<Post[]>()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [categories, setCategories] = useState<Category[]>()
    useEffect(() => {
        const category = searchParams.get('category')
        fetchPostsByCategories(0, 10, category ? category : "").then(
            (posts) => {
                setPosts(posts)
            }

        )

    }, [searchParams])
    useEffect(() => {
        fetchCategories().then((data) => {
            if (data) {
                setCategories(data.map((item: Category) => item))
            }
        }
        )
    }, [])
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            if (e.deltaY === 0) return;
            e.preventDefault(); // ngăn scroll dọc
            el.scrollLeft -= e.deltaY;
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    return (
        <div className="flex flex-1 flex-col justify-between gap-2 py-2">
            <div className="flex rounded-2xl">
                <Button

                    variant={"ghost"}
                    size={"sm"}
                    className="sticky left-0 z-10 !px-1 !py-0"
                    onClick={() => scrollRef.current?.scrollBy({ left: -150, behavior: 'smooth' })}
                >
                    <ChevronLeft/>
                </Button>
                <div
                    className="sticky top-0 bg-white flex overflow-hidden items-start gap-1"
                    ref={scrollRef}
                >

                    {
                        categories && categories.map((category, index) => {
                            return <Toggle key={index} pressed={activeIndex === index} size={"sm"}
                                className="shrink-0 min-w-fit px-1 py-2"
                                onPressedChange={
                                    () => {
                                        setActiveIndex(activeIndex === index ? null : index)
                                        navigate(blogPath + "/?category=" + category.slug)
                                    }
                                }
                            >
                                {category.name}
                            </Toggle>
                        })

                    }

                </div>
                <Button

                    variant={"ghost"}
                    size={"sm"}
                    className="sticky right-0 z-10 !px-1 !py-0"
                    onClick={() => scrollRef.current?.scrollBy({ left: 150, behavior: 'smooth' })}
                >
                    <ChevronRight/>
                </Button>
            </div>
            <Separator />
            <div className="flex flex-col gap-5">
                {posts && posts.map((post, index) => (
                    <NavLink to={'/posts/hehe'} key={index}>
                        <ArticleCard post={post} key={index} />
                    </NavLink>
                ))}
            </div>
        </div>
    )
}






