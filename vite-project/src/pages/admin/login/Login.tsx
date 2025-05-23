import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isUint8Array } from "util/types";
import { getTokenInfo, login } from "@/service/AuthApi";
import { useAuth } from "@/hooks/AuthProvider";
import { Input } from "@/components/ui/input";
import { CustomInput } from "@/components/ui/customInput";
import { cn } from "@/lib/utils";

const authSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type Auth = z.infer<typeof authSchema>;

const AdminLogin: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<Auth>({
        resolver: zodResolver(authSchema),
    });
    const auth = useAuth()

    const navigate = useNavigate()
    const onSubmit = async (data: Auth) => {
        const valid = await auth.loginAction(data.username, data.password)
        if (valid) {
            return (
                navigate('/admin/posts')
            )
        }
        
    };

    return (
        <div className="container flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="gap-5 min-w-[360px]">
                    <CardHeader>
                        <Label className="text-2xl font-bold">Login</Label>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div>
                            <Label>Username</Label>
                            <Input type="text" {...register("username")} />
                            {errors.username && (
                                <p className="text-sm text-red-500">{errors.username.message}</p>
                            )}
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input  type="password" {...register("password")} />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="gap-4 flex justify-between">
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>
                        <Button type="button" className="flex-1" variant="secondary">
                            Sign up
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
};

export default AdminLogin;
