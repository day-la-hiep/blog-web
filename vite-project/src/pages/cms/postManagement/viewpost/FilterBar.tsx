import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostFilter } from "@/service/PostService";
import { Filter } from "lucide-react";
import { useForm } from "react-hook-form";


const articleStatus = ['Draft', 'Pending', 'Published']

interface filterBarProps {
    onFilterClicked: (filterParam: PostFilter) => void
}
const FilterBar: React.FC<filterBarProps> = ({ onFilterClicked }) => {
    const form = useForm<PostFilter>({
        defaultValues: {
            authorName: "",
            status: "",
            textOrId: "",
        }
    });

    const onSubmit = (data: PostFilter) => {
        onFilterClicked(data)
        console.log(JSON.stringify(data, null, 2))
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center justify-between border-2 p-4 rounded-2xl border-gray-400">
                <div className="flex gap-2">
                    <FormField control={form.control} name="textOrId" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Text or ID</FormLabel>
                            <FormControl>
                                <Input placeholder="Type your ID or text"  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="authorName" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Author</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter author" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="startDate" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Start Date</FormLabel>
                            <FormControl>
                                <DatePicker value={field.value} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="endDate" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">End Date</FormLabel>
                            <FormControl>
                                <DatePicker value={field.value} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                    {
                                        articleStatus.map((status) => {
                                            return (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <Button type="submit" variant="outline">
                    <Filter className="mr-2" /> Apply
                </Button>
            </form>
        </Form>
    );
}
export default FilterBar