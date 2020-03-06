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