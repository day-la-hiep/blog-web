import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    Dialog,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { use, useRef, useState } from "react"
import { useAuthService } from "@/hooks/AuthProvider"

// Define form schema
const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(4, {
        message: "Password must be at least 6 characters.",
    }),
})

export function LoginDialog() {
    const [open, setOpen] = useState(true)
    const ref = useRef<HTMLDialogElement>(null)
    const authService = useAuthService()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        authService.auth(values.username, values.password).then(
            (result) => {
                if (result) {
                    setOpen(false)
                } else {
                    alert("Login failed")

                }
            }
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogHeader>
                        <DialogTitle>Login</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="col-span-3"
                                            placeholder="Enter your username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="col-start-2 col-span-3" />
                                    <FormDescription />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            className="col-span-3"
                                            placeholder="Enter your password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="col-start-2 col-span-3" />
                                    <FormDescription />
                                </FormItem>
                            )}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit">Login</Button>
                    </DialogFooter>
                </Dialog>
            </form>
        </Form>

    )
}