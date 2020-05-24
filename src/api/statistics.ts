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
