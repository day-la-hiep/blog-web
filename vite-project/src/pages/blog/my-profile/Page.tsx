import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-select";
import { toast } from "sonner";

// Define form schema
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
});

const Page: React.FC = () => {
  const [editing, setEditing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const a: z.infer<typeof formSchema> = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  }
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

  const handleSaveProfile = () => {
    setIsSubmitting(true)

    // In a real app, you would save the profile to the database
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setEditing(false);
    // Add your save logic here
  }

  function setChangePasswordDialogOpen(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (

    <main className="flex-1 py-6 w-full flex justify-center">
      <div className="container px-4 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
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
                <CardDescription>@{formData.username}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{formData.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">{formData.website}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Twitter</p>
                  <p className="text-sm text-muted-foreground">{formData.twitter}</p>
                </div>
                <Separator />
                <div className="flex justify-center">
                  <Button variant="outline" onClick={() => setChangePasswordDialogOpen(true)}>
                    Change Password
                  </Button>
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
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" value={formData.username} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} className="h-24" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" value={formData.website} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" name="twitter" value={formData.twitter} onChange={handleInputChange} />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isSubmitting}>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;