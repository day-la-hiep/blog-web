import { baseUrl } from "@/utils/AppInfo";
import axios from "axios";
import { Trophy } from "lucide-react";
import { ac } from "node_modules/@faker-js/faker/dist/airline-CBNP41sR";

export async function fetchCategories() {
    try {
        const response = await fetch("http://localhost:8080/api/categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.code != 1000) {
            throw new Error(`Error fetching categories: ${data}`);
        }
        return data.result
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}


export async function fetchPublicCategories(
    page: number = 0,
    limit: number = 10,
    sortBy: string = "name",
    search?: string,
) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${baseUrl}/public/categories`, {
            params: {
                page: page,
                limit: limit,
                sortBy: sortBy,
                search: search,
            }
        })
    
        return res.data.result;
    } catch (error) {
        console.log("Fetch categories error")
    }
}


export type Category = {
    name: string,
    slug: string,
    description: string,
};