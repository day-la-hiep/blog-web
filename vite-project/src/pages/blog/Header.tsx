import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BookMarked, ChartNoAxesCombined, CircleArrowOutUpRight, CircleUserRound, LogIn, PencilLine, Settings, StickyNote, User } from "lucide-react";
import { LoginDialog } from "./home-page/LoginDiaglog";
import { useAuthService } from "@/hooks/AuthProvider";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { r } from "node_modules/@faker-js/faker/dist/airline-CBNP41sR";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const authService = useAuthService()
    const userInfo = authService.userInfo
    const role = userInfo?.scope
    const navigate = useNavigate()
    // alert(userInfo)
    return (
        <>
            <div className="flex items-center justify-between gap-5 w-full">
                <div className="flex items-center p-5 gap-5">
                    <Label className="text-4xl items-center"> Large </Label>
                    <Input type="text" placeholder="Search"></Input>
                </div>
                {
                    userInfo ? (
                        <div className="flex items-center p-5 gap-2">
                            <Button><PencilLine /></Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button variant={"outline"} className="flex-1">  <CircleUserRound /> </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuItem className="cursor-pointer"> <User /> Profile</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer"><StickyNote /> My Posts</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer"><BookMarked />Library</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer"
                                        onClick={() => {
                                            navigate("/me/settings")
                                        }}
                                    >
                                        <Settings />Settings
                                    </DropdownMenuItem>
                                    <Separator />
                                    <DropdownMenuItem className="cursor-pointer"
                                        onClick={() => {
                                            authService.logout()
                                            navigate("/")
                                        }}
                                    >
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {
                                role?.includes("ROLE_ADMIN") ? (
                                    <Button variant={"outline"} className="flex-1"
                                        onClick={() => {
                                            window.open("/admin", "_blank")
                                        }}
                                    >
                                        <ChartNoAxesCombined /> Admin
                                    </Button>
                                ) : (
                                    <>
                                    </>
                                )
                            }
                        </div>
                    ) : (
                        <div className="flex items-center p-5 gap-2">
                            <Dialog>
                                <DialogTrigger>
                                    <Button variant={"outline"} size={"sm"} className="flex-1"> <LogIn></LogIn> Login </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <LoginDialog />
                                </DialogContent>
                            </Dialog>
                            <Button variant={"outline"} size={"sm"} className="flex-1"> <CircleArrowOutUpRight></CircleArrowOutUpRight> Sign up</Button>
                        </div>
                    )
                }
            </div>
        </>
    )
}
