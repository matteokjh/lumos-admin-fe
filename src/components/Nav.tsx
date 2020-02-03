import React from 'react'
import { Menu, Icon } from 'antd'
import { NavLink, useLocation } from 'react-router-dom'
import Header from './Header'
import '../styles/Nav.sass'

const Nav = (props: { collapsed: boolean, setCollapsed: (c: boolean) => void }) => {
    const { collapsed, setCollapsed } = props
    const location = useLocation()

    return (
        <div className="Nav" style={{
            width: collapsed ? '80px' : '250px'
        }}>
            <Icon className='collapse-btn' onClick={() => setCollapsed(!collapsed)} type={collapsed ? 'menu-unfold' : 'menu-fold'} />
            <Menu selectedKeys={[`/${location.pathname.split('/')[1]}`]} inlineCollapsed={collapsed} mode='inline' theme='dark' defaultSelectedKeys={['/']}>
                <Header collapsed={collapsed}></Header>
                {/* 主页 */}
                <Menu.Item key='/'>
                    <NavLink to='/'>
                        <Icon type="home" />
                        <span>主页</span>
                    </NavLink>
                </Menu.Item>
                {/* 题目管理 */}
                <Menu.Item key='/exerciseList'>
                    <NavLink to='/exerciseList'>
                        <Icon type="container" />
                        <span>题目管理</span>
                    </NavLink>
                </Menu.Item>
                {/* 题集管理 */}
                <Menu.Item key='/filterGroup'>
                    <NavLink to='/filterGroup'>
                        <Icon type="audit" />
                        <span>题集管理</span>
                    </NavLink>
                </Menu.Item>
                {/* 用户管理 */}
                <Menu.Item key='/user'>
                    <NavLink to='/user'>
                        <Icon type="user" />
                        <span>用户管理</span>
                    </NavLink>
                </Menu.Item>
            </Menu>
        </div>
    )
}

export default Nav