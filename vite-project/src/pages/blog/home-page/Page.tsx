import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCategories, fetchPublicCategories } from "@/service/CategoryApi";
import { fetchPostsByUsername, fetchPublicPosts, fetchPublicPostsByCategories } from "@/service/PostApi";
import React, { useEffect, useState } from "react";
import { useActionData, useNavigate, useSearchParams } from "react-router-dom";
import FilterBar from "./component/filter-bar";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Mock data
// const categories = [
//   { id: "1", name: "All", slug: "all" },
//   { id: "2", name: "Technology", slug: "technology" },
//   { id: "3", name: "Design", slug: "design" },
//   { id: "4", name: "Programming", slug: "programming" },
//   { id: "5", name: "Business", slug: "business" },
//   { id: "6", name: "Productivity", slug: "productivity" },
// ]

const posts = [
  {
    id: "1",
    title: "Getting Started with Next.js Next.js Next.js",
    summary: "Learn the basics of Next.js and how to get started with your first project. Learn the basics of Next.js and how to get started with your first project.",
    author: "John Doe",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-05-15",
    readTime: "5 min",
    category: "Programming",
    thumbnail: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    title: "Understanding React Hooks",
    summary: "A deep dive into React Hooks and how they can simplify your code.",
    author: "Jane Smith",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-05-10",
    readTime: "7 min",
    category: "Programming",
    thumbnail: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    title: "The Future of AI in Web Development",
    summary: "Exploring how AI is changing the landscape of web development.",
    author: "Mike Johnson",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-05-20",
    readTime: "10 min",
    category: "Technology",
    thumbnail: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox",
    summary: "A comparison of CSS Grid and Flexbox for modern layouts. modern layouts. modern layouts. modern layouts.",
    author: "Sarah Williams",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-05-18",
    readTime: "6 min",
    category: "Design",
    thumbnail: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "5",
    title: "Mobile-First Design Principles",
    summary: "Best practices for implementing mobile-first design in your projects.",
    author: "David Lee",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-05-12",
    readTime: "8 min",
    category: "Design",
    thumbnail: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "6",
    title: "Productivity Hacks for Developers",
    summary: "Simple tips and tricks to boost your productivity as a developer.",
    author: "Emily Chen",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-05-05",
    readTime: "4 min",
    category: "Productivity",
    thumbnail: "/placeholder.svg?height=200&width=400",
  },
]
export default function MainContent() {
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = React.useState("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const navigate = useNavigate()
  // Filter articles based on active category
  const [currentPage, setCurrentPage] = React.useState(0)
  const totalItems = React.useRef(0)
  const totalPages = React.useRef(0)
  const currentPageInputRef = React.useRef<HTMLInputElement>(null)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = parseInt(currentPageInputRef.current?.value || '1', 10)
      if (!isNaN(value) && value > 0 && value <= totalPages.current) {
        setCurrentPage(value - 1)
      }
    }
  }
  const handleInputBLur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (isNaN(value) || value < 1 || value > totalPages.current) {
      e.target.value = (currentPage + 1).toString()
    }
  }


  const [filteredPosts, setFilteredArticles] = React.useState<any[]>([])
  useEffect(() => {
    const fetchData = async () => {
      let data
      if (activeCategory == 'all') {
        data = await fetchPublicPosts({
          page: currentPage,
          limit: 8,
          search: searchParams.get('search') || ''
        })
      } else {
        data = await fetchPublicPostsByCategories({
          categorySlug: activeCategory,
          page: currentPage,
          limit: 8,
          search: searchParams.get('search') || ''
        })
      }
      // Map lại để đảm bảo các trường author, authorAvatar, avatarUrl, date luôn tồn tại
      const mapped = (data.items || []).map((article: any) => ({
        ...article,
        author: article.author || article.authorName || "",
        avatarUrl: article.avatarUrl || "",
        date: article.date || article.publishedDate || ""
      }))
      totalItems.current = data.totalItems || 0
      totalPages.current = data.totalPages
      if (currentPage >= totalPages.current) {
        setCurrentPage(Math.max(0, totalPages.current - 1))
        currentPageInputRef.current.value =Math.max(0, totalPages.current - 1)
      } else {
        currentPageInputRef.current.value = (currentPage + 1).toString()

      }

      setFilteredArticles(mapped)
    }
    fetchData()
  }, [activeCategory, searchParams, currentPage])

  const [categories, setCategories] = useState<{
    id: string,
    name: string,
    slug: string
  }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchPublicCategories()
      console.log(JSON.stringify(res, null, 2))
      const mappedCategories = res.items.map((category: {
        id: string,
        name: string,
        slug: string
      }) => ({
        id: category.id,
        name: category.name,
        slug: category.slug
      }));
      mappedCategories.unshift(1)
      mappedCategories[0] = {
        id: 0,
        name: 'All',
        slug: 'all'
      }
      setCategories(mappedCategories);
    };

    fetchData();
  }, []);


  const handleArticleClick = (id: string) => {
    navigate(`/posts/${id}`)
  }
  return (
    <>

      <main className="flex-1 flex flex-col items-center">

        <div className="container w-3/4 px-4 py-6 sm:px-6 flex flex-col flex-1">
          <div className="mb-6 overflow-x-auto flex-1 flex flex-col gap-4">
            <FilterBar
              allowMultiple={false}
              options={categories.map((item) => ({
                id: item.id,
                label: item.name,
                value: item.slug,
              }))}
              selectedValues={[activeCategory]}
              onSelectionChange={(selectedValues) => setActiveCategory(selectedValues[0])}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ">
              {filteredPosts && filteredPosts.map((article) => (
                <Card
                  key={article.id}
                  className="cursor-pointer overflow-hidden transition-all hover:shadow-md p-0 gap-5"
                  onClick={() => handleArticleClick(article.id)}
                >
                  <div className="aspect-16/9 w-full overflow-hidden">
                    <img
                      src={article.thumbnailUrl || "/placeholder.svg"}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="px-4 flex-1">
                    <CardTitle className="line-clamp-3">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-3 text-xs">{article.summary}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center gap-3 p-4 pt-0">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={article.avatarUrl || article.authorAvatar || "/placeholder.svg"} alt={article.author} />
                      <AvatarFallback>{article.author[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{article.author}</span>
                    <span className="text-sm text-muted-foreground">{article.date}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex-1 w-full flex items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.min(currentPage - 1, totalPages.current - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Input

                    ref={currentPageInputRef}
                    className="w-16 h-9 text-center"
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleInputBLur}
                  />
                  <span className="text-sm mx-2">/ {totalPages.current}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages.current - 1))}
                disabled={currentPage === totalPages.current - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages.current - 1)}
                disabled={currentPage === totalPages.current - 1}
                aria-label="Trang cuối cùng"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>

            </div>
          </div>
        </div>
      </main>

    </>
  )
}   