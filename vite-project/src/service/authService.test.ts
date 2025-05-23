import { login } from "./AuthApi.ts";

login("admin", "admin").then(
    (res) => {
        console.log(res)
    }
)
