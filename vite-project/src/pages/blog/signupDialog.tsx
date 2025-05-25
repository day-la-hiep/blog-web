// ✅ Đã xóa import thừa và sửa cú pháp cuối
import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/AuthProvider"
import { cn } from "@/lib/utils"
import { signupUser } from "@/service/UserApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const AuthSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Email is invalid" }).min(1, { message: "Email is required" }),
})
type AuthType = z.infer<typeof AuthSchema>

const SignupDialog = () => {
    const auth = useAuth()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthType>({
        resolver: zodResolver(AuthSchema),
    });

    const onSubmit = async (data: AuthType) => {
        try {
            const res = await signupUser({
                username: data.username,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email
            })
            if(res) {
                toast.success("Signup successfully")
                reset()
            } 
        } catch (error) {
            console.error("Error during signup:", error)
            toast.error("Signup failed")
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Sign up</Button>
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
                    <Input type="text" {...register("username")} />
                    {errors.username && (
                        <p className="text-red-500 text-sm">{errors.username.message}</p>
                    )}

                    <Label>Password</Label>
                    <Input type="password" {...register("password")} />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                    <div>
                        <Label>First name</Label>
                        <Input type="text" {...register("firstName")} />
                        <Label>Last name</Label>
                        <Input type="text" {...register("lastName")} />
                    </div>
                    {errors.firstName && (
                        <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                    )}
                    <Label>Email</Label>
                    <Input type="email" {...register("email")} />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                    <Button type="submit">Login</Button>


                </form>
                {/* Bạn có thể bỏ DialogFooter nếu không cần */}
            </DialogContent>
        </Dialog>
    )
}

export default SignupDialog
