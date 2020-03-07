import fetch from "./index";
import { UserSearchProps, LoginProps } from "@/types/user";

const PREFIX = "admin/user";

export const getToken = () => {
    return fetch.get(`${PREFIX}/`)
}

export const login = (obj: LoginProps) => {
    return fetch.post(`${PREFIX}/login`, obj)
}

export const userList = (obj: UserSearchProps) => {
    return fetch.get(`${PREFIX}/userlist`, {
        params: obj
    })
}

export const logout = () => {
    return fetch.post(`${PREFIX}/logout`)
}

export const deleteUser = (username: string) => {
    return fetch.delete(`${PREFIX}/deleteuser`, {
        params: {
            username
        }
    })
}

export const getUser = (username: string) => {
    return fetch.get(`${PREFIX}/`, {
        params: {
            username
        }
    })
}

export const changePermission = (username: string, p: number) => {
    return fetch.put(`${PREFIX}/permission`, {
        username,
        permission: p
    })
}