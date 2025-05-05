import {
    Table, TableBody, TableCaption, TableCell,
    TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { TablePagination } from "../../pages/admin/dashboard/TablePagination";

type Column = {
    header: string;
    accessor: string;
};

type TableProps<T> = {
    col: Column[];
    data: T[];
};

export default function BasicTable<T>({ col, data }: TableProps<T>) {
    return (
        <>
            <Table className="w-full h-full flex-grow">
                <TableHeader className="sticky top-0">
                    <TableRow>
                        {col.map((column) => (
                            <TableHead key={column.accessor}>{column.header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {col.map((column) => (
                                <TableCell key={column.accessor}>
                                    {String(row[column.accessor as keyof T] ?? "")}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination />
        </>
    );
}
