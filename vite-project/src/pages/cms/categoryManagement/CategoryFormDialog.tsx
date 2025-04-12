
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { FC } from 'react'
import { Category } from "@/type/Category";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Define the schema using zod
const CategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  parentCategory: z.string().nullable(),
  visible: z.boolean(),
});

// Define the form data type based on zod schema
type CategoryFormData = z.infer<typeof CategorySchema>;

// Sample parent categories (replace with dynamic data from API)
const sampleCategories = [
  { id: "1", name: "Technology", slug: "tech" },
  { id: "2", name: "Health", slug: "health" },
  { id: "3", name: "Sports", slug: "sports" },
];
interface CategoryFormProps {
  open: boolean
  onClose: () => void
  category?: Category
}
const CategoryForm: FC<CategoryFormProps> = ({ open, onClose, category }) => {
  console.log("Form rendered")
  console.log("Category: " + category?.name + " " + category?.id)
  const defaultValue = {
    name: "",
    slug: "",
    parentCategory: "",
    visible: false,
    ...category,
  }
  console.log("Giá trị category sau khi render vào form: " + JSON.stringify(defaultValue))
  console.log("Giá trị category default sau khi render vào form: " + JSON.stringify(defaultValue))
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: defaultValue
  });

  useEffect(() => {
    form.reset(defaultValue)
  }, [category, form.reset]);



  const onSubmit = (data: CategoryFormData) => {
    toast("Submitted", {
      description: `${JSON.stringify(data)}`,
    });
    console.log("Form Data:", data);

    onClose()
  };

  return (
    <Dialog open={open} onOpenChange={() => {
      onClose()
      form.reset()
    }}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
        <DialogTitle>{category ? "Edit category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{category ? "Edit your category" : "Create your own category"}</DialogDescription>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your category name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter slug" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the slug for the category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <SelectTrigger >
                        <SelectValue placeholder="Select parent category"/>
                      </SelectTrigger>
                      <SelectContent>
                        {sampleCategories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a parent category if applicable
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visible</FormLabel>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    Check if the category should be visible
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
