import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Index from '../pages/Index'
import ExerciseList from '../pages/ExerciseList'
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
                <Route exact path='/' component={Index}></Route>
                <Route exact path='/exerciseList' component={ExerciseList}></Route>
                <Route component={My404Component}></Route>
            </Switch>
        </div>
    )
}

export default Navigate