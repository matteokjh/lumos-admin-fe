import fetch from "./";
const PREFIX = "/comment";

// 获取某文章的评论列表
export const getCommentList = (aid: string) => {
    return fetch.get(`${PREFIX}`, {
        params: {
            aid
        }
    });
};
// 标记违规评论
export const commentBan = (cid: string) => {
    return fetch.put(`/admin${PREFIX}/ban`, {
        cid
    });
};
