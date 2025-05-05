import { Link, Navigate, Outlet, useSearchParams } from "react-router-dom"
import Header from "./Header"
import { Separator } from "@/components/ui/separator"
import HomePageRoutes from "@/routes/HomePageRoutes"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Page = () => {

    return (
        <div className="flex flex-col w-full min-h-screen">
            <div className="container mx-auto flex  justify-between p-2 sticky top-0 z-10 bg-white">
                <Label className="text-3xl">
                    <Link to="/">Large</Link>
                </Label>
                <div className="flex gap-2">
                    <Input placeholder="search"></Input>
                    <Button>
                        <Link to="/create-post">Write post</Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="Button">
                            <Button size="icon" className="rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
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
                            <DropdownMenuSeparator />
                            <Link to="/dashboard">
                                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                            </Link>
                            <Link to="/logout">
                                <DropdownMenuItem>Logout</DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <Separator></Separator>
            <Outlet />
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

export default Page