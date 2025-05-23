// ✅ Đã xóa import thừa và sửa cú pháp cuối
import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/AuthProvider"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const AuthSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Password is required" })
})
type AuthType = z.infer<typeof AuthSchema>

const LoginDialog = () => {
    const auth = useAuth()
    const { register, handleSubmit, formState: { errors }, reset} = useForm<AuthType>({
        resolver: zodResolver(AuthSchema),
    });

    const onSubmit = async (data: AuthType) => {
        
        const res = await auth.loginAction(data.username, data.password)
        if (res) {
            toast.success("Login successfully")
        } else {
            toast.error("Login failed")
            reset()
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Login</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Login</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Please enter your username and password
                </DialogDescription>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Label>Username</Label>
                    <Input  type="text" {...register("username")} />
                    {errors.username && (
                        <p className="text-red-500 text-sm">{errors.username.message}</p>
                    )}

                    <Label>Password</Label>
                    <Input  type="password" {...register("password")} />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}

                    <Button type="submit">Login</Button>
                </form>
                {/* Bạn có thể bỏ DialogFooter nếu không cần */}
            </DialogContent>
        </Dialog>
    )
}

export default LoginDialog
