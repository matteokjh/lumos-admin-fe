import React, { useState, useEffect } from "react";
import { ConvertedCommentProps } from "@/types/comment";
import { formatNumber } from "@/utils/methods";
import { formatTime } from "@/utils/methods";
import { LikeOutlined, StopOutlined } from "@ant-design/icons";
import CommentList from "./CommentList";
import { Link } from "react-router-dom";
import { Popconfirm } from "antd";
import { UserProps } from "@/types/user";
import "@/styles/CommentItem.sass";

interface ItemProps {
    commentInfo: ConvertedCommentProps;
    ban: (cid: string) => any;
    userInfo: UserProps;
    refresh: () => void;
}

const CommentItem = (props: ItemProps) => {
    const { ban, refresh, userInfo } = props;
    const [commentInfo, setCommentInfo] = useState({} as ConvertedCommentProps);
    const [like, setLikes] = useState(0);

    // methods
    useEffect(() => {
        setCommentInfo(props.commentInfo);
        setLikes(props.commentInfo.like.length);
    }, [props.commentInfo]);

    return (
        <div className="commentItem">
            <div className="item_top">
                <Link
                    to={`/user/${commentInfo.userInfo?.username}/baseinfo`}
                    target="_blank"
                >
                    <div
                        className="avatar"
                        style={{
                            backgroundImage: `url(${commentInfo.userInfo?.avatar})`
                        }}
                    ></div>
                </Link>
                <div className="content">
                    <p>{commentInfo.userInfo?.name}</p>
                    <p>
                        {commentInfo.fatherComment &&
                            `回复 ${commentInfo.to.name}：`}
                        {commentInfo.content}
                    </p>
                    {/* 底部栏 */}
                    <div className="bottom-bar">
                        <span className="time">
                            {formatTime(commentInfo.createTime)}
                        </span>
                        <div className="btn-wrapper">
                            <span className="like">
                                <LikeOutlined />
                                <span>{formatNumber(like)}</span>
                            </span>
                            <Popconfirm
                                okText="确定"
                                cancelText="取消"
                                onConfirm={() => ban(commentInfo.cid)}
                                title="确认标记该评论为违规评论？"
                            >
                                <StopOutlined />
                            </Popconfirm>
                        </div>
                    </div>
                </div>
            </div>
            {commentInfo.children?.length ? (
                <CommentList
                    userInfo={userInfo}
                    refresh={refresh}
                    list={commentInfo.children}
                    ban={ban}
                ></CommentList>
            ) : (
                ""
            )}
        </div>
    );
};

export default CommentItem;
