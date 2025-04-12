import { FC, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/button'
import { Category } from '@/type/Category'
import { Edit } from 'lucide-react'
interface CategoryTablePros {
    data: Category[]
    handleDeleteCategoryClicked: (category : Category) => void
    handleEditCategoryClicked: (category : Category) => void
}

const CategoryTable: FC<CategoryTablePros> = ({ data, handleDeleteCategoryClicked, handleEditCategoryClicked }) => {

    const columnDef: ColumnDef<Category>[] = useMemo(
        () => (
            [
                {
                    accessorKey: "id",
                    header: "ID",
                    enableSorting: true,
                },
                {
                    accessorKey: "name",
                    header: "Category Name",
                },
                {
                    accessorKey: "slug",
                    header: "Slug",
                },
                {
                    accessorKey: "parentCategory",
                    header: "Parent Category",
                },

                {
                    accessorKey: "visible",
                    header: "Visible",
                },
                {
                    id: "actions",
                    header: () => <span className="text-center">Actions</span>,
                    cell : ({ row }) => {

                        return (
                            <Button variant={'outline'} onClick={() => {
                                const category = row.original
                                console.log("Nút của category table được nhấn:")
                                console.log(JSON.stringify(category))
                                handleEditCategoryClicked(category)
                            }}> <Edit></Edit> </Button>
                        )
                    },
                },
            ]
        ), []
    )

    return (
        <DataTable columns={columnDef} data={data}></DataTable>
    )
}
export default CategoryTable



