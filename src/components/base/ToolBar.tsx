import React, { useState, useEffect } from "react";
import "@/styles/ToolBar.sass";
import {
    LikeFilled,
    StarFilled,
    DislikeFilled,
    ArrowLeftOutlined,
    RedoOutlined,
    CommentOutlined
} from "@ant-design/icons";
import { formatNumber } from "@/utils/methods";
import { ArticleProps } from "@/types/article";
import { useHistory } from "react-router-dom";

const ToolBar = (props: any) => {
    const [articleInfo, setArticleInfo] = useState({} as ArticleProps);
    const history = useHistory();
    const { refresh, commentTotal } = props;

    // methods
    const goBack = () => {
        history.go(-1);
    };

    useEffect(() => {
        setArticleInfo(props.articleInfo);
    }, [props.articleInfo]);

    return (
        <div className="ToolBar">
            <div className="back" onClick={goBack}>
                <ArrowLeftOutlined />
            </div>
            <div className="refresh" onClick={refresh}>
                <RedoOutlined />
            </div>
            <div className="like">
                <LikeFilled />
                <span>{formatNumber(articleInfo?.likers?.length)}</span>
            </div>
            <div className="dislike">
                <DislikeFilled />
                <span>{formatNumber(articleInfo?.dislikers?.length)}</span>
            </div>
            <div className="star">
                <StarFilled />
                <span>{formatNumber(articleInfo?.collectors?.length)}</span>
            </div>
            <div className="comment">
                <CommentOutlined />
                <span>{formatNumber(commentTotal)}</span>
            </div>
        </div>
    );
};
export default ToolBar;
