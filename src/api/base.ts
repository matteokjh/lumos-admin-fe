import fetch from './'

export const fetchUser = (username: string) => {
    return fetch.get(`/admin/fetch/user`, {
        params: {
            username
        }
    })
}