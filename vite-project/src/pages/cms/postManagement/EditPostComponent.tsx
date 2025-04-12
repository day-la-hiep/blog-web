import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Post, uploadPostImage } from "@/service/PostService"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import MarkdownEditor from "@/components/ui/MarkDownEditor"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CategorySelector from "./viewPostDetail/CategorySelector"
import { useAuthService } from "@/hooks/AuthProvider"
import { useNavigate, useParams } from "react-router-dom"
import { adminPostsPath } from "@/RouteDefinition"
import { uploadPostThumbnail } from "@/service/PostService"
import { addTransformationsToCloudinaryUrl } from "@/service/CloudinaryService"
type PostForm = {
    title: string,
    summary: string,
    content: string,
    categories: Category[],
    thumbnailUrl: string,
}
type Category = {
    name: string,
    slug: string,
    description: string,
};



interface EditPostProps {
}
const EditPostComponent: React.FC<EditPostProps> = () => {
    const authService = useAuthService()
    const [currentCategories, setCurrentCategories] = useState<Category[]>([])
    const [post, setPost] = useState<Post>()
    const navigate = useNavigate()
    const { id } = useParams()
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && id) {
            uploadPostThumbnail(id, file).then((response) => {
                if (response.result.thumbnailUrl) {
                    setThumbnailPreview(addTransformationsToCloudinaryUrl(
                        response.result.thumbnailUrl,
                        160,
                        100,
                        "fill"
                    ))
                }
            })
        }
    };
    useEffect(() => {
        if (id != 'new-post') {
            fetchPostById(authService.token, Number(id)).then((fetchedPost) => {
                setPost(fetchedPost)
                form.setValue("title", fetchedPost.title)
                form.setValue("content", fetchedPost.content)
                form.setValue("categories", fetchedPost.categories)
                form.setValue("thumbnailUrl", (fetchedPost.thumbnailUrl))
                form.setValue("summary", fetchedPost.summary)
                setThumbnailPreview(addTransformationsToCloudinaryUrl(
                    fetchedPost.thumbnailUrl,
                    160,
                    100,
                    "fill"
                ))
                console.log(form.getValues())
                console.log(fetchedPost)
            })
        } else {
            // updatePost()
        }
    }, [id])

    useEffect(() => {
        fetchCategories(authService.token).then((categories) => {
            setCurrentCategories(categories)
        })
    }, [])

    const form = useForm<PostForm>({
        defaultValues: {
            title: "",
            content: "",
            categories: [],
            thumbnailUrl: "",
            summary: "",
        }
    })


    function onSubmit(values: PostForm) {
        if (!post) {
            createPost(values, authService.token).then((post) => {
                navigate(adminPostsPath + `/${post.id}`)
            })
        } else {
            updatePost(post.id, post, values, authService.token)
        }
        console.log(JSON.stringify(values, null, 2))
    }

    return (
        <>

            <Form {...form}>

                <form className="w-full flex-1 flex flex-col max-h-dvh h-dvh overflow-hidden p-1" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex gap-5 flex-1 overflow-hidden">
                        <div className="flex flex-1/4 flex-col  gap-2 px-1 overflow-auto">
                            <FormField
                                name="title"
                                control={form.control}
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel> Title </FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Enter your title" {...field}></Input>

                                            </FormControl>
                                            <FormDescription></FormDescription>
                                        </FormItem>
                                    )
                                }}
                            />

                            <FormField
                                name="summary"
                                control={form.control}
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Summary</FormLabel>
                                            <FormControl>
                                                <Textarea className="max-h-30 resize-none" {...field}></Textarea>
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                            <FormField
                                name="categories"
                                control={form.control}
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel></FormLabel>
                                            <FormControl className="w-full">
                                                <CategorySelector
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    items={currentCategories}
                                                />

                                            </FormControl>
                                            <FormDescription></FormDescription>

                                        </FormItem>

                                    )
                                }}
                            />
                            <FormField
                                name="thumbnailUrl"
                                control={form.control}
                                render={({ }) => {

                                    return (
                                        <FormItem>
                                            <FormLabel>
                                                Thumbnail
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="file" accept="image/*" onChange={handleThumbnailChange} />
                                            </FormControl>

                                        </FormItem>
                                    )
                                }}
                            />

                            <div className="flex flex-1 flex-col items-center space-y-4 w-full">
                                {(
                                    <Card className="relative w-full flex-1 flex flex-col">
                                        <CardContent className="flex flex-col flex-1 p-0">
                                            <div className="flex justify-center items-center h-full">
                                                <img src={thumbnailPreview} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                            <div className="w-full flex gap-5 sticky">
                                <Button className="flex-1/2" type="submit" variant={"outline"}> Save as draft</Button>
                                <Button className="flex-1/2" type="submit"> Submit </Button>
                            </div>
                        </div>
                        <div className="flex-3/4 flex-col flex">
                            <FormField

                                name="content"
                                control={form.control}
                                render={({ field }) => {
                                    return (
                                        <FormItem className="flex flex-col flex-1">
                                            <FormLabel>Content</FormLabel>
                                            <FormItem className="flex-1">
                                                <MarkdownEditor onImageUpload={async (file : File) => {
                                                    if(id){
                                                        const response = await uploadPostImage(id, file)
                                                        return response.result.url
                                                    }else{
                                                        throw new Error('ID not exitsted')
                                                    }

                                                }} onChange={field.onChange} value={field.value} viewMode="edit"></MarkdownEditor>
                                            </FormItem>
                                            <FormDescription > Enter the full text of your article here </FormDescription>
                                        </FormItem>
                                    )
                                }}

                            />
                        </div>
                    </div>
                </form>

            </Form >
        </>


    )
}
async function fetchCategories(token: string) {

    try {
        const response = await fetch("http://localhost:8080/api/categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        return data.result
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}
async function createPost(postForm: PostForm, token: string) {
    const url = "http://localhost:8080/api/articles";
    const data = {
        title: postForm.title,
        summary: postForm.summary,
        content: postForm.content,
        status: "DRAFT",
        categories: postForm.categories,
        thumbNailUrl: "https://example.com/image.jpg"
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const apiResponse = await response.json();
        return apiResponse.result
    } catch (error) {
        console.error("Error:", error);
    }
}

async function fetchPostById(token: string, articleId: number) {
    const url = `http://localhost:8080/api/articles/${articleId}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiRes = await response.json();

        return apiRes.result
    } catch (error) {
        console.error("Error fetching article:", error);
    }
}
async function updatePost(id: String, oldValue: Post, newValue: PostForm, token: string) {
    const response = await fetch(`http://localhost:8080/api/articles/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            ...oldValue,
            ...newValue
        })
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
}


export default EditPostComponent


