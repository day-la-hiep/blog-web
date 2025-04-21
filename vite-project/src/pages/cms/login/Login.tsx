import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { adminDashboardPath, adminLoginPath } from "@/RouteDefinition";
import { useAuthService } from '@/hooks/AuthProvider'
type FormData = {
    username: string;
    password: string;
};

const baseUrl = "http://localhost:8080/api/";


interface LoginFormProps {
}
const AdminLogin: React.FC<LoginFormProps> = () => {
    const authService = useAuthService()
    const navigate = useNavigate()
    const form = useForm<FormData>({
        "defaultValues": {
            "username": "",
            "password": "",
        }
    })
    const onSubmit = async (value: FormData) => {
        await authService.auth(value.username, value.password)
        
        navigate(adminDashboardPath)
    };

    return (

        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your username" {...field} />
                                </FormControl>
                                <FormDescription className="hidden">This is your username</FormDescription>
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} />
                                </FormControl>
                                <FormDescription className="hidden">Type your password here</FormDescription>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>

    );
};

export default AdminLogin;
