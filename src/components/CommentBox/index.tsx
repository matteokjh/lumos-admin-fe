import React, { useContext } from 'react'
import { store } from '@/store'
import { CommentProps } from '@/types/comment'
import { convertComment } from '@/utils/methods'
import CommentList from './CommentList'
import '@/styles/CommentBox.sass'

const CommentBox = (props: {
    commentList: CommentProps[]
    ban: (cid: string) => any
    refreshComment: () => void
}) => {
    const { commentList, ban, refreshComment } = props
    const { userInfo } = useContext(store).state

    // methods

    return (
        <div className="CommentBox">
            <p className="title">文章评论</p>
            {/* 主体 */}
            <CommentList
                ban={ban}
                refresh={refreshComment}
                userInfo={userInfo}
                list={convertComment(commentList)}
            ></CommentList>
        </div>
    )
}

export default CommentBox
