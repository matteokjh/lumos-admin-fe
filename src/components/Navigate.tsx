import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Index from '../pages/Index'
import ExerciseList from '../pages/ExerciseList'
import Exercise from '../pages/Exercise'
import FilterGroup from '../pages/FilterGroup'
import User from '../pages/User'
import My404Component from './My404Component'
import '../styles/Navigate.sass'


const Navigate = (props: { collapsed: boolean }) => {
    const { collapsed } = props

    return (
        <div className="Navigate" style={{
            width: `calc(100vw - ${collapsed ? '80px' : '250px'})`
        }}>
            <div className="top">
            </div>
            <Switch>
                {/* 主页 */}
                <Route exact path='/' component={Index}></Route>
                {/* 题目管理 */}
                <Route exact path='/exerciseList' component={ExerciseList}></Route>
                {/* 新增题目 */}
                <Route exact path='/exerciseList/new' component={Exercise}></Route>
                {/* 题集管理 */}
                <Route exact path='/filterGroup' component={FilterGroup}></Route>
                {/* 用户管理 */}
                <Route exact path='/user' component={User}></Route>
                {/* 404 */}
                <Route component={My404Component}></Route>
            </Switch>
        </div>
    )
}

export default Navigate