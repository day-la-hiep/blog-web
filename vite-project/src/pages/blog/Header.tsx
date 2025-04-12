import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CircleArrowOutUpRight, LogIn, Search } from "lucide-react";
import { LoginDialog } from "./home-page/LoginDiaglog";

export default function Header() {
    return (
        <>
            <div className="flex items-center justify-between gap-5 w-full">
                <div className="flex items-center p-5 gap-5">
                    <Label className="text-4xl items-center"> Large </Label>
                    <Input type="text" placeholder="Search"></Input>
                </div>
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
            </div>
        </>
    )
}
