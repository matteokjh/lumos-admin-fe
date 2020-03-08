import fetch from './'

const PREFIX = `/solution`

export const getSolution = (sid: string) => {
    return fetch.get(`${PREFIX}`, {
        params: {
            sid
        }
    })
}