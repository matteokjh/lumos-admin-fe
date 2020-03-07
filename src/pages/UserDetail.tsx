import React, { useState, useEffect } from "react";
import { UserProps } from "@/types/user";
import { message, Button } from "antd";
import { getUser } from "@/api/user";
import { useHistory } from "react-router-dom";
import { formatSex, formatWebsite, formatPermission } from "@/utils/methods";
import "@/styles/UserDetail.sass";

const UserDetail = (props: any) => {
    const [userInfo, setUserInfo] = useState({} as UserProps);
    const history = useHistory();
    // methods
    const goBack = () => {
        history.go(-1);
    };

    useEffect(() => {
        (async () => {
            let username = props.match.params.username;
            try {
                let res = await getUser(username);
                if (res.code === 200) {
                    console.log(res.data);
                    setUserInfo(res.data);
                } else {
                    message.error(res.msg);
                }
            } catch (err) {
                message.error(err);
            }
        })();
    }, [props.match.params.username]);

    return (
        <div className="UserDetail">
            {/* 按钮组 */}
            <div className="toolbar">
                <Button onClick={goBack}>返回</Button>
            </div>
            <div className="main">
                <div className="infoCard">
                    <div className="left">
                        <div className="row">
                            <div className="item">
                                <p>用户名</p>
                                <span>{userInfo.username}</span>
                            </div>
                            <div className="item">
                                <p>昵称</p>
                                <span>{userInfo.name}</span>
                            </div>
                            <div className="item">
                                <p>性别</p>
                                <span>{formatSex(userInfo.sex)}</span>
                            </div>
                            <div className="item">
                                <p>生日</p>
                                <span>{userInfo.birthday}</span>
                            </div>
                            <div className="item">
                                <p>职业</p>
                                <span>{userInfo.work}</span>
                            </div>
                            <div className="item">
                                <p>个人网站</p>
                                <a
                                    href={formatWebsite(userInfo.website)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {userInfo.website}
                                </a>
                            </div>
                            <div className="item">
                                <p>位置</p>
                                <span>{userInfo.location}</span>
                            </div>
                            <div className="item">
                                <p>激活</p>
                                <span>{userInfo.initialize ? "是" : "否"}</span>
                            </div>
                            <div className="item">
                                <p>权限</p>
                                <span>{formatPermission(userInfo.permission)}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="item companys">
                                <p>公司</p>
                                <ul>
                                    {userInfo.companys?.map((e, idx) => (
                                        <li key={`company_${idx}`}>
                                            <span>{e.name}</span>
                                            <span>{e.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="item schools">
                                <p>学校</p>
                                <ul>
                                    {userInfo.schools?.map((e, idx) => (
                                        <li key={`schools_${idx}`}>
                                            <span>{e.name}</span>
                                            <span>{e.time}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="row">
                            <div className="item">
                                <p>个人介绍</p>
                                <span>{userInfo.introduction}</span>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div
                            className="avatar"
                            style={{
                                backgroundImage: `url(${userInfo.avatar})`
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
