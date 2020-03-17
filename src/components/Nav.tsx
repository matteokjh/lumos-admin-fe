import React from "react";
import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import Header from "./base/Header";
import {
    AuditOutlined,
    ContainerOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    HomeOutlined,
    ReadOutlined
} from "@ant-design/icons";
import "@/styles/Nav.sass";

const Nav = (props: {
    collapsed: boolean;
    setCollapsed: (c: boolean) => void;
}) => {
    const { collapsed, setCollapsed } = props;
    const location = useLocation();

    return (
        <div
            className="Nav"
            style={{
                width: collapsed ? "80px" : "250px"
            }}
        >
            <span
                className="collapse-btn"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <Menu
                selectedKeys={[`/${location.pathname.split("/")[1]}`]}
                inlineCollapsed={collapsed}
                mode="inline"
                theme="dark"
                defaultSelectedKeys={["/"]}
            >
                <Header collapsed={collapsed}></Header>
                {/* 主页 */}
                <Menu.Item key="/">
                    <NavLink to="/">
                        <HomeOutlined />
                        <span>主页</span>
                    </NavLink>
                </Menu.Item>
                {/* 题目管理 */}
                <Menu.Item key="/exercise">
                    <NavLink to="/exercise">
                        <ContainerOutlined />
                        <span>题目管理</span>
                    </NavLink>
                </Menu.Item>
                {/* 提交记录 */}
                <Menu.Item key="/solution">
                    <NavLink to="/solution">
                        <ContainerOutlined />
                        <span>提交记录</span>
                    </NavLink>
                </Menu.Item>
                {/* 题集管理 */}
                <Menu.Item key="/filterGroup">
                    <NavLink to="/filterGroup">
                        <AuditOutlined />
                        <span>题集管理</span>
                    </NavLink>
                </Menu.Item>
                {/* 文章管理 */}
                <Menu.Item key="/article">
                    <NavLink to="/article">
                        <ReadOutlined />
                        <span>文章管理</span>
                    </NavLink>
                </Menu.Item>
                {/* 用户管理 */}
                <Menu.Item key="/user">
                    <NavLink to="/user">
                        <UserOutlined />
                        <span>用户管理</span>
                    </NavLink>
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default Nav;
