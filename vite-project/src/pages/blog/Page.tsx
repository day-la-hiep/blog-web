import { Link, Navigate, Outlet, useNavigate, useSearchParams } from "react-router-dom"
import Header from "./Header"
import { Separator } from "@/components/ui/separator"
import HomePageRoutes from "@/routes/HomePageRoutes"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/AuthProvider"
import { useEffect, useState } from "react"
import LoginDialog from "./loginDialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createPost } from "@/service/PostApi"
import { ContactRound, SquarePen } from "lucide-react"
import { fetchDetailUser } from "@/service/UserApi"
import SignupDialog from "./signupDialog"
const NameSchema = z.object({
    name: z.string().min(1, "Name is required"),
})
const Page = () => {
    const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false)
    const auth = useAuth()
    const navigate = useNavigate()
    const [avatarUrl, setAvatarUrl] = useState<string>("")

    if (auth.isLoading) {
        return <div>loading</div>
    }
    const handleLogout = () => {
        auth.logout()
    }

    const { handleSubmit, register, formState: { errors } } = useForm<z.infer<typeof NameSchema>>({
        defaultValues: {
            name: "",
        },
        resolver: zodResolver(NameSchema),
    })

    const onSubmitNewPostName = async (data: { name: string }) => {
        console.log(JSON.stringify(data, null, 2))
        const res = await createPost({
            title: "",
            name: data.name,
            summary: "",
            content: "",
            categoryIds: [],
        })
        navigate(`/edit-posts/${res.id}`)
        setIsNewPostDialogOpen(false)
    }



    return (
        <div className="flex flex-col w-full min-h-screen">
            <div className="container mx-auto flex  justify-between p-2 sticky top-0 z-10 bg-white">
                <Label className="text-2xl font-bold">
                    <Link to="/" >
                        Large
                    </Link>
                </Label>
                <div className="flex gap-2">
                    <Input placeholder="search"></Input>

                    {
                        auth.userInfo.role !== 'GUEST' ?
                            <>
                                <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant={"outline"}>
                                            <SquarePen />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="space-y-1">
                                        <DialogHeader>
                                            <DialogTitle>Create new post</DialogTitle>
                                            <DialogDescription>
                                                Please provide a name for your post
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit(onSubmitNewPostName)} className="space-y-2">
                                            <Input {...register("name")} placeholder="Post name" className="w-full" />
                                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                                            <Button > Continue</Button>
                                        </form>


                                    </DialogContent>

                                </Dialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="Button">
                                        <Button variant={"outline"} size="icon" className="rounded-full">
                                            <ContactRound />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <Link to="/profile">
                                            <DropdownMenuItem>Profile</DropdownMenuItem>
                                        </Link>
                                        <Link to="/library">
                                            <DropdownMenuItem>Library</DropdownMenuItem>
                                        </Link>
                                        <Link to="/my-posts">
                                            <DropdownMenuItem>My post</DropdownMenuItem>
                                        </Link>
                                        {
                                            auth.userInfo.role === 'ROLE_ADMIN' ? <>
                                                <Link to={"/admin"}>
                                                    <DropdownMenuItem >Management</DropdownMenuItem>
                                                </Link>
                                            </> : <></>
                                        }
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>

                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </> :
                            <>
                                <LoginDialog />

                                <SignupDialog />
                            </>
                    }



                </div>
            </div>
            <Separator></Separator>
            <Outlet />
            <footer className="border-t py-6">
                <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary" />
                        <span className="text-lg font-bold">Large</span>
                    </div>
                    <p className="text-sm text-muted-foreground">© 2025 Large. All rights reserved.</p>
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

export default Page