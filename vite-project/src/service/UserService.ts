const baseUrl = 'localhost:8080/api/'
export type User = {
    id: number,
    fullname: string,
    username: string,
    password: string,
    description: string,
    mail: string,
}

export type UserRegisterRequest = {
    fullname: string,
    username: string,
    password: string,
    mail: string,
}

export function register(request : UserRegisterRequest){
    const url = `${baseUrl}`
}