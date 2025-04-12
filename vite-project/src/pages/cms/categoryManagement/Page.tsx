import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { Category } from "@/type/Category";
import CategoryTable from "./CategoryTable";
import useCategoryPage from "./useCategoryPage";
import CategoryFormDialog from "./CategoryFormDialog";
import { Input } from "@/components/ui/input";
export default function Page() {
    const page = useCategoryPage()
    console.log("Category page rendered")
    console.log("Giá trị current category: " + JSON.stringify(page.currentCategory))
    return (
        <div className="p-5 flex flex-col w-full h-dvh max-h-dvh gap-5 overflow-hidden">
            <CategoryFormDialog category={page.currentCategory} open={page.isCategoryDialogOpen} onClose={() => { page.setIsCategoryDialogOpen(false) }} ></CategoryFormDialog>
            <div className="flex justify-between">
                <Label className="text-3xl">Category management</Label>
                <div className="flex gap-3">
                    <Input type="text" placeholder="Search"></Input>
                    <Button onClick={() => {
                        page.setIsCategoryDialogOpen(true)
                        page.setCurrentCategory(undefined)
                    }}><FolderPlus></FolderPlus></Button>
                </div>
            </div>
            <div className="overflow-auto">
                <CategoryTable data={page.categories}
                    handleDeleteCategoryClicked={page.removeCategory}
                    handleEditCategoryClicked={(category: Category) => {
                        console.log("Mở cửa số và set current category")
                        page.setIsCategoryDialogOpen(true)
                        page.setCurrentCategory(category)
                    }}></CategoryTable>
            </div>
        </div>
    )
}



