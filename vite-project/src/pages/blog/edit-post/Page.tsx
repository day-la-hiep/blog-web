
import * as React from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { ArrowLeftFromLine, BookOpen, BookUp, Edit3, ImageIcon, Loader2, LogOut, Menu, Save, Send, User, X } from "lucide-react"
import Editor, { Plugins } from 'react-markdown-editor-lite';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import "react-markdown-editor-lite/lib/index.css";


import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createPost, fetchDetailPage, submitForApproval, unsubmitPost, updatePost, uploadPostImage, uploadPostThumbnail } from "@/service/PostApi"
import MarkdownIt from "markdown-it";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { fetchPublicCategories } from "@/service/CategoryApi";
import { ThumbnailData, ThumbnailUploader, ThumbnailUploaderRef } from "./thumbnailUploader";
import { Progress } from "@/components/ui/progress";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';// Mock data for a single post

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const PostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  name: z.string().min(1, "Name is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["DRAFT", "DONE", "PENDING"]),
  approvedStatus: z.enum(["ACCEPTED", "REJECTED", "NONE"]),
  categoryIds: z.array(z.string()),
  thumbnailUrl: z.string().optional(),
})

type PostForm = z.infer<typeof PostFormSchema>
const md = new MarkdownIt("default", {
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch (__) { }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

md.disable('list');
export default function EditPost() {
  const [isSubmitttingToAdmin, setIsSubmittingToAdmin] = useState(true)
  const [isFormEditable, setIsFormEditable] = useState(true)
  const { postId } = useParams()
  const [content, setContent] = useState("")
  const [open, setOpen] = useState(false)
  const editorRef = React.useRef<Editor>(undefined)
  const imageArticleInputRef = useRef<HTMLInputElement>(null);
  const [isInsertImage, setIsInsertImage] = useState(false)
  const navigate = useNavigate()
  const [categories, setCategories] = useState<{
    id: string,
    name: string,
    status: boolean,
    slug: string
  }[]>(mockCategories)
  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues, setValue, watch } = useForm<PostForm>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      title: "",
      name: "Test",
      summary: "",
      content: "",
      categoryIds: [],
      status: undefined,
      approvedStatus: undefined,
    },
  })
  const [selectedCategories, setSelectedCategories] = useState<{
    id: string,
    name: string,
    status: boolean,
    slug: string,

  }[]>([])

  const onSavePost = async (data: PostForm) => {
    setValue("content", editorRef.current?.getMdValue() || "")
    const res = await updatePost(postId, {
      title: data.title,
      name: data.name,
      summary: data.summary,
      categoryIds: data.categoryIds,
      content: editorRef.current?.getMdValue() || ""
    })

    if (res) {
      toast.success("Post updated successfully")
    } else {
      toast.error("Post save failed")
    }
  }

  useEffect(() => {
    const action = async () => {
      setIsSubmittingToAdmin(true)
      if (postId) {
        let res = await fetchDetailPage(postId.toString())
        console.log(res)
        setValue("title", res.title)
        setValue("name", res.name)
        setValue("summary", res.summary)
        setValue("content", res.content)
        setValue("categoryIds", res.categoryIds)
        setValue("status", res.status)
        setValue("approvedStatus", res.approvedStatus)
        setValue("thumbnailUrl", res.thumbnailUrl)
        res = await fetchPublicCategories()
        setCategories(res.items)
        setSelectedCategories(res.items.filter((item: { id: string }) => getValues('categoryIds').includes(item.id)))
      }
      setIsSubmittingToAdmin(false)
    }
    action()
  }, [postId])

  useEffect(() => {
    if (watch("status") === "PENDING" || watch("status") === "DONE") {
      setIsFormEditable(false)
      editorRef.current?.setText(getValues().content)
    } else {
      setIsFormEditable(true)
      editorRef.current?.setText(getValues().content)
    }
  }, [watch("status")])
  const submit = async () => {
    setIsSubmittingToAdmin(true)
    const data = getValues()
    let res = await updatePost(postId, {
      title: data.title,
      name: data.name,
      summary: data.summary,
      content: data.content,
      categoryIds: data.categoryIds,
      thumbnailUrl: data.thumbnailUrl,
    })
    res = await submitForApproval(postId)
    if (res) {
      toast.success("Post submitted successfully")
      setValue("status", "PENDING")
      console.log(res)
    }
    setIsSubmittingToAdmin(false)
  }

  const unsubmit = async () => {
    setIsSubmittingToAdmin(true)
    const res = await unsubmitPost(postId)
    if (res) {
      setValue("status", "DRAFT")
      console.log(res)
    }
    setIsSubmittingToAdmin(false)
  }

  const handleSelectCategories = (category: (typeof categories)[0]) => {
    // Kiểm tra xem thể loại đã được chọn chưa
    const isSelected = selectedCategories.some((item) => item.id === category.id)

    if (!isSelected) {
      setSelectedCategories([...selectedCategories, category])
      setValue("categoryIds", [...getValues("categoryIds"), category.id])
    }

    setOpen(false)
  }

  const handleRemoveCategories = (categoryValue: string) => {
    setSelectedCategories(selectedCategories.filter((item) => item.id !== categoryValue))
    setValue('categoryIds', selectedCategories.map(callbackfn => callbackfn.id).filter((item) => item !== categoryValue))

  }

  const uploadThumbnail = async (thumbnailData: ThumbnailData) => {
    if (thumbnailData.file) {
      try {
        const res = await uploadPostThumbnail(postId, thumbnailData.file || "")
        if (res) {
          toast.success("Thumbnail uploaded successfully")
        } else {
          toast.error("Thumbnail upload failed")
        }
      } catch (error) {
        console.error("Error uploading thumbnail:", error)
        toast.error("Thumbnail upload failed")
      }
    } else {
      toast.message("Please select a file")
    }
  }
  const handleImageInsert = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsInsertImage(true)
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB");
      setIsInsertImage(false)
      return;
    }
    const res = await uploadPostImage(postId, file);

    const alt = file.name.split(".")[0];
    const markdownImageSyntax = `![${alt}](${res.url})`;

    // Chèn syntax vào editor tại vị trí con trỏ
    editorRef.current?.insertText(markdownImageSyntax);
    setIsInsertImage(false)
  }
  return <>

    <div className="w-full flex-1 flex flex-col items-center ">
      <main className="container w-2/3 flex-1 py-6">

        <div key={postId} className="container px-4 sm:px-6">
          <input ref={imageArticleInputRef} className="hidden"
            type="file" accept="image/*" onChange={handleImageInsert} />
          <div className="grid gap-6">

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Edit Post</h1>
                <p className="text-muted-foreground">Edit and publish your next article</p>
              </div>
              <div className="flex items-center gap-2">
                <Button className="p-2" variant={"ghost"} onClick={() => navigate(-1)}><ArrowLeftFromLine></ArrowLeftFromLine></Button>

                <Label htmlFor="title" className="text-muted-foreground text-lg">Status: </Label>
                <Badge
                  className={
                    getValues().status === 'DRAFT' ? 'bg-yellow-500 text-white' :
                      getValues().status === 'DONE' ? 'bg-green-600 text-white' :
                        getValues().status === 'PENDING' ? 'bg-orange-500 text-white' :
                          'bg-gray-400 text-white' // fallback nếu không khớp
                  }
                >
                  {getValues().status}
                </Badge>
              </div>
            </div>

            <form onSubmit={(e) => {
              setValue('content', editorRef.current?.getMdValue() || "")
              handleSubmit(onSavePost)(e)

            }} className="space-y-4">
              {errors.categoryIds && <p className="text-red-500">{errors.categoryIds.message}</p>}
              <div className="flex flex-col gap-4 container">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2 ">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      disabled={!isFormEditable}
                      id="title"
                      placeholder="Enter the title of your post"
                      {...register("title")}
                    />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}

                  </div>
                  <div className="space-y-2 ">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      disabled={!isFormEditable}

                      id="name"
                      placeholder="Enter the name of your post"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}

                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      className="h-full"
                      disabled={!isFormEditable}

                      id="summary"
                      placeholder="Write a brief summary of your post"
                      {...register("summary")}
                    />
                    {errors.summary && <p className="text-red-500">{errors.summary.message}</p>}

                  </div>
                  <div className="space-y-2 gap-4 w-full max-w-md">
                    <label className="text-sm font-medium">Thể loại bài viết</label>

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger disabled={!isFormEditable} asChild>
                        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                          Select categories
                          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {selectedCategories.length}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Tìm thể loại..." />
                          <CommandList>
                            <CommandEmpty>Không tìm thấy thể loại.</CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => {
                                const isSelected = selectedCategories.some((item) => item.id === category.id)
                                return (
                                  <CommandItem
                                    key={category.id}
                                    value={category.id}
                                    onSelect={() => handleSelectCategories(category)}
                                  // className={cn("flex items-center gap-2", isSelected && "bg-primary/10")}
                                  >
                                    <span>{category.name}</span>
                                    {isSelected && <span className="ml-auto text-primary">✓</span>}
                                  </CommandItem>
                                )
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {selectedCategories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCategories.map((category) => (
                          <Badge key={category.id} variant="secondary" className="flex items-center gap-1">
                            {category.name}
                            <Button
                              disabled={!isFormEditable}
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveCategories(category.id)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Xóa {category.name}</span>
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <ThumbnailUploader
                  key={watch("thumbnailUrl")}
                  disabled={!isFormEditable}
                  defaultImage={watch('thumbnailUrl')} onUploadThumbnail={uploadThumbnail} />


                <div className="space-y-2 flex flex-col items-center">
                  <div className="flex gap-5 w-full items-center">
                    <Label htmlFor="content" className="text-xl font-medium">Content</Label>
                    <Button
                      type="button"

                      className={cn(
                        "h-8 w-8 p-0 rounded-md",
                        isInsertImage
                          ? "bg-muted text-muted-foreground cursor-wait"
                          : "bg-transparent hover:bg-accent"
                      )}
                      disabled={isInsertImage}
                      onClick={() => {
                        imageArticleInputRef.current?.click();
                      }}
                      title="Insert image"
                    >
                      {isInsertImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-black" />
                      )}
                    </Button>



                  </div>
                  <div className="container flex justify-center items-center">

                    <Editor
                      ref={editorRef}
                      defaultValue={getValues('content')}
                      key={isFormEditable ? "editable" : "readonly"} // ⚠️ thêm dòng này
                      view={{
                        menu: isFormEditable,
                        md: isFormEditable,
                        html: true,
                      }}
                      readOnly={!isFormEditable}
                      style={{ height: "800px" }}
                      className="w-full"
                      renderHTML={text => md.render(text)}

                    />




                  </div>
                  {errors.content && <p className="text-red-500">{errors.content.message}</p>}

                </div>

                <div className="flex justify-end gap-4">
                  {
                    isSubmitttingToAdmin ? <Button variant="outline" disabled>Loading</Button> :
                      getValues().status !== "DRAFT" ? <></> :
                        <Button variant="outline" disabled={isSubmitting}>
                          <BookUp />
                          Save
                        </Button>
                  }
                  {
                    getValues().status === "DONE" ? <></> :
                      isSubmitttingToAdmin ? <Button variant="outline" disabled>Loading</Button> :
                        getValues().status === "PENDING" ? <>
                          <Button variant="outline" onClick={unsubmit}>
                            <LogOut />
                            Unsubmit
                          </Button>
                        </> : <>
                          <Button type="button" variant="outline" onClick={submit}>
                            <Send />
                            Submit for approval
                          </Button>
                        </>
                  }
                </div>
              </div>
            </form>

          </div>
        </div>
      </main>


    </div>
  </>
}



const mockCategories = [
  { value: "tin-tuc", label: "Tin tức" },
  { value: "the-thao", label: "Thể thao" },
  { value: "giai-tri", label: "Giải trí" },
  { value: "kinh-doanh", label: "Kinh doanh" },
  { value: "cong-nghe", label: "Công nghệ" },
  { value: "giao-duc", label: "Giáo dục" },
  { value: "suc-khoe", label: "Sức khỏe" },
  { value: "du-lich", label: "Du lịch" },
  { value: "am-thuc", label: "Ẩm thực" },
  { value: "phap-luat", label: "Pháp luật" },
]
