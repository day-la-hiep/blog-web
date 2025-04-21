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
        if(data.code != 1000){
            throw new Error(`Error fetching categories: ${data}`);
        }
        return data.result
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

export type Category = {
    name: string,
    slug: string,
    description: string,
};