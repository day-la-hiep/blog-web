import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { useNavigate } from "react-router-dom";
// Mock data
const categories = [
  { id: "1", name: "All", slug: "all" },
  { id: "2", name: "Technology", slug: "technology" },
  { id: "3", name: "Design", slug: "design" },
  { id: "4", name: "Programming", slug: "programming" },
  { id: "5", name: "Business", slug: "business" },
  { id: "6", name: "Productivity", slug: "productivity" },
]

const articles = [
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
  const [activeCategory, setActiveCategory] = React.useState("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const navigate = useNavigate()
  // Filter articles based on active category
  const filteredArticles = React.useMemo(() => {
    if (activeCategory === "all") return articles

    return articles.filter((article) => article.category.toLowerCase() === activeCategory.toLowerCase())
  }, [activeCategory])

  const handleArticleClick = (id: string) => {
      navigate(`/posts/${id}`)
  }
  return (
    <main className="flex-1 flex flex-col items-center">
      <div className="container w-full px-4 py-6 sm:px-6">
        <div className="mb-6 overflow-x-auto">
          <Tabs defaultValue="all" onValueChange={setActiveCategory}>
            <TabsList className="h-12">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.slug}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="cursor-pointer overflow-hidden transition-all hover:shadow-md p-0 gap-2"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="aspect-3/1 w-full overflow-hidden">
                      <img
                        src={article.thumbnail || "/placeholder.svg"}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="px-4 flex-1">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{article.category}</span>
                        <span>•</span>
                        <span>{article.readTime} read</span>
                      </div>
                      <CardTitle className="line-clamp-2 text-xl">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{article.summary}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex items-center gap-3 p-4 pt-0">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={article.authorAvatar || "/placeholder.svg"} alt={article.author} />
                        <AvatarFallback>{article.author[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{article.author}</span>
                      <span className="text-sm text-muted-foreground">{article.date}</span>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {categories.slice(1).map((category) => (
              <TabsContent key={category.id} value={category.slug} className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4   ">
                  {filteredArticles.map((article) => (
                    <Card
                      key={article.id}
                      className="cursor-pointer overflow-hidden transition-all hover:shadow-md"
                      onClick={() => handleArticleClick(article.id)}
                    >
                      <div className="aspect-4/1 w-full overflow-hidden">
                        <img
                          src={article.thumbnail || "/placeholder.svg"}
                          alt={article.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{article.category}</span>
                          <span>•</span>
                          <span>{article.readTime} read</span>
                        </div>
                        <CardTitle className="line-clamp-2 text-xl">{article.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{article.summary}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex items-center gap-3 p-4 pt-0">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={article.authorAvatar || "/placeholder.svg"} alt={article.author} />
                          <AvatarFallback>{article.author[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{article.author}</span>
                        <span className="text-sm text-muted-foreground">{article.date}</span>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </main>
  )
}   