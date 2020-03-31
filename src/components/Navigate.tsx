import React, { lazy, Suspense, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import Index from "@/pages/Index";
import Waiting from "@/pages/Waiting";
import My404Component from "./base/My404Component";
import Exercise from "@/pages/Exercise";
import { Popconfirm, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { logout } from "@/api/user";
import { store } from "@/store";
import "@/styles/Navigate.sass";

import UserDetail from "@/pages/UserDetail";

const Navigate = () => {
    const { userInfo } = useContext(store).state;

    // methods
    const handlelogout = async () => {
        try {
            let res = await logout();
            if (res.code === 200) {
                window.location.reload();
            } else {
                message.error(res.msg);
            }
        } catch (err) {
            message.error(err);
        }
    };

    return (
        <div className="Navigate">
            <div className="top">
                <span>{userInfo?.name}，欢迎回来</span>
                <Popconfirm
                    placement="bottomLeft"
                    title="确定要登出？"
                    onConfirm={handlelogout}
                    okText="确定"
                    cancelText="取消"
                >
                    <LogoutOutlined className="logout-icon" />
                </Popconfirm>
            </div>
            <Suspense fallback={<Waiting></Waiting>}>
                <Switch>
                    {/* 主页 */}
                    <Route exact path="/" component={Index}></Route>
                    {/* 题目管理 */}
                    <Route
                        exact
                        path="/exercise"
                        component={lazy(() => import("@/pages/ExerciseList"))}
                    ></Route>
                    {/* 提交记录 */}
                    <Route
                        exact
                        path="/solution"
                        component={lazy(() => import("@/pages/SolutionList"))}
                    ></Route>
                    {/* 提交记录详情 */}
                    <Route
                        exact
                        path="/solution/:sid"
                        component={lazy(() => import("@/pages/SolutionDetail"))}
                    ></Route>
                    {/* 新增题目 */}
                    <Route
                        exact
                        path="/exercise/new"
                        component={Exercise}
                    ></Route>
                    {/* 题目详情 */}
                    <Route
                        exact
                        path="/exercise/detail/:id"
                        component={Exercise}
                    ></Route>
                    {/* 题集管理 */}
                    <Route
                        exact
                        path="/filterGroup"
                        component={lazy(() => import("@/pages/FilterGroup"))}
                    ></Route>
                    {/* 文章管理 */}
                    <Route
                        exact
                        path="/article"
                        component={lazy(() => import("@/pages/Article"))}
                    ></Route>
                    {/* 文章详情 */}
                    <Route
                        exact
                        path="/article/detail/:aid"
                        component={lazy(() => import("@/pages/ArticleDetail"))}
                    ></Route>
                    {/* 用户管理 */}
                    <Route
                        exact
                        path="/user"
                        component={lazy(() => import("@/pages/User"))}
                    ></Route>
                    {/* 用户详情 */}
                    <Route
                        exact
                        path="/user/detail/:username"
                        // component={lazy(() => import("@/pages/UserDetail"))}
                        component={UserDetail}
                    ></Route>
                    {/* 404 */}
                    <Route component={My404Component}></Route>
                </Switch>
            </Suspense>
        </div>
    );
};

export default Navigate;
