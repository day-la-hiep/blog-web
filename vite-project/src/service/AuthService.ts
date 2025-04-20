const baseUrl = "http://localhost:8080"
type tokenInfo = {
    username: string,
    scope: string[],
}
export const verifyToken = async (token : string): Promise<boolean> => {
    try{
        const response = await fetch(`${baseUrl}/api/auth/introspect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: token
            })
        })
        const res = await response.json()
        return res.result.valid

    }catch (error) {
        console.error("Error fetching data:", error);
        return false
    }

}

export const getTokenInfo = (token : string) : tokenInfo => {
    const payload = token.split(".")[1]
    const decodedPayload = atob(payload)
    const jsonPayload = JSON.parse(decodedPayload)
    return jsonPayload
}