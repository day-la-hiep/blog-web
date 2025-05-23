import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
// import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword, fetchDetailUser, updateDetailUser } from "@/service/UserApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { toast } from "sonner";

// Define form schema
const userInfoSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  description: z.string()
});
type UserInfo = z.infer<typeof userInfoSchema>;

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, {
    message: "Old password must not be empty.",
  }),
  newPassword: z.string().min(5, {
    message: "New password must be at least 5 characters.",
  }),
  confirmPassword: z.string().min(5, {
    message: "Confirm password must be at least 5 characters.",
  }),
})
type ChangePassWordForm = z.infer<typeof changePasswordSchema>;
const Page: React.FC = () => {
  const [editing, setEditing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);

  const userInfo: UserInfo = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    description: "",
  }
  const userProfileForm = useForm<UserInfo>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: userInfo,
  });

  const { register: passwordFormRegister, handleSubmit: handleChangePasswordSubmit, formState: {
    errors: passwordChangeErrors,
    isSubmitting: isPasswordChangeSubmitting,
  }, clearErrors: clearPasswordChangeErrors,
    reset: resetPasswordChangeForm,
  } = useForm<ChangePassWordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    const fetchMyUser = async () => {
      try {
        const myUserInfo = await fetchDetailUser("me");
        userProfileForm.setValue("username", myUserInfo.username);
        userProfileForm.setValue("firstName", myUserInfo.firstName);
        userProfileForm.setValue("lastName", myUserInfo.lastName);

        userProfileForm.setValue("email", myUserInfo.mail);
        userProfileForm.setValue("description", myUserInfo.description);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchMyUser();
  }, [])


  const [formData, setFormData] = React.useState({
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    bio: "Frontend developer passionate about creating beautiful user interfaces.",
    location: "San Francisco, CA",
    website: "https://johndoe.com",
    twitter: "@johndoe",
  })
  const onChangePassword = async (values: ChangePassWordForm) => {
    if (values.newPassword !== values.confirmPassword) {
      alert("New password and confirm password do not match");
      resetPasswordChangeForm();

      return;
    }
    try {
      const res = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
      toast.success('Password update sucessfully')
      setIsPasswordDialogOpen(false)

    } catch (error) {
      toast.error('Password update error')
    }
  }



  function onSubmit(values: UserInfo) {
    const action = async () => {


      const res = await updateDetailUser('me', {
        firstName: values.firstName,
        lastName: values.lastName,
        mail: values.email,
        description: values.description,
      })
      setFormData({
        ...formData,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        bio: values.description,
      })
      toast.success('Profile saved successfully')
    }
    action()
    // Add your save logic here
  }



  return (

    <main className="flex-1 py-6 w-full flex justify-center">
      <div className="container w-2/3 px-4 sm:px-6">
        <div className=" grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="John Doe" />
                    <AvatarFallback className="text-2xl">JD</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>
                  {formData.firstName} {formData.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
                </div>

                <Separator />
                <div className="flex justify-center">

                  <Dialog
                    open={isPasswordDialogOpen}
                    onOpenChange={(e) => {
                      setIsPasswordDialogOpen(e)
                      clearPasswordChangeErrors();
                      resetPasswordChangeForm();
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">Change Password</Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your password to confirm your identity.
                      </DialogDescription>

                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label htmlFor="oldPassword">Old Password</Label>
                          <Input
                            id="oldPassword"
                            type="password"
                            placeholder="Enter your old password"
                            {...passwordFormRegister("oldPassword")}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter your new password"
                            {...passwordFormRegister("newPassword")}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your new password"
                            {...passwordFormRegister("confirmPassword")}
                          />
                        </div>

                        {passwordChangeErrors.oldPassword ? (
                          <p className="text-sm text-red-500">{passwordChangeErrors.oldPassword.message}</p>
                        ) : passwordChangeErrors.newPassword ? (
                          <p className="text-sm text-red-500">{passwordChangeErrors.newPassword.message}</p>
                        ) : passwordChangeErrors.confirmPassword ? (
                          <p className="text-sm text-red-500">{passwordChangeErrors.confirmPassword.message}</p>
                        ) : null}
                      </div>
                      <DialogFooter>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </DialogTrigger>
                        <Button
                          type="submit"
                          disabled={isPasswordChangeSubmitting} onClick={handleChangePasswordSubmit(onChangePassword)}
                        >
                          {isPasswordChangeSubmitting ? "Changing..." : "Change Password"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information and account settings</CardDescription>
              </CardHeader>
              <form onSubmit={userProfileForm.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" {...userProfileForm.register('username')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" {...userProfileForm.register('email')} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" {...userProfileForm.register('firstName')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" {...userProfileForm.register('lastName')} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" {...userProfileForm.register('description')} />
                  </div>


                  <div className="flex justify-end">
                    <Button disabled={userProfileForm.formState.isSubmitting}
                      type="submit" >
                      {userProfileForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>

              </form>

            </Card>
          </div>
        </div>
      </div>
    </main >
  );
};

export default Page;