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
            <Menu selectedKeys={[location.pathname]} inlineCollapsed={collapsed} mode='inline' theme='dark' defaultSelectedKeys={['/']}>
                <Header collapsed={collapsed}></Header>
                <Menu.Item key='/'>
                    <NavLink to='/'>
                        <Icon type="home" />
                        <span>主页</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key='/exerciseList'>
                    <NavLink to='/exerciseList'>
                        <Icon type="container" />
                        <span>管理题目</span>
                    </NavLink>
                </Menu.Item>
            </Menu>
        </div>
    )
}

export default Nav