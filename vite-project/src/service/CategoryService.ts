export async function fetchCategories() {
    const token = localStorage.getItem('token')
    try {
        const response = await fetch("http://localhost:8080/api/categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

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