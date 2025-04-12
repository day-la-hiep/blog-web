import BasicTable from "@/components/ui/BasicTable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Table(){
    return(
        <ScrollArea className="w-full">
            <BasicTable data={articles} col={columns}/>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}

const articles = [
    { id: "1", title: "React 18 Features", author: "John Doe", date: "2024-03-09" },
    { id: "2", title: "TypeScript Generics Explained", author: "Jane Smith", date: "2024-03-08" },
    { id: "3", title: "State Management in React", author: "Alice Johnson", date: "2024-03-07" },
    { id: "4", title: "Next.js vs React: When to Choose What?", author: "Bob Brown", date: "2024-03-06" },
    { id: "1", title: "React 18 Features", author: "John Doe", date: "2024-03-09" },
    { id: "2", title: "TypeScript Generics Explained", author: "Jane Smith", date: "2024-03-08" },
    { id: "3", title: "State Management in React", author: "Alice Johnson", date: "2024-03-07" },
    { id: "4", title: "Next.js vs React: When to Choose What?", author: "Bob Brown", date: "2024-03-06" },
    { id: "1", title: "React 18 Features", author: "John Doe", date: "2024-03-09" },
    { id: "2", title: "TypeScript Generics Explained", author: "Jane Smith", date: "2024-03-08" },
    { id: "3", title: "State Management in React", author: "Alice Johnson", date: "2024-03-07" },
    { id: "4", title: "Next.js vs React: When to Choose What?", author: "Bob Brown", date: "2024-03-06" },

];

const columns = [
    { header: "ID", accessor: "id" },
    { header: "Title", accessor: "title" },
    { header: "Author", accessor: "author" },
    { header: "Published Date", accessor: "date" },
];