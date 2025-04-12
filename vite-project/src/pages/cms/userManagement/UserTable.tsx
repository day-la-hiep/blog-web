import { useMemo } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/type/User";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Eye } from "lucide-react";

interface ViewUserTableProps {
  handleSheetPreviewClicked?: (user: User) => void;
  data: User[];
}

const ViewUserTable: React.FC<ViewUserTableProps> = ({ handleSheetPreviewClicked, data }) => {
  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "username",
        header: "Username",
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone",
      },
      {
        id: "actions",
        header: () => <span className="text-center">Action</span>,
        cell: ({ row }) => (
          <Button 
            variant={"outline"}
            onClick={() => {
              const user = row.original;
              handleSheetPreviewClicked && handleSheetPreviewClicked(user);
            }}
          >
            <Edit />
          </Button>
        ),
      },
    ],
    []
  );

  return <DataTable columns={columns} data={data} />;
};

export default ViewUserTable;
