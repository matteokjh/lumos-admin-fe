import { UserProps } from "./user";

export interface ArticleProps {
    _id: string, // _id
    aid: string, // uuid
    title: string // 标题
    subTitle: string, // 副标题
    author: UserProps, // 作者
    headPic: string, // 头图
    content: string // 内容
    createTime: number // 发布时间
    modifiedTime: number // 最后修改时间
    tag: string[] // 标签
    type: ArticleType,
    show: boolean, // 管理员控制的是否显示
    collectors: string[], // 收藏者
    likers: string[] // 点赞者
    dislikers: string[], // 不爱者
    commentsCount?: number // 评论数目
}

export type ArticleType = 'draft' | 'post'