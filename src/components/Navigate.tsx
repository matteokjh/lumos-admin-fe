import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Index from '@/pages/Index'
import ExerciseList from '@/pages/ExerciseList'
import Exercise from '@/pages/Exercise'
import FilterGroup from '@/pages/FilterGroup'
import User from '@/pages/User'
import Article from '@/pages/Article'
import My404Component from './base/My404Component'
import { Popconfirm, message } from 'antd'
import { logout } from '@/api/user'
import '@/styles/Navigate.sass'
import { LogoutOutlined } from '@ant-design/icons'
import ArticleDetail from '@/pages/ArticleDetail'


const Navigate = (props: { collapsed: boolean }) => {
    const { collapsed } = props

    // methods
    const handlelogout = async () => {
        try {
            let res = await logout()
            if(res.code === 200) {
                window.location.reload()
            } else {
                message.error(res.msg)
            }
        } catch(err) {
            message.error(err)
        }
    }

    return (
        <div className="Navigate" style={{
            width: `calc(100vw - ${collapsed ? '80px' : '250px'})`
        }}>
            <div className="top">
                <Popconfirm placement="bottomLeft" title="确定要登出？" onConfirm={handlelogout} okText="确定" cancelText="取消">
                    <LogoutOutlined className="logout-icon" />
                </Popconfirm>
            </div>
            <Switch>
                {/* 主页 */}
                <Route exact path='/' component={Index}></Route>
                {/* 题目管理 */}
                <Route exact path='/exerciseList' component={ExerciseList}></Route>
                {/* 新增题目 */}
                <Route exact path='/exerciseList/new' component={Exercise}></Route>
                {/* 题目详情 */}
                <Route exact path='/exerciseList/detail/:id' component={Exercise}></Route>
                {/* 题集管理 */}
                <Route exact path='/filterGroup' component={FilterGroup}></Route>
                {/* 文章管理 */}
                <Route exact path='/article' component={Article}></Route>
                {/* 文章详情 */}
                <Route exact path='/article/detail/:aid' component={ArticleDetail}></Route>
                {/* 用户管理 */}
                <Route exact path='/user' component={User}></Route>
                {/* 404 */}
                <Route component={My404Component}></Route>
            </Switch>
        </div>
    )
}

export default Navigate