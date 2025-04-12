import { categories } from "@/FakeData";
import { Category } from "@/type/Category";
import { useCallback, useEffect, useState } from "react";

export default function useCategoryPage(){
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
    const [currentCategory, setCurrentCategory] = useState<Category>()
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(
        () => {
            console.log("Run into useEffect")
            getDataSample().then(categories => {
                setCategories(categories)
            })
        }, []
    )

    const removeCategory = useCallback((category: Category) => {
        setCategories(categories?.filter((item) => item !== category))
    }, [])

    const addCategory = useCallback((newCategory: Category) => {
        setCategories([...categories, newCategory])
    }, [])

    const updateCurrentCategory = useCallback((newCategory : Category) => {
        if(currentCategory){
            setCurrentCategory({
                ...currentCategory, 
                name: newCategory.name,
                slug: newCategory.slug,
                parentCategory: newCategory.parentCategory,
                visible: newCategory.visible
            })
        }
    }, [])

    return {
        isCategoryDialogOpen, setIsCategoryDialogOpen,
        currentCategory, setCurrentCategory,
        categories, setCategories,
        removeCategory,
        addCategory,
        updateCurrentCategory
    }
}

async function getData(): Promise<Category[]> {
    const categories: Category[] = []
    await new Promise(resolve => setTimeout(resolve, 0));
    for (let i = 0; i < 100; i++) {
        categories.push({
            id: i.toString(),
            name: "Technology",
            slug: "technology",
            parentCategory: "Tech",
            visible: true,
        })
    }

    return categories
}

async function getDataSample(): Promise<Category[]> {
    // const categories: Category[] = []
    // await new Promise(resolve => setTimeout(resolve, 0));
    // for (let i = 0; i < 100; i++) {
    //     categories.push({
    //         id: i.toString(),
    //         name: "Technology",
    //         slug: "technology",
    //         parentCategory: "Tech",
    //         visible: true,
    //     })
    // }

    return categories
}