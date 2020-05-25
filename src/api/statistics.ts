import fetch from './'

const PREFIX = 'admin/statistics'

export const getCDNStatistics = (obj?: {
    since?: string,
    until?: string
}) => {
    return fetch.get(`${PREFIX}`, {
        params: obj
    })
};

export const getExeStatistics = (obj?: any) => {
    return fetch.get(`${PREFIX}/exercise`, {
        params: obj
    })
}

export const getSolutionStatistics = (obj?: any) => {
    return fetch.get(`${PREFIX}/solution`, {
        params: obj
    })
}