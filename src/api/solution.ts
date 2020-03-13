import fetch from './'


export const getList = (obj: any) => {
    return fetch.get(`/admin/solution/list`, {
        params: obj
    })
}

export const getSolution = (sid: string) => {
    return fetch.get(`/user/solution`, {
        params: {
            sid
        }
    })
}