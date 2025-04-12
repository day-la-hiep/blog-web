import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginDialog() {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Login</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Username
                    </Label>
                    <Input type="text" id="username" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                        Password
                    </Label>
                    <Input type="password" id="password" className="col-span-3" />
                </div>
            </div>
            <DialogClose>
                <DialogFooter>
                    <Button type="submit" onClick={() => {
                        window.open("/admin", "_blank");
                    }}>Login</Button>
                </DialogFooter>
            </DialogClose>
        </>
    )
}