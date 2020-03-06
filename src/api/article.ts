import fetch from './'

const PREFIX = 'admin/article'

export const articleShow = (aid: string, show: boolean) => {
    return fetch.put(`${PREFIX}/articleShow`, {
        aid,
        show
    });
}

export const getList = () => {
    return fetch.get(`${PREFIX}/getList`);
};
// 获取单篇
export const getArticle = (aid: string) => {
    return fetch.get(`${PREFIX}/`, {
        params: {
            aid,
        },
    })
}
export const deleteArticle = (aid: string) => {
    return fetch.delete(`${PREFIX}/`, {
        params: {
            aid
        }
    })
}