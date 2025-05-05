"use client"

import * as React from "react"
import {Link, useNavigate} from "react-router-dom"
import { BookOpen, Edit3, ImageIcon, LogOut, Menu, Save, Send, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreatePostPage() {
  const navigate = useNavigate()
  const [title, setTitle] = React.useState("")
  const [summary, setSummary] = React.useState("")
  const [content, setContent] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSaveDraft = () => {
    if (!title) {
      // toast({
      //   description: "Please enter a title for your post",
      //   variant: "destructive",
      // })
      return
    }

    setIsSubmitting(true)

    // In a real app, you would save the post to the database
    setTimeout(() => {
      setIsSubmitting(false)
      // toast({
      //   title: "Draft Saved",
      //   description: "Your post has been saved as a draft",
      // })
    }, 1000)
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!title || !summary || !content || !category) {
      // toast({
      //   title: "Required Fields",
      //   description: "Please fill in all the required fields",
      //   variant: "destructive",
      // })
      return
    }

    setIsSubmitting(true)

    // In a real app, you would submit the post to the database
    setTimeout(() => {
      setIsSubmitting(false)
      // toast({
      //   title: "Post Submitted",
      //   description: "Your post has been submitted for review",
      // })
      navigate("/my-posts")
    }, 1500)
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center">

      <main className="container flex-1 py-6">
        <div className="container px-4 sm:px-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Create New Post</h1>
              <p className="text-muted-foreground">Write and publish your next article</p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter the title of your post"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="Write a brief summary of your post"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="thumbnail">Thumbnail</Label>
                  <Button variant="outline" size="sm">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
                {/* <Card>
                  <CardContent className="flex aspect-video items-center justify-center p-6">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="mx-auto mb-2 h-8 w-8" />
                      <p>Drop your image here or click to browse</p>
                      <p className="text-xs">Recommended size: 1200x630px</p>
                    </div>
                  </CardContent>
                </Card> */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="min-h-[500px] rounded-md border">
                  <Textarea
                    id="content"
                    placeholder="Write your post content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="h-full min-h-[500px] resize-none border-0 px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Markdown formatting is supported. Use # for headings, * for italics, ** for bold, etc.
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit for Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary" />
            <span className="text-lg font-bold">BlogApp</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2023 BlogApp. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
