
import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowDown01, ArrowUp01, Circle, Edit, Eye, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import type { Post } from "@/type/type";

interface ViewPostTableProps {
  handleSheetPreviewClicked: (post: Post) => void
  handleSortData: (sortProperty: string, sordDirection: string) => void
  handleDeletePost: (id: string) => void
  handleUpdatePostStatus: (id: string, status: string) => Promise<boolean>
  data: Post[]
}
const ViewPostTable: React.FC<ViewPostTableProps> = ({ handleSheetPreviewClicked, data, handleSortData,
  handleDeletePost, handleUpdatePostStatus }) => {
  const navigate = useNavigate()
  const [localData, setLocalData] = useState<Post[]>(data);
  useEffect(() => {
    setLocalData(data)
  }, [data])
  const columns: ColumnDef<Post>[] = useMemo(() => [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <SortHeader title={"ID"} handleSortData={handleSortData} sortProperty={column.id} />
        )
      },
      cell: ({ row }) => {
        return (
          <div className="text-left ps-3">
            {row.getValue("id")}
          </div>
        )
      }
    },
    {

      accessorKey: "title",
      header: ({ column }) => {
        return (
          <SortHeader title={"Title"} handleSortData={handleSortData} sortProperty={column.id} />
        )
      },
    },
    {
      accessorKey: "author",
      header: ({ column }) => {
        return (
          <SortHeader title={"Author Name"} handleSortData={handleSortData} sortProperty={column.id + ".username"} />

        )
      },
    },
    {
      accessorKey: "summary",
      header: ({ }) => {
        return (
          <Label> Summary </Label>
        )
      }
    },
    {
      accessorKey: "lastUpdated",
      header: ({ column }) => {
        return (
          <SortHeader title={"Last Updated"} handleSortData={handleSortData} sortProperty={column.id} />

        )
      },

    },
    {
      accessorKey: "status",
      header: () => (<div className="text-center">Status</div>),
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Select
              value={row.original.status}
              defaultValue={row.original.status}
              onValueChange={(val) => {
                handleUpdatePostStatus(row.original.id, val).then(
                  (updateSuccess) => {
                    if (updateSuccess) {
                      row.original.status = val
                      setLocalData(prev =>
                        prev.map(p => p.id === row.original.id ? { ...p, status: val } : p)
                      )
                    }
                  }
                )
              }} >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="DRAFT"> <Circle strokeWidth={0} fill="red" className="size-3" /><Label>Draft</Label></SelectItem>
                <SelectItem value="PENDING"> <Circle strokeWidth={0} fill="orange" className="size-3" /> PENDING</SelectItem>
                <SelectItem value="PUBLISHED"> <Circle strokeWidth={0} fill="green" className="size-3" /> PUBLISHED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      }
    },
    {
      id: "actions",
      header: () => <div className="text-center"> Action</div>,
      cell: ({ row }) => {

        row
        return (
          <div className="flex justify-center gap-1">
            <Button size={"icon"} onClick={() => {
              const post = row.original
              handleSheetPreviewClicked && handleSheetPreviewClicked(post)
            }}> <Eye /> </Button>
            <Button size={"icon"} onClick={() => {
              navigate(`/admin/posts/${row.original.id}`)
            }}>
              <Edit />
            </Button>
            <Button
              onClick={() => {
                if (row.original.id) {
                  handleDeletePost(row.original.id)
                }
              }}
            >
              <Trash />
            </Button>
          </div>
        )
      },
    },
  ], [])
  return (
    <DataTable columns={columns} data={localData} />
  );
}
interface SortHeaderProps {
  title : string,
  sortProperty: string,
  handleSortData: Function,
}
const  SortHeader : React.FC<SortHeaderProps> = ({ title, sortProperty, handleSortData }) => {
  const [ascending, setAscending] = useState(true)

  return (
    <div className="flex ">
      <Button
        variant="link"
        size={"icon"}
        onClick={() => {
          setAscending(!ascending)
          handleSortData && handleSortData(sortProperty, !ascending ? 'asc' : 'desc')

        }
        }
        className="size-5 m-0"
      >
        {ascending ? <ArrowUp01 /> : <ArrowDown01 />}
      </Button>
      <Label>{title}</Label>
    </div>
  )
}




export default ViewPostTable

