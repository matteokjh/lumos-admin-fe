import React from 'react'
import CommentItem from './CommentItem'
import { ConvertedCommentProps } from '@/types/comment'
import '@/styles/CommentList.sass'
import { UserProps } from '@/types/user'

interface ListProps {
    list: ConvertedCommentProps[]
    ban: (cid: string) => any
    refresh: () => void
    userInfo: UserProps
}

const CommentList = (props: ListProps) => {
    const { list, ban, refresh, userInfo } = props
    return (
        <div className="commentList">
            {list.length
                ? list.map(e => (
                      <CommentItem
                          ban={ban}
                          refresh={refresh}
                          key={e.cid}
                          commentInfo={e}
                          userInfo={userInfo}
                      ></CommentItem>
                  ))
                : ''}
        </div>
    )
}

export default CommentList
