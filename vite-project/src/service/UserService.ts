const baseUrl = 'http://localhost:8080/api/'
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



export async function verifyToken(token: string) {
    const url = `${baseUrl}auth/introspect`
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        return data.result
    })
}
export async function authenticate(username: string, password: string) {
    const url = `${baseUrl}auth/users`
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.result.authenticated) {
            return data.result
        } else {
            throw new Error('Authentication failed')
        }
    })
}

export async function logout() {
    return setTimeout(() => {
        return true
    }
    , 1000)
}